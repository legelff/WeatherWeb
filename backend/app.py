from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS


load_dotenv()  # Load environment variables from .env file 
api_key = os.getenv('API_KEY')
city = "Antwerp"

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/api/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City not provided"}), 400

    # Example call to the WeatherAPI (replace 'YOUR_API_KEY' with your actual key)
    forecast_3day = requests.get(f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=3&aqi=yes")

    if forecast_3day.status_code == 200:
        forecast_data = forecast_3day.json()
        # Combine the data into a single response object
        combined_data = {
            "forecast": forecast_data
        }
        
        return jsonify(combined_data)
    else:
        return jsonify({"error": "Weather data not found"}), 404
    
    
# ip_lookup = requests.get(f"http://api.weatherapi.com/v1/ip.json?key={api_key}&q=1auto:ip") # Needs check if this is possible
@app.route('/api/ip', methods=['GET'])
def get_location_by_ip():
    ip_lookup = requests.get(f"http://api.weatherapi.com/v1/ip.json?key={api_key}&q=auto:ip")

    if ip_lookup.status_code == 200:
        location_data = ip_lookup.json()
        return jsonify(location_data)
    else:
        return jsonify({"error": "Could not retrieve location from IP"}) 



    
        
    
    
    

if __name__ == "__main__":
    app.run(port=5000)