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

// event listeners for day 1, 2 and 3 for islandBottomCenter - FOR KAROLIS
document.querySelectorAll(".dayDiv").forEach(function(d) {
    d.addEventListener("click", function() {
        // make logic here
    })
})

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
function displayCurrentData(data) {
    const weatherContainer = document.querySelector('.weather');
    
    // Extract relevant information from data
    const location = data.current.location.name;
    const country = data.current.location.country;
    const temperature = data.current.current.temp_c;
    const condition = data.current.current.condition.text;
    const feels_like = data.current.current.feelslike_c;
    const wind_speed = data.current.current.wind_kph;
    const humidity = data.current.current.humidity;
    const uv = data.current.current.uv;
    const wind_direction = data.current.current.wind_dir;
    const clouds = data.current.current.condition.text;
    const air_qual = data.current.current.air_quality["us-epa-index"]; // You can do that the air quality will show as good. bad and etc.
    // US - EPA standard.
    // 1 means Good
    // 2 means Moderate
    // 3 means Unhealthy for sensitive group
    // 4 means Unhealthy
    // 5 means Very Unhealthy
    // 6 means Hazardous
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
        <h2>Weather in ${location}, ${country}</h3>
        <p>Temperature: ${temperature}°C</p>
        <p>Feels like: ${feels_like}°C</p>
        <p>Condition: ${condition}</p>
        <p>Wind kph: ${wind_speed}</p>
        <p>Wind direction: ${wind_direction}</p>
        <p>Humidity: ${humidity}</p>
        <p>UV: ${uv}</p>
        <p>Clouds: ${clouds}</p>
        <p>Air Quality: ${qualDef}</p>
    `;
    weatherContainer.classList.remove('hidden');

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

        for(var hour = 0; hour < 23; hour++) {
            
            
            // now its selecting hour. if you want to change which our change .hour[0-23] 
             // change 0 to 1 or 2 to get tomorrow or 2 days later
            
            const hour = data.forecast.forecast.forecastday[day].hour[hour];
            console.log(hour);
            
            // if you want to get the whole day information replace hour by day.
            const rain = hour.chance_of_rain;
            const image = hour.condition.icon;
            const temp = hour.temp_c;
            const time_hour = hour.time;
        
        
            weatherContainer.innerHTML += `
                <h3>Weather in ${location}</h3>
                <img src=${image}>
                <p>Temperature: ${temp}</p>
                <p>Rain Chance: ${rain}</p>
                <p>Hour: ${time_hour}</p>
            `;
        }
    }
    // this is only for hourly
    weatherContainer.classList.remove('hidden');
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
            displayCurrentData(data);
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

