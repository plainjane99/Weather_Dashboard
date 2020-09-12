// references to DOM elements go here
// stores the reference to the <form> element for the event listener
var searchFormEl = document.querySelector("#search-form");
// stores the reference to the <input> element in which the user types in a city
var cityInputEl = document.querySelector("#city-input");
// stores the reference to city's name
var cityNameEl = document.querySelector("#city-name");
// stores the reference to today's temperature
var todayTempEl = document.querySelector("#today-temp");

// api key for openweathermap.org
var apiKey = "9849d30984dfb30a728bbf6105d4f56d";

// for 5-day forecast
// http://api.openweathermap.org/data/2.5/forecast?q={city name}&appid=9849d30984dfb30a728bbf6105d4f56d

// convert temperature from kelvin to fahrenheit
function convert(kelvin) {
    var fahrenheit = (kelvin - 273.15)*(9/5)+32;
    var fahrenheitRounded = Math.round(fahrenheit);
    return fahrenheitRounded;
}

// function to get weather from api
var getCityWeatherToday = function(city) {
    
    // format the api url to accept city search
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    console.log(apiUrl);

    fetch(apiUrl)
        .then(function(weatherResponse) {
            return weatherResponse.json();
        })
        .then(function(weatherResponse) {
            // saves & displays the city name
            var displayCityName = weatherResponse.name;
            cityNameEl.textContent = displayCityName;
            
            // saves & displays the temperature 
            var tempInKelvin = weatherResponse.main.temp;
            var tempInFahrenheit = convert(tempInKelvin);
            todayTempEl.textContent = tempInFahrenheit + "°F";
            

        })
        
    ;
}

var formSubmitHandler = function(event) {
    event.preventDefault();

    // sets cityName to the value input by the user
    var cityName = cityInputEl.value.trim();
    console.log(cityName);

    // input is passed to getCityWeather function then clears the form
    if (cityName) {
        getCityWeatherToday(cityName);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
}

// event listener for submission of search term
searchFormEl.addEventListener("submit", formSubmitHandler);

