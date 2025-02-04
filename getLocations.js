const fs = require('fs');
const axios = require('axios');
const { setTimeout } = require('timers/promises');

class getLocations {
    constructor() {
        this.limit = 200; // Hardcoded limit for records per API call
        this.totalRecords = 30000; // Hardcoded total records to fetch
        this.baseURL = "https://www.ncei.noaa.gov/cdo-web/api/v2/stations";
        this.token = "wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU"; // Replace with your valid token
    }

    // Fetch a single batch of data from the API for a given offset
    async getData(offset) {
        try {
            const response = await axios.get(this.baseURL, {
                headers: { token: this.token },
                params: {
                    datasetid: 'GSOM',
                    datatypeid: 'TAVG',
                    limit: this.limit,
                    offset: offset
                }
            });
            return response.data; // Return the full API response
        } catch (error) {
            return null; // Handle failure gracefully
        }
    }

    // Fetch all data and save to a file
    async fetchAllData() {
        const locations = [];
        let offset = 1;

        try {
            while (locations.length < this.totalRecords) {

            
                console.log(`Fetching records ${offset} to ${offset + this.limit - 1}...`);
                const data = await this.getData(offset);

                if (data && data.results) {
                    data.results.forEach(item => {
                        locations.push({
                            longitude: item.longitude,
                            latitude: item.latitude,
                            id: item.id
                        });
                    });
                    console.log(`Fetched ${data.results.length} records.`);
                } else {
                    console.log("No data returned - skipping this dataGroup");
                }

                offset += this.limit;

                if (locations.length >= this.totalRecords) {
                    console.log(`Fetched all required ${this.totalRecords} records.`);
                    break;
                }
            }

            // Save locations to a file
            fs.writeFileSync('locations.txt', JSON.stringify(locations, null, 2));
            console.log('Locations data saved to locations.txt');

            const filteredLocations = locations.filter((_, index) => index % 15 === 0);

            // Save filtered locations to a separate file
            //fs.writeFileSync('finalLocations.txt', JSON.stringify(filteredLocations, null, 2));
           // console.log('Filtered locations saved to finalLocations.txt');
        } catch (error) {
            console.error("Error during data fetching:", error.message);
        }

        return locations;
    }
}
(async () => {
    console.log('Starting to fetch location data...');
    
    const locationsInstance = new getLocations();
    
    try {
        // Call fetchAllData to fetch locations and save to locations.txt
        const locations = await locationsInstance.fetchAllData();
        
        if (locations.length > 0) {
            console.log(`Successfully fetched ${locations.length} locations.`);
            console.log('Locations have been saved to locations.txt');
        } else {
            console.error('No locations were fetched. Check the API or token.');
        }
    } catch (error) {
        console.error('An error occurred while fetching locations:', error.message);
    }
})();

module.exports = getLocations;



