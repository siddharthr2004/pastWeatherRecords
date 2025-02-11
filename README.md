# 🌍 Climate Change Weather Tracker  

###  Analyzing Climate Trends with NOAA Data  

A web tool which visualizes **temperature and precipitation changes over time** to track key climate patterns. Using real-world NOAA data, this site allows users to compare **monthly weather variations across different cities** and observe **5-year interval trends** within different climactic variables.  

## Features of this tool:  

-  **See how global temperatures have changed** over time  
-  **Analyze precipitation shifts** to detect extreme weather trends and anamolies    
-  **Compare climate data across cities** using an interactive map  
-  **Turn raw data into visually appealing images** with easy-to-read charts  

---  

## Features  

-  **Live Climate Data** – Using the **NOAA API** users can pull real-time & historical weather data  
-  **5-Year Interval Comparisons** – Track **temperature & precipitation trends** over five year intervals  
-  **Google Maps Integration** – Click any pinned city to explore its climate history  
-  **Dynamic Graphs** – Uses **Chart.js** to generate **interactive and exciting visuals**  
-  **JSON Data Parsing** – Processes & analyzes complex weather datasets  
-  **Node.js & Express Backend** – Handles API requests efficiently  

---  

##  Try It Out  

 **Website link:** (https://pastweather.siddharth-rajan.dev/)  

---  

## 📂 Key Files & Their Role  

- **`app.js`** → Main backend (Node.js & Express) handling API requests  
- **`pastWeather.js`** → Fetches and processes NOAA climate data  
- **`pastWeather.ejs`** → Generates temperature & precipitation graphs  
- **`geLocations.js`** → Gets the location of different NOAA databases 

---  

##  Setup Guide  

### 1️⃣ Clone the Repository  
First, download the project to your local machine:  
```bash  
git clone https://github.com/siddharthr2004/Climate-Change-Tracker.git  
cd Climate-Change-Tracker  
```  

---  

### 2️⃣ Install Dependencies  
Make sure you have **Node.js** installed. Then, run the following command in your terminal:  
```bash  
npm install  
```  

---  

### 3️⃣ Set Up API Keys  
You'll need API keys to pull NOAA weather data and enable Google Maps.  

1. Create a **`.env`** file in the project directory.  
2. Add your API credentials inside like this:  
```env  
NOAA_API_KEY=your_api_key  
GOOGLE_MAPS_API_KEY=your_api_key  
```  

---  

### 4️⃣ Start the Server  
Run the application with:  
```bash  
node app.js  
```  

---  

### 5️⃣ Open the Website  
Once the server is running, open this in your browser:  
📞 **[http://localhost:3000](http://localhost:3000)**  

