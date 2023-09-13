// displaying the current date and time
function formatDate() {
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
}

function formatDay(timestamp) {
    let now = new Date(timestamp * 1000);
    let day = now.getDay();
    let days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    return days[day];
}

// Adding a search engine
let searchInput = document.querySelector("#search-input");
let searchBtn = document.querySelector(".searchCityBtn");
let searchCity = document.querySelector("#searchCity");


let temperature = document.querySelector("#currentTemp");


// display current position
let currentPositionBtn = document.querySelector(".searchCurrentBtn");
let description = document.querySelector(".description");

// display all info about weather
function showWeather(response) {
    formatDate()
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
    let celsiusTemperature = response.data.main.temp;
    maxTemp.innerHTML = `${Math.round(dataRespons.main.temp_max)}&#176;`;
    minTemp.innerHTML = `${Math.round(dataRespons.main.temp_min)}&#176;`;
    humidity.innerHTML = `${dataRespons.main.humidity}%`;
    temperature.innerHTML = `${Math.round(celsiusTemperature)}`;
    windSpeed.innerHTML = `${Math.round(dataRespons.wind.speed)}m/s`;
    displayPicture();

    getForecast(response.data.coord);
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
function showSearchCity(city) {
    let urlApi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(urlApi).then(showWeather);

}

function handleSubmit(event) {
    event.preventDefault();
    let city = searchInput.value;
    showSearchCity(city);
    searchInput.value = "";
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
searchBtn.addEventListener("click", handleSubmit);

let temp = document.querySelector("#currentTemp");

// Display week forecast
function displayForecast(response) {
    let forecast = response.data.daily;
    let forecastElement = document.querySelector(".extendedForecast");
    console.log(forecast);

    let forecastHTML = `<h3 class = "fw-bold mt-5 mb-4" > Extended Forecast </h3><div class="card-group row-cols-1 row-cols-md-2 g-4">
     `;
    forecast.forEach(function (forecastDay, index) {
        if (index < 6) {
            forecastHTML +=
                `<div class="card text-center m-3 rounded border ms-5">
                <h4 class="mt-4  fw-bolder">${formatDay(forecastDay.dt)}</h4>
                    <img src = "./images/${displayPictureForecast(forecastDay.weather[0].description)}" class = "card-img-top m-auto" alt = "..." >
                    <div class="card-body">
                        <h5 class="card-title">Clear</h5>
                        <p class = "card-text"> ${Math.round(forecastDay.temp.max)}°/${Math.round(forecastDay.temp.min)}° </p>
                    </div>
                    </div>`;
        }
    });
    forecastHTML = forecastHTML + `</div>`;
    forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
    // let apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
    let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
}
// toggle from Fahrenheit to Celsius
function showTempFahrenheit(event) {
    event.preventDefault();

    let temperatureElement = document.querySelector("#currentTemp");
    celsiusTemperature = temperatureElement.innerHTML;
    if (!fahrenheit.classList.contains('active')) {
        let fahrenheiTemperature = (celsiusTemperature * 9) / 5 + 32;
        temperatureElement.innerHTML = Math.round(fahrenheiTemperature);
    }
    fahrenheit.classList.add("active");
    celsius.classList.remove("active");
}

// toggle from Celsius to Fahrenheit
function showTempCelsius(event) {
    event.preventDefault();
    celsius.classList.add("active");
    fahrenheit.classList.remove("active");
    let temperatureElement = document.querySelector("#currentTemp");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheit = document.querySelector("#fahrenheit");
fahrenheit.addEventListener("click", showTempFahrenheit);

let celsius = document.querySelector("#celsius");
celsius.addEventListener("click", showTempCelsius);

// changing the image depending on the weather
function displayPicture() {
     let sunImg = document.querySelector('.sunImg')
    if (description.innerHTML === "clear sky") {
        sunImg.setAttribute("src", "./images/hot_sun_weather.png");
     
    } else if (description.innerHTML === "few clouds") {
        sunImg.setAttribute("src", "./images/cloud_sun_sunny_weather.png");
    } else if (
        description.innerHTML === "scattered clouds" ||
        description.innerHTML === "broken clouds" ||
        description.innerHTML === "overcast clouds"
    ) {
        sunImg.setAttribute("src", "./images/cloud_weather.png");
    } else {
        sunImg.setAttribute("src", "./images/cloud_rain_weather.png");
    }
}

function  displayPictureForecast(description) {
  
    if (description === "clear sky") {
         return "hot_sun_weather.png"
    } else if (description === "few clouds") {
       return "cloud_sun_sunny_weather.png"
    } else if (
        description === "scattered clouds" ||
        description === "broken clouds" ||
        description=== "overcast clouds"
    ) {
        return "cloud_weather.png"
    } else {
      return "cloud_rain_weather.png"
    }
}


showSearchCity("Paris");