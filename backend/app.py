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
    currect = requests.get(f"http://api.weatherapi.com/v1/current.json?key={api_key}&q={city}&aqi=yes")
    forecast_3day = requests.get(f"http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=3")

    if currect.status_code == 200 and forecast_3day.status_code == 200:
        current_data = currect.json()
        forecast_data = forecast_3day.json()
        # Combine the data into a single response object
        combined_data = {
            "current": current_data,
            "forecast": forecast_data
        }
        
        return jsonify(combined_data)
    else:
        return jsonify({"error": "Weather data not found"}), 404
    

if __name__ == "__main__":
    app.run(port=5000)