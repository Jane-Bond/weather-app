// Global variables
let apiKey = "2a122bfa0ff88e4ce25877a315e47c8f";
// let apiKey = "d9803dcae6ab8b9fd76b5768bdafc19f";
let mainWeatherIcon = document.querySelector("#icon");

function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return `${day} ${hours}:${minutes}`;
}

// Feature Show Current Date
let currentDate = document.querySelector("#current-date");
let currentTime = new Date();
currentDate.innerHTML = formatDate(currentTime);

let currentDay = document.querySelector(".current-day");

function getMonthAndDay(date) {
  const monthNames = [
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
    "December",
  ];
  let curMonth = monthNames[currentTime.getMonth()];
  let curDate = currentTime.getDate();

  return `${curMonth}, ${curDate}`;
}
currentDay.innerHTML = getMonthAndDay(currentTime);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//Display Forecast functionality
function displayForecast(response) {
  let forecast = response.data.daily;
  console.log(response.data);

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    let forecastMaxTemp = Math.round(forecastDay.temp.max);
    let forecastMinTemp = Math.round(forecastDay.temp.min);

    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
        <div class="col-2">
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img class="forecast-icon" src="https://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png" alt=""  />
          <div class="weather-forecast-temp">
            <span class="weather-forecast-temp-max"> ${forecastMaxTemp}°C </span>
            <div class="vr"></div>
            <span class="weather-forecast-temp-min"> ${forecastMinTemp}°C </span> 
          </div>
        </div>  
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric&`;
  axios.get(apiUrl).then(displayForecast);
}

// Feature Show Temperature
function displayWeatherCondition(response) {
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("#current-temperature").innerHTML = `${temperature}°C`;

  // Change city name from API response
  document.querySelector(
    "p.city-name"
  ).innerHTML = `${response.data.name}, ${response.data.sys.country} `;

  // Changing the main icon and alt text
  mainWeatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(enterCity) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${enterCity}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

let searchLocationBtn = document.querySelector("#search-location-btn");
searchLocationBtn.addEventListener("click", function (event) {
  event.preventDefault();
  let enterCity = document.querySelector("#enter-city").value;
  searchCity(enterCity);
});

// Get current location
function searchLocation(response) {
  let lat = response.coords.latitude;
  let lon = response.coords.longitude;
  document.querySelector("#enter-city").value = "";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let curLocationBtn = document.querySelector("#current-location-btn");
curLocationBtn.addEventListener("click", getCurrentLocation);

searchCity("Brisbane");

// function enterCity() {
//   let city = prompt("Enter a city?");

//   if (weather[city] !== undefined) {
//     city = city.toLowerCase();
//     let temperature = weather[city].temp;
//     let humidity = weather[city].humidity;
//     let cTemp = Math.round(temperature);
//     let fTemp = Math.round((temperature * 9) / 5 + 32);
//   }
// }
