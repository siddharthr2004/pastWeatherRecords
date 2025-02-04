const https = require('https');

const axios = require('axios'); // CommonJS


class pastWeather {
    constructor(locationID) {
        this.locationID = locationID;
    }
    
    async getData() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'www.ncei.noaa.gov',
                path: `/cdo-web/api/v2/stations/${this.locationID}`, // Corrected path with template literal
                method: 'GET', // Corrected HTTP method
                headers: {
                    'token': 'wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU', // NOAA API token
                },
                timeout: 10000, // Timeout setting
            };

            const req = https.request(options, (res) => {
                let data = '';

                // Collect data chunks
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // Process response on 'end'
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const result = JSON.parse(data); // Parse JSON response
                            resolve(result);
                        } catch (error) {
                            reject(new Error("Failed to parse JSON response"));
                        }
                    } else {
                        reject(new Error(`HTTP error: ${res.statusCode}`));
                    }
                });
            });

            // Handle request errors
            req.on('error', (error) => {
                reject(error);
            });

            // Handle request timeout
            req.on('timeout', () => {
                req.destroy(); // Abort the request
                reject(new Error('Request has timed out'));
            });

            // End the request
            req.end();
        });
    }
    
    
    async getPastWeather(start, end) {
        return new Promise((resolve, reject) => {
            let offset = 0;
            const limit = 800;
            let allData = [];
    
            const options = {
                hostname: 'www.ncei.noaa.gov',
                path: `/cdo-web/api/v2/data?stationid=${this.locationID}&datasetid=GSOM&startdate=${start}&enddate=${end}&limit=${limit}&offset=${offset}`,
                method: 'GET',
                headers: {
                    'token': 'wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU',
                },
            };

            //console.log("Request Details:", options);

    
            const req = https.request(options, (res) => {
                let data = '';
    
                res.on('data', (chunk) => {
                    data += chunk;
                });
    
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            //console.log("Raw Response Data:", data);
                            const response = JSON.parse(data);
                            //console.log("Parsed Response:", response);
    
                            const results = response.results || [];
                            
                            if (results.length === 0) {
                                console.log("No results returned for this request.");
                            }
                            
    
                            allData = allData.concat(results);
    
                            const firstTemps = [];
                            const firstPrecip = [];
    
                            allData.forEach(item => {
                                if (item.datatype === 'PRCP') {
                                    const month = item.date.split("T")[0].split("-")[1]; // Extract the month
                                    const year = item.date.split("T")[0].split("-")[0]; // Extract year
                                    firstPrecip.push({ value: item.value, month, year });
                                }
                                if (item.datatype === 'TAVG') {
                                    const month = item.date.split("T")[0].split("-")[1]; // Extract the month
                                    const year = item.date.split("T")[0].split("-")[0]; // Extract year
                                    firstTemps.push({ value: item.value, month, year });
                                }
                            });
    
                            resolve({ firstTemps, firstPrecip, location: this.locationID });
                        } catch (error) {
                            console.error("JSON Parsing Error:", error.message);
                            reject(error);
                        }
                    } else {
                        console.error("HTTP Error:", res.statusCode);
                        reject(new Error(`HTTP error: ${res.statusCode}`));
                    }
                });
            });
    
            req.on('error', (error) => {
                console.error("Request Error:", error.message);
                reject(error);
            });
            /*
            req.on('timeout', () => {
                console.error("Request Timeout");
                req.destroy();
                reject(new Error('Request has timed out'));
            });
            */
    
            req.end();
        });
    }
    
    
    async allData() {
        return new Promise(async (resolve, reject) => {
            // Aggregate temperatures and precipitation
            const allMonthlyTempsAgg = [];
            const allMonthlyPrecipAgg = [];
    
            try {
                // Get the start and end dates
                const startAndEnd = await this.getData();
    
                if (!startAndEnd) {
                    console.log("Can't retrieve metadata.");
                    return reject(new Error("No metadata available."));
                }
    
                // Extract start and end dates
                const { mindate: startDate, maxdate: endDate } = startAndEnd;
    
                // Validate dates
                let currentStartDate = new Date(startDate);
                const finalEndDate = new Date(endDate);
    
                if (isNaN(currentStartDate) || isNaN(finalEndDate)) {
                    console.error("Invalid start or end date:", { startDate, endDate });
                    return reject(new Error("Invalid date format in metadata."));
                }
    
                // Helper function for retries
                const retryWithBackoff = async (fn, retries = 5, delay = 1000) => {
                    //return the API call if found 
                    try {
                        return await fn();
                        //if NOT
                    } catch (error) {
                        //If the amount of retries is above 0, send the corresponding error msg
                        if (
                            retries > 0 &&
                            (error.message.includes("429") || error.message.includes("503"))
                        ) {
                            //Setthe waitTime to the delay (1 second) timesthe number of retries you currently have
                            const waitTime = delay * (6 - retries); // Exponential backoff
                            //Send this msg
                            console.log(
                                `Rate limit or server issue. Retrying in ${waitTime}ms...`
                            );
                            //await a new promise which you resolve if the waitTime has completed
                            await new Promise((resolve) => setTimeout(resolve, waitTime));
                            //recursively return with the amount of retries (5) - 1 for each retry
                            return retryWithBackoff(fn, retries - 1, delay);
                        }
                        throw error; // Exhaust retries or other error
                    }
                };
    
                // Get a range of values for some date
                const processRange = (start, end) => {
                    return new Promise(async (resolveRange, rejectRange) => {
                        try {
                            //console.log(`Fetching data for range: ${start} to ${end}`);
                            //get the data "blocked" together by calling the const retryWithBackoff method
                            //Here,the fn() function is the getPastWeather method with the arguments for that method being 
                            //the startand end date which we get
                            //This is essentially the function which gets a piece of the blocked data and employs the backoff
                            //method to actually take these values in 
                            const blockedData = await retryWithBackoff(() =>
                                this.getPastWeather(
                                    start.toISOString().split("T")[0],
                                    end.toISOString().split("T")[0]
                                )
                            );
                            
                           // console.log(`Data fetched for range: ${start} to ${end}`);
                           //This adds the firstTemps returned value of the getPastWeatherfunction to the allMonthlyTempsAgg
                           //and does the same for precip too
                            // Aggregate temperatures and precipitation
                            blockedData.firstTemps.forEach((temp) =>
                                allMonthlyTempsAgg.push(temp)
                            );
                            blockedData.firstPrecip.forEach((precip) =>
                                allMonthlyPrecipAgg.push(precip)
                            );
    
                            resolveRange();
                        } catch (error) {
                            console.error(`Error fetching data for range: ${start} to ${end}`, error);
                            rejectRange(error);
                        }
                    });
                };
                //this is our entire range to iterate through
                const rangePromises = [];
    
                // Iterate through date ranges
                while (currentStartDate < finalEndDate) {
                    const currentEndDate = new Date(currentStartDate);
    
                    // Set the range end date (+3 years) or cap it at the final end date
                    currentEndDate.setFullYear(currentEndDate.getFullYear() + 3);
                    if (currentEndDate > finalEndDate) {
                        currentEndDate.setTime(finalEndDate.getTime());
                    }
    
                    // Push the processing of this range with throttling
                    rangePromises.push(
                        processRange(currentStartDate, currentEndDate).then(
                            () =>
                                new Promise((resolve) =>
                                    setTimeout(resolve, 500) // Add a 500ms delay between ranges
                                )
                        )
                    );
    
                    // Move to the next range
                    currentStartDate = new Date(currentEndDate);
                    currentStartDate.setDate(currentStartDate.getDate() + 1);
                }
    
                // Process all ranges
                try {
                    await Promise.all(rangePromises);
    
                    resolve({
                        monthlyInitialTemps: allMonthlyTempsAgg,
                        monthlyInitialPrecip: allMonthlyPrecipAgg,
                        location: this.locationID,
                    });
                } catch (error) {
                    reject(new Error("Error processing data ranges."));
                }
            } catch (error) {
                console.error("Error in allData:", error.message);
                reject(error);
            }
        });
    }

    async orderData() {
        return new Promise(async (resolve, reject)=> {
            const {monthlyInitialTemps, monthlyInitialPrecip} = await this.allData();
            monthlyInitialTemps.sort((a, b) => {
                const dateA = new Date(`${a.year}-${a.month}-01`);
                const dateB = new Date(`${b.year}-${b.month}-01`);
                return dateA - dateB;
            });
            
            monthlyInitialPrecip.sort((a, b) => {
                const dateA = new Date(`${a.year}-${a.month}-01`);
                const dateB = new Date(`${b.year}-${b.month}-01`);
                return dateA - dateB;
            });
            resolve({monthlyTemps: monthlyInitialTemps, 
                    monthlyPrecip: monthlyInitialPrecip});
        });
    }
}


//FOR CommonJS RENDERING ONLY
module.exports = pastWeather;

/*
// Example Usage
(async () => {
    const test = new pastWeather('GHCND:USC00263040');

    try {
        const weather = await test.getData();
        console.log(JSON.stringify(weather, null, 2)); // Properly log the result
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
    }
})();
*/










