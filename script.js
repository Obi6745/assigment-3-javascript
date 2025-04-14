const API_KEY = '9d68a4364c162e2cdfb93cf46be71d5d'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

//main dom elements 
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecast = document.getElementById('forecast');

//event listeners

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

//handle search part 

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return; 

    try {
        // Get current weather
        const currentWeather = await getCurrentWeather(city);
        updateCurrentWeather(currentWeather);
        
        // Get forecast
        const forecastData = await getForecast(city);
        updateForecast(forecastData);
    } catch (error) {
        alert('Error fetching weather data. Please try again.'); 
        console.error('Error:', error); 
    }
}

//fetch the weather 
async function getCurrentWeather(city) {
    const response = await fetch(
        `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`

    );
    if (!response.ok) {
        throw new Error ('Weather data not found');

    }
    return await response.json(); 
}

//get the 5 day forecast 

async function getForecast(city) {
    const response = await fetch(
        `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    if (!response.ok) {
        throw new Error('Forecast data not found');
    }
    return await response.json();
}

//update weather display 
function updateCurrentWeather (data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = Math.round(data.main.temp);
    description.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity;
    wind.textContent = Math.round(data.wind.speed * 3.6);

}

//update forecast display 
function updateForecast(data) {
    forecast.innerHTML = '';

    //grouping forecast data by day 
    const dailyForecasts = data.list.reduce((acc, item) => {
        const date = new Date(item.dt *1000).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = item;
        }
        return acc;
    }, {});

    //forecast cards for each day 

    Object.values(dailyForecasts).forEach(day => {
        const date = new Date(day.dt *1000); 
        const dayName = date.toLocaleTimeString('en-US', {weekday: 'short'});

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-day'; 
        forecastCard.innerHTML =  `
        <h4>${dayName}</h4>
        <div class="temperature">${Math.round(day.main.temp)}°C</div>
        <div class="weather-description">${day.weather[0].description}</div>
    `;
    
    forecast.appendChild(forecastCard);
    })

    

}
