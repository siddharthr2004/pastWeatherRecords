import requests
import json
from statistics import mean

# Define configuration parameters for the API
url = "https://www.ncei.noaa.gov/cdo-web/api/v2/data"
headers = {
    'token': 'YOUR_API_TOKEN'  # Replace with your actual token
}

# Configuration details for the dataset and location
config = {
    'datasetid': 'GHCND',                # Specifies the type of data we want (e.g., monthly)
    'location_id': 'CITY:US530018',      # Defines location ID for data retrieval
    'start_date': '2020-01-01',          # Start date for data extraction
    'end_date': '2020-12-31'             # End date for data extraction
}

# We then pass on values from the params section into the actual API request to pull data from
# the API. The original values we pass in are taken from the config and passed in to the data 
# to actually get them
params = {
    'datasetid': config['datasetid'],  # Dependent on what type of data we want (e.g., monthly)
    'locationid': config['location_id'], # Dependent on location
    'startdate': config['start_date'],  # Sets the start date
    'enddate': config['end_date'],      # Sets the end date
    'limit': 1000                       # Set a limit on results, defaulting to 1000
}

# Make the API request
response = requests.get(url, headers=headers, params=params)

# Check if the API request is successful
if response.status_code == 200:
    # We save the response JSON file where the API dumps into a variable called data
    data = response.json()
    # From here we take the 'results' portion of the actual JSON file from what was given to us via
    # the actual API call. The 'results' is what stores ALL results for all monthly data in the 
    # location set and the date set we had
    records = data.get('results', [])
    
    # monthlyData will hold all the data we actually want
    monthlyData = []
    # For loop to run through all the records we got from our JSON
    for record in records:
        # We extract the date, temperature, and precipitation
        date = record.get('date')
        temp = record.get('temperature')
        precip = record.get('precipitation')
        # We then append these values onto the actual monthlyData list, adding them so that
        # the data values we want are stored in this
        monthlyData.append({
            "date": date,
            "temperature": temp,
            "precipitation": precip
        })

    # What we did here is take all the data in monthlyData and dump it into the data.json file
    with open("data.json", "w") as f:
        # Now you add all of the data from monthlyData into the data.json file
        json.dump(monthlyData, f, indent=4)
        print("Monthly data saved to data.json")
else:
    # If there’s an error with the API request, print an error message
    print("Error fetching data")

# What these two do is essentially initialize a library with 12 values (13 is not included)
# So essentially you have 12 values from monthlyTemp(1) to monthlyTemp(12), each of which can contain 
# datasets within themselves 
# It's under the premise of library creation in Java
monthlyTemp = {i: [] for i in range(1, 13)}
monthlyPrecip = {i: [] for i in range(1, 13)}

# Initialize dictionaries to store 5-year averages for temperature and precipitation
monthlyAverageTemp = {i: [] for i in range(1, 13)}
monthlyAveragePrecip = {i: [] for i in range(1, 13)}

count = 0  # Initialize count to track each 5-year (60 months) block

# This for loop iterates through all data sets in "data"
for record in monthlyData:
    # From here, you get both the temperature and the precipitation from the actual data.json file
    temp = record.get('temperature')
    precipitation = record.get('precipitation')
    date = record.get('date')

    # Check if data is valid
    if date and temp is not None and precipitation is not None:
        # Here you first split the value of the actual date. So given we have "YYYY-MM-DD", 
        # doing such a split would give us the month as the second element
        month = int(date.split("-")[1])
        # Append temperature and precipitation values that correspond to the specific month
        monthlyTemp[month].append(temp)
        monthlyPrecip[month].append(precipitation)
        count += 1

    # Once count reaches 60, calculate the 5-year averages
    if count == 60:
        # Find the mean of both the temp and precip for each month within the 5-year period
        for i in range(1, 13):
            # Calculate average for each month and store it in the 5-year average dictionaries
            monthlyAverageTemp[i].append(mean(monthlyTemp[i]) if monthlyTemp[i] else None)
            monthlyAveragePrecip[i].append(mean(monthlyPrecip[i]) if monthlyPrecip[i] else None)
        
        # Reset monthly data and count for the next 5-year period
        monthlyTemp = {i: [] for i in range(1, 13)}
        monthlyPrecip = {i: [] for i in range(1, 13)}
        count = 0

# The final data library is then created to hold the 5-year average temp and precip for each month
final_data = {
    "monthlyAverageTemp": monthlyAverageTemp,
    "monthlyAveragePrecip": monthlyAveragePrecip
}

# We then take the finalData.json file and dump the values of final_data into it
with open("finalData.json", "w") as f:
    # Store all the final averaged data in finalData.json
    json.dump(final_data, f, indent=4)
    print("Final data stored successfully!")








