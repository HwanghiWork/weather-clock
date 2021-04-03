const COORDS = 'coords';
const API_KEY = "3b41a1e33d873861c096344df2c7bde8";
const jsWeather = document.querySelector(".js-weather");

function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}

function handleGeoSucces(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude
  };
  saveCoords(coordsObj);
  loadCoords();
}

function handleGeoError() {
  console.log("Cant access geo location");
}

function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
}

function loadCoords() {
  const loadedCoords = localStorage.getItem(COORDS);
  if (loadedCoords === null) {
    askForCoords();
  } else {
    console.log('new weather!');
    // get location coordinates
    const coordsObj = JSON.parse(localStorage.getItem(COORDS));
    // get weather
    getWeatherInfo(coordsObj);
  }
}

function getWeatherInfo(coordsObj) {
  const { latitude, longitude } = coordsObj;

  const request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    request.open("GET", url);
    request.responseType = 'text';

    request.onload = function () {
      const weatherInfo = JSON.parse(request.response);
      const weatherObject = {
        place: weatherInfo.name,
        temp: weatherInfo.main.temp,
        weather: weatherInfo.weather[0].main
      };
      paintWeather(weatherObject);
    };

    request.send();
}

function paintWeather(weatherObject) {
  const { place, temp, weather } = weatherObject;
  jsWeather.classList.add(SHOWING_CN);
  jsWeather.innerHTML = `<h4>${place}</h4><p>${temp}</p><p>${weather}</p>`;
}

function init() {
  loadCoords();
}

init();