const https = require('https');

class Greeting {
    async getData() {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'www.ncei.noaa.gov',
                path: '/cdo-web/api/v2/stations/GHCND:USC00044884',
                method: 'GET',
                headers: {
                    'token': 'wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU'
                },
                timeout: 10000 // Set timeout to 10 seconds
            };

            const req = https.request(options, (res) => {
                let data = '';

                // Listen for data chunks
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // Resolve the Promise when the response ends
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const parsedData = JSON.parse(data);
                            resolve(parsedData);
                        } catch (error) {
                            reject(new Error('Failed to parse JSON response'));
                        }
                    } else {
                        reject(new Error(`Request failed with status code: ${res.statusCode}`));
                    }
                });
            });

            // Handle request errors
            req.on('error', (error) => {
                reject(error);
            });

            // Set timeout for the request
            req.on('timeout', () => {
                req.destroy(); // Destroy the request to release resources
                reject(new Error('Request timed out'));
            });

            // End the request
            req.end();
        });
    }
}

module.exports = Greeting;