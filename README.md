# 🌍 Climate Change Weather Tracker  

### 📊 Analyzing Climate Trends with NOAA Data  

A web-based tool that visualizes **temperature and precipitation changes over time** to track climate patterns. Using real-world NOAA data, this site allows users to compare **monthly weather variations across different cities** and observe **5-year interval trends**.  

## ⚡ Why This Matters  

- 🌬 **See how global temperatures have changed** over time  
- 🌧 **Analyze precipitation shifts** to detect extreme weather trends  
- 🏞 **Compare climate data across cities** using an interactive map  
- 📊 **Turn raw data into insights** with easy-to-read charts  

By making climate data more **accessible and visual**, this tool helps users recognize long-term environmental shifts.  

---  

## 🚀 Features  

👉 **Live Climate Data** – Uses the **NOAA API** to pull real-time & historical weather data  
👉 **5-Year Interval Comparisons** – Track **temperature & precipitation trends** over time  
👉 **Google Maps Integration** – Click any city to explore its climate history  
👉 **Dynamic Graphs** – Uses **Chart.js** to generate **interactive visuals**  
👉 **JSON Data Parsing** – Processes & analyzes complex weather datasets  
👉 **Node.js & Express Backend** – Handles API requests efficiently  

---  

## 🎥 Try It Out  

🛡 **Live Demo:** (https://pastweather.siddharth-rajan.dev/)  

---  

## 📂 Key Files & Their Role  

- **`app.js`** → Main backend (Node.js & Express) handling API requests  
- **`weather.js`** → Fetches and processes NOAA climate data  
- **`chart.js`** → Generates temperature & precipitation graphs  
- **`map.ejs`** → Displays an interactive Google Map  
- **`parsedWeather.json`** → Stores structured climate data  

---  

## 🛠 Setup Guide  

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

