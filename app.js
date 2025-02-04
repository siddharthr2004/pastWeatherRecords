const express = require('express'); // CommonJS import for Express
const fs = require('fs'); // File system module
const path = require('path'); // Path module
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const ejs = require('ejs'); // Template engine
//const winston = require('winston');

//THIS IS FOR TESTING ONLY
let PastWeather;
try {
    PastWeather = require('./pastWeather.js');
} catch(error) {
    console.log("error loading Greeting script", error);
}

//TESTING PURPOSES ONLY
const pastWeather = new PastWeather('GHCND:USC00044884');
async function getWeatherData() {
    try {
        const data = await pastWeather.orderData();
        console.log(data); // Log the fetched data
    } catch (error) {
        console.error("Error parsing data:", error);
        // Assuming you're using this inside a route handler, you can send a response
        //res.send("Error parsing data");
    }
}


const app = express();


//CommonJS RENDERING
app.use(express.static(path.join(__dirname, 'public_html')));


// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define route to serve the main page
app.get('/', (req, res) => {
    try {
        // Read locations data from locations.txt
        const locationsPath = path.join(__dirname, 'filteredLocations.txt');
        const locationsData = fs.readFileSync(locationsPath, 'utf-8');
        const locations = JSON.parse(locationsData); // Parse JSON data

        // Render the EJS template with the locations
        res.render('mainPage', { locations });
    } catch (error) {
        console.error("Error reading locations.txt:", error.message);
        res.status(500).send("Error loading location data.");
    }
    

});

app.post('/getLatandLang', async (req, res) => {

   // THIS IS JUST FOR TESTING PURPOSES HERE 
   /*
   const pastWeatherData = {
    pastTemps: [
        { value: 13.06, month: "03", year: "1971" }
    ],
    pastPrecip: [
        { value: 64.3, month: "01", year: "1961" },
        { value: 40.4, month: "02", year: "1961" },
        { value: 47.7, month: "03", year: "1961" },
        { value: 32.5, month: "04", year: "1961" },
        { value: 5.9, month: "05", year: "1961" },
        { value: 0.3, month: "06", year: "1961" },
        { value: 0, month: "07", year: "1961" },
        { value: 0, month: "08", year: "1961" },
        { value: 6.6, month: "09", year: "1961" },
        { value: 1.5, month: "10", year: "1961" },
        { value: 81.3, month: "11", year: "1961" },
        { value: 39.1, month: "12", year: "1961" },
        { value: 14.8, month: "01", year: "1962" },
        { value: 191, month: "02", year: "1962" },
        { value: 66.9, month: "03", year: "1962" },
        { value: 6.1, month: "04", year: "1962" },
        { value: 0, month: "05", year: "1962" },
        { value: 0, month: "06", year: "1962" },
        { value: 0, month: "07", year: "1962" },
        { value: 1.3, month: "08", year: "1962" },
        { value: 0.5, month: "09", year: "1962" },
        { value: 218.8, month: "10", year: "1962" },
        { value: 21.1, month: "11", year: "1962" },
        { value: 59.5, month: "12", year: "1962" },
        { value: 123.7, month: "01", year: "1963" },
        { value: 57.5, month: "02", year: "1963" },
        { value: 105.5, month: "03", year: "1963" },
        { value: 106.6, month: "04", year: "1963" },
        { value: 9.4, month: "05", year: "1963" },
        { value: 0, month: "06", year: "1963" },
        { value: 0, month: "07", year: "1963" },
        { value: 1.3, month: "08", year: "1963" },
        { value: 9.7, month: "09", year: "1963" },
        { value: 44.8, month: "10", year: "1963" },
        { value: 101, month: "11", year: "1963" },
        { value: 13, month: "12", year: "1963" },
        { value: 94.2, month: "01", year: "1964" },
        { value: 5.9, month: "02", year: "1964" },
        { value: 37.2, month: "03", year: "1964" },
        { value: 2.8, month: "04", year: "1964" },
        { value: 10.7, month: "05", year: "1964" },
        { value: 20.9, month: "06", year: "1964" },
        { value: 1, month: "08", year: "1964" },
        { value: 0, month: "09", year: "1964" },
        { value: 44.4, month: "10", year: "1964" },
        { value: 75.6, month: "11", year: "1964" },
        { value: 140, month: "12", year: "1964" },
        // ... Add remaining `pastPrecip` entries similarly
    ]
};

const pastTemps = pastWeatherData.pastTemps;
const pastPrecip = pastWeatherData.pastPrecip;
    

    res.render('pastWeather', { pastTemps: pastTemps, pastPrecip: pastPrecip });
    //THIS IS JUST FOR TESTING PURPOSES
    res.render('pastWeather', {pastTemps: pastTemps, pastPrecip: pastPrecip});
    */

    


    
    const id = req.body.id;
    
    const pastWeather = new PastWeather(id);
       try {
            
           //const data = await pastWeather.orderData();
            //TESTING IF THIS WORKS HERE 
           const { monthlyTemps, monthlyPrecip } = await pastWeather.orderData();

           //THIS IS JUST FOR A TEST
           res.render('pastWeather', {pastTemps: monthlyTemps, pastPrecip: monthlyPrecip});
            

       } catch (error) {
        res.send("Error parsing data", error.message);
       }
       
       
    });
    
    


getWeatherData();

// Start the server
const port = process.env.PORT || 3008;
app.listen(port, () => {
    console.log("Node.js app listening on port ${port}");
});
