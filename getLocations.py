import requests
import json

def noaa_locations():
    url = "https://www.ncei.noaa.gov/cdo-web/api/v2/stations"
    headers = {
        "token": "wIYbgYPkGwSUCkoldrbhdvyZoFyAtPpU"
    }
    
    # Parameters for fetching stations related to the GSOM dataset
    params = {
        "datasetid": "GSOM",
        "datatypeid": "TAVG",
        'limit': 1000,
        'offset': 1
    }

    stations = []
    
    while True:
        # Make the request to the NOAA API
        response = requests.get(url, headers=headers, params=params)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()

            # Append the stations to our list
            stations.extend(data.get('results', []))



            # Check if there are more results to fetch
            resultset = data.get('metadata', {}).get('resultset', {})
            offset = resultset.get('offset', 0)
            count = resultset.get('count', 0)
            limit = resultset.get('limit', 1000)
            
            # Break the loop if we've fetched all data
            if offset + limit >= count:
                break

            # Update the offset for the next request
            params['offset'] += limit
        else:
            print("Failed to retrieve data:", response.status_code)
            print("Response text:", response.text)
            break

    # Print all fetched stations data
    print(json.dumps(stations, indent=4))

# Only call the function if this is the main file
if __name__ == "__main__":
    noaa_locations() 