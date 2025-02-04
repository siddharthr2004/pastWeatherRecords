const axios = require('axios');

class pastWeather {
    constructor(locationID) {
        this.locationID = locationID;
    }

    async testDataRetrieval(start, end) {
        try {
            // Send a single request to check data retrieval
            const response = await axios.get('https://www.ncei.noaa.gov/cdo-web/api/v2/data', {
                headers: {
                    'token': 'wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU' // Replace with your token
                },
                params: {
                    stationid: this.locationID,
                    datasetid: 'GSOM',
                    startdate: start,
                    enddate: end,
                    limit: 999, // Retrieve a small number of records to test
                    offset: 0 // Start at the first record
                }
            });

            console.log("Data Retrieved:", response.data?.results || "No data found.");
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
        }
    }
}

// Example Usage
(async () => {
    const test = new pastWeather('GHCND:USC00261327'); // Replace with your station ID
    await test.testDataRetrieval("1990-01-01", "1998-12-31"); // Replace with your desired date range
})();