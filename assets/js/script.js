// let forecast_days = [];
// var data = {};

// credit links (customizsable)
document.querySelector(".github").addEventListener("click", function() {
    window.open("https://github.com/legelff/WeatherWeb", "_blank");
})

document.querySelector(".website").addEventListener("click", function() {
    window.open("https://l145.be/", "_blank");
})

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

// back button 
document.querySelector(".home").addEventListener("click", function() {
    location.reload()
})

// home button transparancy
const homeElement = document.querySelector(".home");

let hideTimeout;

// Function to set opacity to 0.1 after 10 seconds
const startHideTimer = () => {
    hideTimeout = setTimeout(() => {
        homeElement.style.opacity = "0.1";
    }, 10000); // 10 seconds
};

// Function to reset opacity when hovered
const resetOpacity = () => {
    clearTimeout(hideTimeout); // Clear the previous timer
    homeElement.style.opacity = "1"; // Set opacity to full
    startHideTimer(); // Restart the timer
};

// Add event listeners
homeElement.addEventListener("mouseenter", resetOpacity);
homeElement.addEventListener("mouseleave", startHideTimer);

// Start the timer initially
startHideTimer();

const hourlyContainer = document.querySelector('.hourlyContainer');

hourlyContainer.addEventListener('wheel', (event) => {
  //event.preventDefault(); 
  hourlyContainer.scrollLeft += event.deltaY; // Scrolls horizontally
});

// ip lookup eventlistener auto location
document.querySelector(".autoLocation").addEventListener("click", function() {
    fetchIp();
    animate()
})


function searchP1(e) {
    e.preventDefault(); // Prevents default button behavior

    // Get the value of the country input
    const location = document.querySelector("#country").value.trim();

    if (location) {
        fetchLocations(location);
        
        
    } else {
        // displayError("Please enter a country.");
        country_selector = document.querySelector(".countryOptions");
        country_selector.innerHTML = `
                <div class="dataCell">
                    <p>No location found!</p>
                </div>
                <div class="dataCell">
                    <p>Type in a location silly</p>
                </div>
            `
    }
}

// To animate blocks
function animate(location) {
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
}

// Function to display current weather data in top center
function displayMainData(data, index = 0) {
    const weatherContainer = document.querySelector('.weather');

    let date = new Date(data.forecast.forecast.forecastday[index].date);
    let formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(date);

    // Extract relevant information from data
    const location = data.forecast.location.name;
    const country = data.forecast.location.country;
    const region = data.forecast.location.region;
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
        <h2>${formattedDate} Weather in ${location}, ${region ? region + "," : ""} ${country}</h3>
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
    displayAstronomy(data, index);

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
        let time_hour = days.date; // Default label as date
        if (day == 0) {
            time_hour = "Today";
        } else if (day == 1) {
            time_hour = "Tomorrow";
        } else if (day == 2) {
            time_hour = "Overmorrow";
        }
        
        // if you want to get the whole day information replace hour by day.
        const rain = days.day.daily_chance_of_rain;
        const image = "https:" + days.day.condition.icon;
        const desc = days.day.condition.text;
        const temp = days.day.avgtemp_c;
        
        
        weatherContainer.innerHTML += `
            <div class="dayDiv d${day}">
                <h4>${time_hour}</h4>
                <img src="${image}">
                <p style="color:rgba(255, 255, 255, 0.8);">${desc}</p>
                <p>${Math.round(temp)}°C</p>
                <p class="lastDayItem" style="color:lightblue;">${rain}%</p>
            </div>
        `;
        
    }
    // this is only for hourly
    weatherContainer.classList.remove('hidden');

    document.querySelectorAll(".dayDiv").forEach(function(day, index) {
        day.addEventListener("click", function() {
            displayMainData(data, index);
    
            // Scroll to the 07:00 hourly item when d1 or d2 is clicked
            if (index == 0) {
                // Reset scroll to the start when d0 is clicked
                hourlyContainer.scrollLeft = 0;
            }
            else if (index == 1 || index == 2) { // d1 is index 1, d2 is index 2
                const hourlyItems = document.querySelectorAll('.hourlyItem');
                const hourlyContainer = document.querySelector('.hourlyContainer');
                
                setTimeout(() => {
                    hourlyItems.forEach(item => {
                        const timeText = item.querySelector('h5').textContent.trim();
                        if (timeText == "07:00") {
                            hourlyContainer.scrollLeft = item.offsetLeft;
                        }
                    });
                }, 20); // added delay to avoid buggy scroll
            }
        });
    });
    
    
}

function displayHourlyData(data, index) {
    const hourlyWeather = document.querySelector(".hourlyContainer");
    
    hourlyWeather.innerHTML = null;
    let start = 0;
    let end = 24;
    if(index == 0) {
        start = new Date(data.forecast.location.localtime).getHours();
    }
    for (var hour = start; hour < end; hour++) {
        const hourly = data.forecast.forecast.forecastday[index].hour[hour];
        
        let time = String(new Date(hourly.time).getHours()).padStart(2, '0') + ":00";

        if (hour == start && time != "00:00") {
            time = "Now"
        }

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

function displayAstronomy(data, index) {

    const moonPlace = document.querySelector(".moonImage");
    
    const astronomy = data.forecast.forecast.forecastday[index].astro;
    
    const moon_phase = astronomy.moon_phase;
    const moonrise = astronomy.moonrise;
    const moonset = astronomy.moonset;
    const sunrise = astronomy.sunrise;
    const sunset = astronomy.sunset;
    
    moonPlace.innerHTML = `
        <img src="./assets/img/${moon_phase.replace(/ /g, '').toLowerCase()}.png" alt="${moon_phase.replace(/ /g, '').toLowerCase()}" class="moonPhase">
    `;

    document.querySelector(".sunrise h2").innerHTML = `
        ${to24HourFormat(sunrise)}
    `

    document.querySelector(".sunset h2").innerHTML = `
        ${to24HourFormat(sunset)}
    `

    document.querySelector(".moonrise h2").innerHTML = `
        ${to24HourFormat(moonrise)}
    `

    document.querySelector(".moonset h2").innerHTML = `
        ${to24HourFormat(moonset)}
    `

    document.querySelector(".moonPhaseData h2").innerHTML = `
        ${moon_phase}
    `
}

// convert ex. 05:26 PM to 24h format
function to24HourFormat(time) {
    const [hours, minutes] = time.split(/[: ]/);
    const period = time.slice(-2);
    
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    
    return `${String(hour).padStart(2, '0')}:${minutes}`;
}

function displayTime(data) {
    const DateTime = document.querySelector(".islandTopLeft");
    
    // let localtime = data.forecast.location.localtime; this gets when was the last time weather was updated, not accurate
    const localtime = new Date(data.forecast.location.localtime);

    // DateTime.innerHTML = `
    //     <h4>Local time: ${localtime}</h4>
    // `

    // change gradient based on time
    const hour = localtime.getHours()
    const location = data.forecast.location.name;
    const country = data.forecast.location.country;

    // Start clock hands rotation
    const deg = 6; // 360° / 60 seconds/minutes
    const hr = document.querySelector('#hr');
    const min = document.querySelector('#min');
    const sec = document.querySelector('#sec');
    
    // Update the hands for the first time
    updateClockHands(localtime, hr, min, sec, deg);

    // Update the digital clock for the first time
    updateDigitalClock(localtime, digitalClock);

    // Update every second
    setInterval(() => {
        localtime.setSeconds(localtime.getSeconds() + 1); // Increment by 1 second
        updateClockHands(localtime, hr, min, sec, deg);
        updateDigitalClock(localtime, digitalClock); // Update digital clock
    }, 1000);

    // change to morning/day/evening/night gradient
    if (hour >= 5 && hour < 12) {
        // morning
        DateTime.classList.add("morningGradient")
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Morning ${location}, ${country}!
        `
    }

    else if (hour >= 12 && hour < 17) {
        // afternoon
        DateTime.classList.add("dayGradient")
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Afternoon ${location}, ${country}!
        `
    }

    else if (hour >= 17 && hour < 21) {
        // evening
        DateTime.classList.add("eveningGradient")
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Evening ${location}, ${country}!
        `
    }

    else {
        // night
        DateTime.classList.add("nightGradient")
        document.querySelector(".islandTopLeft h2").innerHTML = `
            Good Night ${location}, ${country}!
        `
    }

    // display day, date
    const options = { weekday: 'long' }; // 'long' for full day name, 'short' for abbreviated
    const dayName = localtime.toLocaleDateString('en-US', options);

    // Get day, month, and year
    const day = String(localtime.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(localtime.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11, so add 1
    const year = localtime.getFullYear(); // Get full year

    const timezoneName = localtime.toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop(); // Gets the last part of the string which is the timezone

    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    document.querySelector(".day").innerHTML = `
        ${dayName}
    `

    document.querySelector(".date").innerHTML = `
        ${formattedDate}
    `

    document.querySelector(".timezone").innerHTML = `
        ${timezoneName}
    `
}

function updateClockHands(localtime, hr, min, sec, deg) {
    const hh = localtime.getHours() * 30 + (localtime.getMinutes() / 2); // Each hour is 30 degrees
    const mm = localtime.getMinutes() * deg;
    const ss = localtime.getSeconds() * deg;

    hr.style.transform = `rotateZ(${hh}deg)`;
    min.style.transform = `rotateZ(${mm}deg)`;
    sec.style.transform = `rotateZ(${ss}deg)`;
}

// New function to update the digital clock
function updateDigitalClock(localtime, digitalClock) {
    const hours = String(localtime.getHours()).padStart(2, '0');
    const minutes = String(localtime.getMinutes()).padStart(2, '0');
    const seconds = String(localtime.getSeconds()).padStart(2, '0');
    digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
}

// display historical data. 6 days from yesterday
function displayHistoricalData(data) {

    const historical = document.querySelector(".historicalContainer");
    const history_data = data.history.forecast.forecastday;
    for(let day = 5; day >= 0; day--) {
        const history_day = history_data[day];
        const icon = "https:" + history_day.day.condition.icon;
        // test data
        const avg_temp = Math.round(history_day.day.avgtemp_c);
        const min_temp = history_day.day.mintemp_c;
        const max_temp = history_day.day.maxtemp_c;
        const change_of_rain = history_day.day.daily_chance_of_rain;
        const uv = history_day.day.uv;

        let date = new Date(history_day.date);
        let formattedDate = new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        }).format(date);

        if (day == 5) {
            formattedDate = "Yesterday";
        }

        historical.innerHTML += `
            <div class="historicalItem">
                <h4>${formattedDate}</h4>
                <img src="${icon}" class="historicalImage">
                <div class="historicalDetails">
                    <p>${avg_temp}°C <span style="color:lightblue; opacity:0.7;">/ ${change_of_rain}%</span></p>
                </div
            </div>
        `
    }





}

function displayImages(images) {
    const image_div = document.querySelector(".images");
    const images_data = images.photos;

    // Create a loading counter
    let imagesLoaded = 0;

    // Function to load and display an image
    const loadImage = (index) => {
        if (index >= images_data.length) return; // Stop if all images are loaded

        const url = images_data[index].src.original;
        const alt = images_data[index].alt;

        const img = document.createElement('img');
        img.src = url;
        img.alt = alt;
        img.classList.add('loopImage', 'hidden'); // Initially hidden

        // Set the load event
        img.onload = () => {
            imagesLoaded++; // Increment the counter when an image loads
            // Start the slideshow if all images have loaded
            if (imagesLoaded === images_data.length) {
                // Remove hidden class and start slideshow
                document.querySelectorAll('.loopImage').forEach(image => {
                    image.classList.remove('hidden');
                });

                startSlideshow(document.querySelectorAll('.loopImage'));
            }
        };

        // Append the image to the container
        image_div.appendChild(img);

        // Load the next image after a delay
        setTimeout(() => loadImage(index + 1), 1000); // Delay of 1 second
    };

    // Start loading images
    loadImage(0); // Start with the first image
}

function startSlideshow(images) {
    let current = 0;

    // Initialize first image as active
    images[current].classList.add('active');

    setInterval(() => {
        // Remove active class from the current image
        images[current].classList.remove('active');

        // Move to the next image, looping back to start if necessary
        current = (current + 1) % images.length;

        // Add active class to the new current image
        images[current].classList.add('active');
    }, 3000); // Change every 3 seconds
}

function displayLocations(locations) {
    if (locations.length === 0) {
        country_selector = document.querySelector(".countryOptions");
        country_selector.innerHTML = `
                <div class="dataCell">
                    <p>No location found!</p>
                </div>
                <div class="dataCell">
                    <p>Typo perahps?</p>
                </div>
            `
        return; // Exit the function if no locations
    }

    if(locations.length == 1) {
        const lat_long = `${locations[0].lat},${locations[0].lon}`
        // Trigger animations
        animate(lat_long);
        // Fetch the weather data
        fetchWeather(lat_long);
    }
    else {
        country_selector = document.querySelector(".countryOptions");
        
        for(let country = 0; country < locations.length; country++) {

            const country_name = locations[country].country;
            const lat = locations[country].lat;
            const long = locations[country].lon;
            const name = locations[country].name;
            const region = locations[country].region;

            country_selector.innerHTML += `
                <div class="dataCell" data-loc="${lat},${long}">
                    <p>${name}, ${region ? region + "," : ""} ${country_name}</p>
                </div>
            `
        }
        console.log(1);
        
        document.querySelectorAll(".dataCell").forEach(function(cell) {
            cell.addEventListener("click", function() {

                const lat_long = cell.getAttribute("data-loc");
                animate(lat_long);
                fetchWeather(lat_long);
            });
        });

    }

} 

async function fetchLocations(location) {

    try {
        
        const location_data = await fetch(`http://127.0.0.1:5000/api/search?location=${location}`);
        const loc = await location_data.json();
        console.log(loc);
        displayLocations(loc);
        
    }
    catch (error) {
        displayError("An error occurred."); 
    }


}

async function fetchWeather(location) {
    try {
        // Send a request to the backend API with the country as a parameter 
        const forecast_data = await fetch(`http://127.0.0.1:5000/api/weather?location=${location}`);
        
        // Parse the response as JSON
        const data = await forecast_data.json();
        
        const pexel_images = await fetch(`http://127.0.0.1:5000/api/images?location=${data.forecast.location.country}`);
        const images = await pexel_images.json();

        console.log("Weather Data:", data); // remove them after testing is over
        console.log("Image data:", images); // remove them after testing is over

        if (data.error) {
            displayError("Weather data not found.");
        } else {
            displayMainData(data);
            displayForecastData(data);
            displayTime(data);
            displayHistoricalData(data);
            displayImages(images);
        }
    } catch (error) {
        displayError("An error occurred."); // Adds box below, you have to display it somewhere else @Aryan
    }
}
// retrieve user location and use lat and long for location
async function fetchIp() {
    try {
        // Fetch the location data from the API
        const response = await fetch("http://127.0.0.1:5000/api/ip");
        
        // Check if the response is okay (status 200)
        if (!response.ok) throw new Error("Failed to fetch location data.");

        // Parse the JSON from the response
        const locationData = await response.json();

        fetchWeather(`${locationData.lat},${locationData.lon}`)
            
    } catch (error) {
        console.error("Error fetching location data:", error);
    }

}
// Function to display error messages
function displayError(message) {
    // replaced additional element creation (put error in console devtools)
    console.log(message)
}