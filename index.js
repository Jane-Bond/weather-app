// Global variables
let apiKey = "2a122bfa0ff88e4ce25877a315e47c8f";
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

//Display Forecast functionality
function displayForcast() {
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let daysShort = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
  daysShort.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
        <div class="col-2">
          <div class="weather-forecast-date">${day}</div>
          <img src="https://openweathermap.org/img/wn/50d@2x.png" alt="" width="42" />
          <div class="weather-forecast-temp">
            <span class="weather-forecast-temp-max"> +12°C </span>
            <div class="vr"></div>
            <span class="weather-forecast-temp-min"> +2°C </span> 
          </div>
        </div>  
    `;
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
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
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  mainWeatherIcon.setAttribute("alt", response.data.weather[0].description);

  displayForcast();
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
