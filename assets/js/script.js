let forecast_days = [];
var data = {};


document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('mousemove', (e) => {
        // Get the dimensions of the island
        const { offsetWidth: width, offsetHeight: height } = island;
         
        // Get the center of the island
        const centerX = width / 2;
        const centerY = height / 2;

        // Calculate the mouse's position relative to the center
        const mouseX = e.clientX - island.getBoundingClientRect().left;
        const mouseY = e.clientY - island.getBoundingClientRect().top;

        // Calculate how much to tilt the island based on mouse position
        const tiltX = (mouseY - centerY) / centerY * 10; // Adjust the tilt value as needed
        const tiltY = (mouseX - centerX) / centerX * -10; // Invert Y tilt for effect

        // Apply transform
        island.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Calculate shadow position based on tilt
        const shadowX = (tiltY / 10) * 10; // Shadow moves based on Y tilt
        const shadowY = (tiltX / 10) * 10; // Shadow moves based on X tilt

        // Apply new shadow position
        island.style.boxShadow = `${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.5)`; // Adjust shadow size as needed
    });

    island.addEventListener('mouseleave', () => {
        // Reset the tilt and shadow when the mouse leaves the island
        island.style.transform = 'rotateX(0) rotateY(0)';
        island.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.5)'; // Reset to original shadow
    });
});

// testing
// Event listener for search button

document.querySelector(".searchButton").addEventListener("click", function (e) {
    searchP1(e);
});

document.addEventListener("keydown", function (e) {
    if (document.querySelector(".islandTopCenter").classList.contains("initialPhase")) {
        if (e.key === "Enter") {
            searchP1(e);
        }
    }
});

const hourlyContainer = document.querySelector('.hourlyContainer');

hourlyContainer.addEventListener('wheel', (event) => {
  //event.preventDefault(); 
  hourlyContainer.scrollLeft += event.deltaY; // Scrolls horizontally
});


function searchP1(e) {
    e.preventDefault(); // Prevents default button behavior

    // Get the value of the country input
    const country = document.querySelector("#country").value.trim();

    if (country) {
        // Trigger animations
        document.querySelector(".islandTopCenter").classList.remove("initialPhase");
        document.querySelector(".islandTopCenter").classList.add("removeMargin");
        document.querySelector(".islandBottomCenter").classList.remove("initialPhaseBottom", "hidden");
        document.querySelector(".islandBottomCenter").classList.add("fade-in");
        document.querySelector(".searchContainer").classList.add("fade-out");
        document.querySelector(".countryOptions").classList.add("fade-out");
        document.querySelector(".containerRight").classList.remove("hidden");
        document.querySelector(".containerRight").classList.add("slide-in-right");
        document.querySelector(".containerLeft").classList.remove("hidden");
        document.querySelector(".containerLeft").classList.add("slide-in-left");

        document.querySelector(".hourlyContainer").classList.remove("none")
        document.querySelector(".weather").classList.remove("none")
        document.querySelector(".searchContainer").classList.add("none")
        document.querySelector(".countryOptions").classList.add("none")

        // Fetch the weather data
        fetchWeather(country);
    } else {
        displayError("Please enter a country.");
    }
}

// Function to display current weather data in top center
function displayMainData(data, index = 0) {
    const weatherContainer = document.querySelector('.weather');
    
    // Extract relevant information from data
    const date = data.forecast.forecast.forecastday[index].date;
    const location = data.forecast.location.name;
    const country = data.forecast.location.country;
    const temperature = data.forecast.forecast.forecastday[index].day.avgtemp_c;
    const condition = data.forecast.forecast.forecastday[index].day.condition.text;
    const icon = "https:" + data.forecast.forecast.forecastday[index].day.condition.icon;
    const max_wind_speed = data.forecast.forecast.forecastday[index].day.maxwind_kph;
    const humidity = data.forecast.forecast.forecastday[index].day.avghumidity;
    const uv = data.forecast.forecast.forecastday[index].day.uv;
    const air_qual = data.forecast.forecast.forecastday[index].day.air_quality["us-epa-index"]; 
    const rain_chance = data.forecast.forecast.forecastday[index].day.daily_chance_of_rain;
    const rain_level = data.forecast.forecast.forecastday[index].day.totalprecip_mm;
    var qualDef = ""
    
    switch (air_qual) {
        case 1:
            qualDef = "Good"
            break;

        case 2:
            qualDef = "Moderate"
            break;

        case 3:
            qualDef = "Unhealthy for sensitive group"
            break;

        case 4:
            qualDef = "Unhealthy"
            break;

        case 5:
            qualDef = "Very unhealthy"
            break;

        case 6:
            qualDef = "Hazardous"
            break;
    
        default:
            qualDef = "Unknown"
            break;
    }

    weatherContainer.innerHTML = `
        <h2>${date} Weather in ${location}, ${country}</h3>
        <img src="${icon}">
        <p>Temperature: ${temperature}°C</p>
        <p>Condition: ${condition}</p>
        <p>Wind kph: ${max_wind_speed}</p>
        <p>Humidity: ${humidity}</p>
        <p>UV: ${uv}</p>
        <p>Air Quality: ${qualDef}</p>
        <p>Chance of rain: ${rain_chance}%</p>
        <p>precipitation: ${rain_level} mm</p>
    `;
    weatherContainer.classList.remove('hidden');
    displayHourlyData(data, index);

    // for dynamic background in top left island (to do)
    // const initialCondition = data.current.current.condition.text.toLowerCase();

    // switch (true) {
    //     case /drizzle/.test(initialCondition): // Drizzle is more specific, so it goes first
    //         console.log("Weather is Drizzle");
    //         break;

    //     case /sleet/.test(initialCondition):
    //         console.log("Weather is Sleet");
    //         break;

    //     case /snow/.test(initialCondition):
    //         console.log("Weather is Snowy");
    //         break;

    //     case /ice/.test(initialCondition):
    //         console.log("Weather has Ice");
    //         break;

    //     case /rain|shower/.test(initialCondition): // Rain includes showers but avoids drizzle
    //         console.log("Weather is Rainy");
    //         break;

    //     case /thunder/.test(initialCondition):
    //         console.log("Weather is Thunderstorm");
    //         break;

    //     case /mist|fog/.test(initialCondition):
    //         console.log("Weather is Foggy");
    //         break;

    //     case /sunny|clear|overcast/.test(initialCondition):
    //         console.log("Weather is Sunny");
    //         break;

    //     case /cloudy/.test(initialCondition): // Cloudy goes last to avoid partial matches with "partly cloudy"
    //         console.log("Weather is Cloudy");
    //         break;

    //     default:
    //         console.log("Weather condition is not recognized");
    // }
}

// Function to display current weather data in top center
function displayForecastData(data) {
    const weatherContainer = document.querySelector('.islandBottomCenter');
    for(var day = 0; day < 3; day++) {
        
        const days = data.forecast.forecast.forecastday[day];
        
        // if you want to get the whole day information replace hour by day.
        const rain = days.day.daily_chance_of_rain;
        const image = "https:" + days.day.condition.icon;
        const desc = days.day.condition.text;
        const temp = days.day.avgtemp_c;
        const time_hour = days.date;
    
        weatherContainer.innerHTML += `
            <div class="dayDiv d${day}">
                <h4>${time_hour}</h4>
                <img src="${image}">
                <p>${desc}</p>
                <p>${Math.round(temp)} C</p>
                <p>${rain} %</p>
            </div>
        `;
        
    }
    // this is only for hourly
    weatherContainer.classList.remove('hidden');

    document.querySelectorAll(".dayDiv").forEach(function(day, index) {
        day.addEventListener("click", function() {
            displayMainData(data, index);
    
        });
    });
    
    
}

function displayHourlyData(data, index) {
    const hourlyWeather = document.querySelector(".hourlyContainer");

    hourlyWeather.innerHTML = null;
    let start = 0;
    let end = 24;
    // For current data and not display hour that is passed
    if(index == 0) {
        const now = new Date();
        start = now.getHours();
    }
    for (var hour = start; hour < end; hour++) {
        const hourly = data.forecast.forecast.forecastday[index].hour[hour];

        const time = String(new Date(hourly.time).getHours()).padStart(2, '0') + ":00";
        const image = "https:" + hourly.condition.icon;
        // const desc = hourly.condition.text;
        const temp = hourly.temp_c;
        const rain_chance = hourly.chance_of_rain;

        hourlyWeather.innerHTML += `
            <div class="hourlyItem">
                <h5>${time}</h5>
                <img src="${image}">
                <p>${Math.round(temp)}°C</p>
                <p style="color:lightblue;">${rain_chance}%</p>
            </div>
        `;
    }
}

async function fetchWeather(country) {
    try {
        // Send a request to the backend API with the country as a parameter
        const response = await fetch(`http://127.0.0.1:5000/api/weather?city=${country}`);

        // Parse the response as JSON
        const data = await response.json();
        console.log("Weather Data:", data);

        if (data.error) {
            displayError("Weather data not found.");
        } else {
            displayMainData(data);
            displayForecastData(data);
        }
    } catch (error) {
        displayError("An error occurred."); // Adds box below, you have to display it somewhere else @Aryan
    }
}
// Function to display error messages
function displayError(message) {
    // replaced additional element creation (put error in console devtools)
    console.log(message)
}

