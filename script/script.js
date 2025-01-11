const weatherForm = document.querySelector('.weatherForm');
const cityInput = document.querySelector('.cityInput');
const card = document.querySelector('.card');
const apiKey = '9397d91b8f28eee88c8b310de3c8fda9';

weatherForm.addEventListener('submit', async event => {

    event.preventDefault();

    const city = cityInput.value;

    if (city) {

        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);

        } catch (error) {
            console.error(error);
            displayError(error);
        }
    }
    else {
        displayError('Please enter a city');
    }

});

async function getWeatherData(city) {

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error('Could not fetch weather data');
    }
    console.log(response);
    return await response.json();

}

function displayWeatherInfo(data) {
    const {
        name: city,
        main: { temp, feels_like, humidity },
        weather: [{ description, id }],
        wind: { speed: windSpeed },
        sys: { sunrise, sunset, country },
        timezone
    } = data;

    card.textContent = "";
    card.style.display = "block";

    // Create elements
    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const feelsLikeDisplay = document.createElement('p');
    const humidityDisplay = document.createElement('p');
    const descDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('p');
    const windDisplay = document.createElement('p');
    const sunriseSunsetDisplay = document.createElement('div');

    // Fill elements with data
    cityDisplay.innerHTML = `<i class="fas fa-map-marker-alt small-icon"></i> ${city}, ${country}`;
    tempDisplay.textContent = `${temp.toFixed(1)} °C`;
    feelsLikeDisplay.innerHTML = `<strong>Feels Like:</strong> ${feels_like.toFixed(1)} °C`;
    humidityDisplay.innerHTML = `<strong>Humidity:</strong> ${humidity}%`;
    descDisplay.textContent = description.charAt(0).toUpperCase() + description.slice(1);
    weatherEmoji.textContent = getWeatherEmoji(id);
    windDisplay.innerHTML = `<strong>Wind Speed:</strong> ${windSpeed} m/s`;

    // Sunrise and Sunset Times 
    const localSunrise = new Date((sunrise + timezone) * 1000).toUTCString().slice(-12, -7);
    const localSunset = new Date((sunset + timezone) * 1000).toUTCString().slice(-12, -7);

    // Display sunrise and sunset
    sunriseSunsetDisplay.classList.add('sunriseSunsetContainer');
    sunriseSunsetDisplay.innerHTML = `<strong>Sunrise:</strong> ${localSunrise} | <strong>Sunset:</strong> ${localSunset}`;

    // Add classes for styling
    cityDisplay.classList.add('cityDisplay');
    tempDisplay.classList.add('tempDisplay');
    feelsLikeDisplay.classList.add('feelsLikeDisplay');
    humidityDisplay.classList.add('humidityDisplay');
    descDisplay.classList.add('descDisplay');
    weatherEmoji.classList.add('weatherEmoji');
    windDisplay.classList.add('windDisplay');
    sunriseSunsetDisplay.classList.add('sunriseSunsetDisplay');

    // Append elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(feelsLikeDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(descDisplay);
    card.appendChild(windDisplay);
    card.appendChild(sunriseSunsetDisplay);
}


function getWeatherEmoji(weatherId) {

    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌧️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case (weatherId === 800):
            return "☀️";
        case (weatherId >= 801 && weatherId < 809):
            return "☁️";
        default:
            return "🌏";

    }
}

function displayError(message) {
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.classList.add('errorDisplay');

    card.textContent = "";
    card.style.display = 'flex'
    card.appendChild(errorDisplay);
}