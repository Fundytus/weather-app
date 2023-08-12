// displaying the current date and time
let now = new Date();
let currentDate = document.querySelector(".currentDate");
let day = now.getDay();
let month = now.getMonth();
let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
day = days[now.getDay()];
let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
month = months[now.getMonth()];
let dayNumber = now.getDate();
if (dayNumber === 1) {
    dayNumber = 1 + "st";
} else if (dayNumber === 2) {
    dayNumber = 2 + "nd";
} else if (dayNumber === 3) {
    dayNumber = 2 + "rd";
} else {
    dayNumber = dayNumber + "th";
}

let hours = now.getHours()
if (hours < 10) {
    hours = `0${hours}`;
}

let minutes = now.getMinutes();
if (minutes < 10) {
    minutes = `0${minutes}`;
}

currentDate.innerHTML = `${day}, ${dayNumber} ${month} ${now.getFullYear()}, ${hours}:${minutes}`;

// Adding a search engine
let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector(".searchCityBtn");
let searchCity = document.querySelector("#searchCity");

// function showCity(event) {
//     event.preventDefault();
//     searchCity.innerHTML = searchInput.value;
// }

// Displaying a fake temperature
// let celsiusBtn = document.querySelector('#celsius');
// let fahrenheitBtn = document.querySelector('#fahrenheit');


// function showTempFahrenheit(event) {
//     event.preventDefault();
//     console.log(temperature);
//     temperature.innerHTML = Math.round((temperature.innerHTML * 9 / 5) + 32);
// }

// function showTempCelsius(event) {
//     event.preventDefault()
//     temperature.innerHTML = Math.round((temperature.innerHTML - 32) * 5 / 9);
// }
// fahrenheitBtn.addEventListener('click', showTempFahrenheit);
// celsiusBtn.addEventListener('click', showTempCelsius)

// display current position
let currentPositionBtn = document.querySelector(".searchCurrentBtn");
let description = document.querySelector(".description");

// display all info about weather
function showWeather(response) {
    console.log(response.data);
    let dataRespons = response.data;
    let temperature = document.querySelector("#currentTemp");
    let minTemp = document.querySelector(".lowTemp");
    let maxTemp = document.querySelector(".highTemp");
    let humidity = document.querySelector(".humidity");
    let feelsLikeTemp = document.querySelector(".feelsLike");
    let windSpeed = document.querySelector(".windSpeed");
    searchCity.innerHTML = dataRespons.name;
    description.innerHTML = dataRespons.weather[0].description;
    feelsLikeTemp.innerHTML = `Feels like  ${Math.round(
    dataRespons.main.feels_like
  )}&#176;`;
    maxTemp.innerHTML = `${Math.round(dataRespons.main.temp_max)}&#176;`;
    minTemp.innerHTML = `${Math.round(dataRespons.main.temp_min)}&#176;`;
    humidity.innerHTML = `${dataRespons.main.humidity}%`;
    temperature.innerHTML = `${Math.round(dataRespons.main.temp)}&#176;`;
    windSpeed.innerHTML = `${Math.round(dataRespons.wind.speed)}m/s`;
    displayPicture();
}

let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
// weather in current position
function retrievePosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    axios.get(url).then(showWeather);
}

function displayCurrentWeather(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(retrievePosition);
}
currentPositionBtn.addEventListener("click", displayCurrentWeather);

// weather in search City
function showSearchCity() {
    let city = searchInput.value;
    let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(urlApi).then(showWeather);
    searchInput.value = "";
}
searchBtn.addEventListener("click", showSearchCity);

// changing the image depending on the weather
function displayPicture() {
    let sunImg = document.querySelector(".sunImg");
    if (description.innerHTML === "clear sky") {
        sunImg.setAttribute("src", "./images/hot_sun_weather.png");
    } else if (description.innerHTML === "few clouds") {
        sunImg.setAttribute("src", "./images/cloud_sun_sunny_weather.png");
    } else if (
        description.innerHTML === "scattered clouds" ||
        description.innerHTML === "broken clouds"
    ) {
        sunImg.setAttribute("src", "./images/cloud_weather.png");
    } else {
        sunImg.setAttribute("src", "./images/cloud_rain_weather.png");
    }
}