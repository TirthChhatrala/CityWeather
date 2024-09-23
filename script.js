const displayCity = document.getElementById('cityName');
const displayTempCelsius = document.getElementById('tempCelsius');
const displayTempFahrenheit = document.getElementById('tempFahrenheit');
const displayDescription = document.getElementById('weatherDesc');
const suggestionsList = document.getElementById('suggestions');
const cityInput = document.getElementById('cityInput');
const clearButton = document.querySelector('.clear-btn');

// Clear weather data
function clearWeather() {
    cityInput.value = '';
    displayCity.innerText = '';
    displayTempCelsius.innerText = '';
    displayTempFahrenheit.innerText = '';
    displayDescription.innerText = '';
    suggestionsList.innerHTML = '';
}

// Fetch coordinates for the city
async function getCoordinates(city) {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=5`;

    try {
        const response = await fetch(geoApiUrl);
        const data = await response.json();

        if (data && data.results && data.results.length > 0) {
            return data.results;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching city coordinates:', error);
        return [];
    }
}

// Fetch weather data
async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        alert('Please enter a city name!');
        return;
    }

    const coordinates = await getCoordinates(city);

    if (coordinates.length === 0) {
        alert('City not found!');
        return;
    }

    const { latitude, longitude, name } = coordinates[0];
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const response = await fetch(weatherApiUrl);
        const data = await response.json();

        if (data && data.current_weather) {
            const tempCelsius = data.current_weather.temperature;
            const tempFahrenheit = (tempCelsius * 9/5) + 32;
            const description = "Clear"; // Default to 'Clear'

            displayCity.innerText = name;
            displayTempCelsius.innerText = `${tempCelsius.toFixed(1)}`;
            displayTempFahrenheit.innerText = `${tempFahrenheit.toFixed(1)}`;
            displayDescription.innerText = description;

            // No background image change
        } else {
            alert('Weather data not available.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Unable to fetch weather data.');
    }
}

// Handle autocomplete suggestions
async function autocomplete() {
    const city = cityInput.value.trim();

    if (city.length < 3) {
        suggestionsList.innerHTML = '';
        return;
    }

    const coordinates = await getCoordinates(city);

    if (coordinates.length === 0) {
        suggestionsList.innerHTML = '';
        return;
    }

    suggestionsList.innerHTML = coordinates.map(result => 
        `<li onclick="selectCity('${result.name}')">${result.name}</li>`
    ).join('');
}

// Select a city from suggestions
function selectCity(city) {
    cityInput.value = city;
    suggestionsList.innerHTML = '';
    getWeather();
}

// Event listeners
cityInput.addEventListener('input', autocomplete);
clearButton.addEventListener('click', clearWeather);

// Validate the input for city name and enable/disable the search button accordingly
function validateInput() {
    const cityInput = document.getElementById('cityInput');
    const searchButton = document.getElementById('searchButton');
    
    // Check if input has at least 3 characters (adjust as needed)
    if (cityInput.value.length >= 3) {
        searchButton.disabled = false;
    } else {
        searchButton.disabled = true;
    }
}

// Clear the weather data
function clearWeather() {
    document.getElementById('cityName').textContent = '';
    document.getElementById('tempCelsius').textContent = '';
    document.getElementById('tempFahrenheit').textContent = '';
    document.getElementById('weatherDesc').textContent = '';
    document.getElementById('suggestions').innerHTML = '';
}

// Dummy function for fetching weather data (replace with real API call)
function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    document.getElementById('cityName').textContent = cityInput;
    document.getElementById('tempCelsius').textContent = "25";
    document.getElementById('tempFahrenheit').textContent = "77";
    document.getElementById('weatherDesc').textContent = "Clear skies";
}

