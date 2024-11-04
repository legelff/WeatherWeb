from flask import Flask, jsonify, request
import requests
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS
from datetime import datetime, timedelta


load_dotenv()  # Load environment variables from .env file 
api_key_weather = os.getenv('API_KEY_WEATHER')
api_key_images = os.getenv('API_KEY_IMAGES')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/api/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    if not location:
        return jsonify({"error": "Location not provided"}), 400

    # Example call to the WeatherAPI (replace 'YOUR_API_KEY' with your actual key)
    forecast_3day = requests.get(f"http://api.weatherapi.com/v1/forecast.json?key={api_key_weather}&q={location}&days=3&aqi=yes")
    temp_t = datetime.now()
    history = requests.get(f"http://api.weatherapi.com/v1/history.json?key={api_key_weather}&q={location}&dt={(temp_t - timedelta(days=6))}&end_dt={(temp_t - timedelta(days=1))}")


    if forecast_3day.status_code == 200 and history.status_code == 200:
        forecast_data = forecast_3day.json()
        history_data = history.json()
        # Combine the data into a single response object
        combined_data = {
            "forecast": forecast_data,
            "history": history_data
        }
        
        return jsonify(combined_data)
    else:
        return jsonify({"error": "Weather data not found"}), 404
    
@app.route('/api/ip', methods=['GET'])
def get_location_by_ip():
    ip_lookup = requests.get(f"http://api.weatherapi.com/v1/ip.json?key={api_key_weather}&q=auto:ip")

    if ip_lookup.status_code == 200:
        location_data = ip_lookup.json()
        return jsonify(location_data)
    else:
        return jsonify({"error": "Could not retrieve location from IP"}) 

@app.route('/api/search', methods=['GET'])
def get_location():
    location = request.args.get('location')
    if not location:
        return jsonify({"error": "Location not provided"}), 400
    
    # Request location search from WeatherAPI
    locations = requests.get(f"http://api.weatherapi.com/v1/search.json?key={api_key_weather}&q={location}")

    if locations.status_code == 200:
        location_data = locations.json()
        return jsonify(location_data)
    else:
        return jsonify({"error": "Could not retrieve locations"}), 500


# For images
@app.route('/api/images', methods=['GET'])
def get_images():
    # Get the search query from the request parameters
    location = request.args.get('location')
    # Set up headers and parameters for the Pexels API request
    pexels_url = "https://api.pexels.com/v1/search"
    headers = {
        "Authorization": api_key_images
    }
    params = {
        "query": location,
        "per_page": 5 
    }
    
    # Make the request to Pexels API
    response = requests.get(pexels_url, headers=headers, params=params)
    # Check if the request was successful
    if response.status_code == 200:
        images_data = response.json()
        return jsonify(images_data)  # Return the image data as JSON
    else:
        return jsonify({"error": "Could not retrieve images from Pexels"}), 500





    
if __name__ == "__main__":
    app.run(port=5000)