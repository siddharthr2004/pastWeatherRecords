import requests
import json
from datetime import datetime, timedelta
import sys

# Get the location_id from command-line arguments
if len(sys.argv) > 1:
    location_id = sys.argv[1]
else:
    print("No location id given")
    sys.exit(1)

# Define the token
token = 'wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU'
headers = {'token': token}
url = "https://www.ncei.noaa.gov/cdo-web/api/v2/data"

# Function to get metadata and determine mindate, maxdate, and available datatypes
def get_station_metadata(location_id):
    print(f"Fetching metadata for station: {location_id}")
    metadata_url = f"https://www.ncei.noaa.gov/cdo-web/api/v2/stations/{location_id}"
    response = requests.get(metadata_url, headers=headers)
    
    # Debug: Check if we successfully fetched the station metadata
    print(f"Metadata response status: {response.status_code}")
    
    if response.status_code == 200:
        metadata = response.json()
        print("Station metadata:", json.dumps(metadata, indent=4))  # Debug: print the fetched metadata
        
        mindate = metadata.get("mindate")
        maxdate = metadata.get("maxdate")

        # Fetch available datatypes for the station
        datatypes_url = "https://www.ncei.noaa.gov/cdo-web/api/v2/datatypes"
        params = {
            'stationid': location_id,
            'datasetid': 'GSOM',
            'limit': 100
        }
        datatypes_response = requests.get(datatypes_url, headers=headers, params=params)
        
        print(f"Datatypes response status: {datatypes_response.status_code}")  # Debug: check datatype status
        
        if datatypes_response.status_code == 200:
            datatypes = [item['id'] for item in datatypes_response.json().get('results', [])]
            print("Available datatypes:", datatypes)  # Debug: print available datatypes
        else:
            print("Error fetching datatypes:", datatypes_response.status_code)
            datatypes = []

        return mindate, maxdate, datatypes
    
    print("Error fetching station metadata:", response.status_code)
    return None, None, []

# Function to fetch data within a specified range
def fetch_data_for_period(location_id, start_date, end_date, datatypeid):
    params = {
        'datasetid': 'GSOM',
        'stationid': location_id,
        'startdate': start_date,
        'enddate': end_date,
        'datatypeid': datatypeid,
        'limit': 1000
    }
    
    response = requests.get(url, headers=headers, params=params)
    print(f"Fetching data from {start_date} to {end_date} for datatype {datatypeid}. Status Code: {response.status_code}")
    
    if response.status_code == 200:
        return response.json().get('results', [])
    else:
        print("Error fetching data:", response.status_code)
        print("Response text:", response.text)
        return []

# Fetch metadata for the station
mindate, maxdate, available_datatypes = get_station_metadata(location_id)

# Debug: Print the retrieved mindate and maxdate
print(f"Mindate: {mindate}, Maxdate: {maxdate}")

if not mindate or not maxdate:
    print("Could not retrieve metadata for the station.")
    sys.exit(1)

# Check if the desired datatypes are available
required_datatypes = ['PRCP', 'TAVG']
filtered_datatypes = [dtype for dtype in required_datatypes if dtype in available_datatypes]

if not filtered_datatypes:
    print(f"No required datatypes available for station {location_id}. Available datatypes: {available_datatypes}")
    sys.exit(1)

# Convert mindate and maxdate to datetime objects
start_date = datetime.strptime(mindate, "%Y-%m-%d")
end_date = datetime.strptime(maxdate, "%Y-%m-%d")

# Initialize a list to store the fetched data
monthlyData = []
chunk_size = 8  # 8 years to stay within API limits

# Fetch data in 8-year chunks
while start_date < end_date:
    next_end_date = min(start_date + timedelta(days=chunk_size * 365), end_date)
    
    for datatype in filtered_datatypes:
        data_chunk = fetch_data_for_period(
            location_id,
            start_date.strftime("%Y-%m-%d"),
            next_end_date.strftime("%Y-%m-%d"),
            datatype
        )
        # Append the fetched data to the list
        monthlyData.extend(data_chunk)
    
    # Save the data to a JSON file after each chunk
    with open("data.json", "w") as f:
        json.dump(monthlyData, f, indent=4)
    
    # Move to the next chunk
    start_date = next_end_date + timedelta(days=1)

# Final print statement after fetching all data
print(f"Fetched a total of {len(monthlyData)} records")












