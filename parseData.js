const fs = require('fs');
const path = require('path');

class parseData {

  filterEvery30thLocation() {
    try {
        // Read the contents of locations.txt
        //This gives us the file path, where we use path.join
        const filePath = path.join(__dirname, 'locations.txt');
        //this takes the filepath we found and actuall reads from it - and later stores this in a data variable
        const data = fs.readFileSync(filePath, 'utf-8');

        // Parse the JSON data
        //this further takes the data which we read and saves it in the form of the JSON script
        const locations = JSON.parse(data);

        // Filter every 30th location
        //We then can parse through the JSON values using the .filter method and use a lambda expression to set the value
        //of index such that only the 30th index is picked 
        const filteredLocations = locations.filter((_, index) => index % 30 === 0);

        // Save the filtered locations to a new file
        //We then output this file within a const which takes the directory and outputs the name of the file
        //we want to create to hold all of these values
        const outputFilePath = path.join(__dirname, 'filteredLocations.txt');
        //We then create a file writes which is able to output this (using the fs function) and outputs the file and 
        //stringifies the fileted locations which contains the locations we actually want to add too the file
        fs.writeFileSync(outputFilePath, JSON.stringify(filteredLocations, null, 2));

        console.log(`Filtered locations saved to ${outputFilePath}`);
    } catch (error) {
        console.error('Error processing locations:', error.message);
    }

    }
}

const runClass = new parseData();
runClass.filterEvery30thLocation();
