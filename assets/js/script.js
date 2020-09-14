// global variables go here
// gets today's date
var date = moment().format('L');

// references to DOM elements go here
// stores the reference to the <form> element for the event listener
var searchFormEl = document.querySelector("#search-form");
// stores the reference to the <input> element in which the user types in a city
var cityInputEl = document.querySelector("#city-input");
// stores the reference to the <li> element that saves previously searched cities
var cityHistoryEl = document.querySelector("#city-history");
// stores the references to the "today" card
var todayCardEl = document.querySelector("#today-card");
var cityNameEl = document.querySelector("#city-name");
var todayTempEl = document.querySelector("#today-temp");
var todayHumidityEl = document.querySelector("#humidity");
var todayWindSpeedEl = document.querySelector("#wind-speed");
var todayUvIndexEl = document.querySelector("#uv-index");
var todayIconEl = document.querySelector("#today-icon");
// stores the references to the forecast area
var forecastTitleEl = document.querySelector("#forecast-title");
var forecastCardsEl = document.querySelector("#forecast-cards");

// api key for openweathermap.org
var apiKey = "9849d30984dfb30a728bbf6105d4f56d";

// convert temperature from kelvin to fahrenheit
function convert(kelvin) {
    var fahrenheit = (kelvin - 273.15)*(9/5)+32;
    var fahrenheitRounded = Math.round(fahrenheit);
    return fahrenheitRounded;
}

// function gets the UV index for today.  api requires search by latitude and longitude.
var getCityUvToday = function(latitude,longitude) {
    // format the api url for long/lat of user-input city
    var apiUrlTodayUv = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + latitude + "&lon=" + longitude;

    fetch(apiUrlTodayUv)
        .then(function(uvResponse) {
            return uvResponse.json();
        })
        .then(function(uvResponse) {
            var index = uvResponse.value;
            var indexRounded = Math.round(index);
            todayUvIndexEl.textContent = "UV Index: " + indexRounded;

            if (indexRounded < 3) {
                todayUvIndexEl.classList = "favorable";
            }
            else if (indexRounded > 7) {
                todayUvIndexEl.classList = "severe";
            }
            else {
                todayUvIndexEl.classList = "moderate";
            }
        })
    ;
}

// function gets and displays today's weather from api
var getCityWeatherToday = function(city) {
    
    // format the api url to accept city search
    var apiUrlToday = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

    fetch(apiUrlToday)
        .then(function(weatherResponse) {
            if (weatherResponse.ok) {
                return weatherResponse.json();
            } else {
                alert("Error: Please verify city name and try again.");
                return;
            }
        })
        .then(function(weatherResponse) {
            // adds card class to today-card
            todayCardEl.setAttribute("class","card");

            // saves the city name
            var displayName = weatherResponse.name;

            // gets weather icon
            var iconCode = weatherResponse.weather[0].icon;
            var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
            // display city, date, and icon
            cityNameEl.textContent = displayName + " (" + date + ")";
            todayIconEl.setAttribute("src", iconUrl);
            
            // save & display the temperature 
            var tempInKelvin = weatherResponse.main.temp;
            var tempInFahrenheit = convert(tempInKelvin);
            todayTempEl.textContent = "Temperature: " + tempInFahrenheit + "°F";
            
            // save & display the humidity
            var humidity = weatherResponse.main.humidity;
            todayHumidityEl.textContent = "Humidity: " + humidity + "%";

            // save & display the wind speed
            var windSpeed = weatherResponse.wind.speed;
            todayWindSpeedEl.textContent = "Wind Speed: " + windSpeed + "mph";

            // saves latitude and longitude and passes into UV function
            var cityLatitude = weatherResponse.coord.lat;
            var cityLongitude = weatherResponse.coord.lon;
            getCityUvToday(cityLatitude,cityLongitude);

            getCityForecast(city);
        })
    ;
}

// function displays the 5-day forecast from received data
var displayCityForecast = function(forecast) {

    // clear old data
    forecastTitleEl.textContent = "";
    forecastCardsEl.textContent = "";

    // indices 5, 13, 21, 29, 37 are 3PM for each successive day
    var indicesArray = [5, 13, 21, 29, 37];

    // create element for title
    var titleEl = document.createElement("h4");
    titleEl.textContent = "5-day Forecast";
    forecastTitleEl.appendChild(titleEl);

    for (var i = 0; i < indicesArray.length; i++) {
        // adds card for each successive day
        // wrapper div
        var wrapperEl = document.createElement("div");
        wrapperEl.classList = "col-md card-wrapper";

        // card div
        var cardEl = document.createElement("div");
        cardEl.classList = "card single-day";

        // card body div
        var cardBodyEl = document.createElement("div");
        cardBodyEl.classList = "card-body";

        // card title div aka next date
        // create container
        var nextDateEl = document.createElement("h5");
        nextDateEl.classList = "card-title";
        // get date and format
        var dateIndex = indicesArray[i];
        var responseDate = forecast.list[dateIndex].dt_txt;
        var dateArray = responseDate.split(" ");
        var displayDate = dateArray[0];
        nextDateEl.textContent = displayDate;
        // append
        cardBodyEl.appendChild(nextDateEl);

        // icon img
        // create container
        var iconImgEl = document.createElement("img");
        var iconCode = forecast.list[dateIndex].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
        // display city and date
        iconImgEl.setAttribute("src", iconUrl);     
        // append               
        cardBodyEl.appendChild(iconImgEl);

        // temperature p
        // create container
        var tempEl = document.createElement("p");
        tempEl.classList = "card-text";
        // get temp and convert
        var getTempinK = forecast.list[dateIndex].main.temp;
        var tempinF = convert(getTempinK);
        tempEl.textContent = "Temperature: " + tempinF + "°F";
        // append
        cardBodyEl.appendChild(tempEl);

        // humidity p
        // create container
        var humidityEl = document.createElement("p");
        humidityEl.classList = "card-text";
        // get humidity
        var humidity = forecast.list[dateIndex].main.humidity;
        humidityEl.textContent = "Humidity: " + humidity + "%";
        // append
        cardBodyEl.appendChild(humidityEl);

        // append containers
        cardEl.appendChild(cardBodyEl);
        wrapperEl.appendChild(cardEl);
        forecastCardsEl.appendChild(wrapperEl);
    }
}

// function gets 5-day forecast from api
var getCityForecast = function(city) {
    // format the api url to accept city search
    var apiUrlToday = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

    fetch(apiUrlToday)
        .then(function(forecastResponse) {
            if (forecastResponse.ok) {
                forecastResponse.json().then(function(data) {
                    displayCityForecast(data);
                });
            } 
        })
        .catch(function(error) {
            alert("Unable to connect to GitHub");
        });
    ;
}

// function loads stored city from local storage
function loadHistory() {
    var getHistory = JSON.parse(localStorage.getItem("search-history"));
    console.log(getHistory);

    // array to hold search history in local storage if no data exists
    if (!getHistory) {
        var getHistory = [];
        localStorage.setItem("search-history", JSON.stringify(getHistory));
    }

    for (var i = 0; i < getHistory.length; i++) {
        // create container to display search history
        var loadCityEl = document.createElement("button");
        loadCityEl.classList = "history-button";
        loadCityEl.textContent = getHistory[i];
        cityHistoryEl.appendChild(loadCityEl);
    }
}

// function creates button representing stored city
var createHistoryButton = function(city) {
    // create container to display search history
    var saveCityEl = document.createElement("button");
    saveCityEl.classList = "history-button";
    saveCityEl.textContent = city;
    cityHistoryEl.appendChild(saveCityEl);
}

// function saves newly input city
var saveSearch = function(city) {
    // add to local storage array
    var saveHistory = JSON.parse(localStorage.getItem("search-history"));
    saveHistory.push(city);
    localStorage.setItem("search-history", JSON.stringify(saveHistory));

    createHistoryButton(city);
}

// function passes city stored from local storage to main functions
var loadFromButton = function(event) {
    var buttonSearchTerm = event.target.textContent;
    console.log(buttonSearchTerm);

    getCityWeatherToday(buttonSearchTerm);
}

// handles user input into search field
var formSubmitHandler = function(event) {
    event.preventDefault();

    // sets cityName to the value input by the user
    var cityName = cityInputEl.value.trim();

    // input is passed to getCityWeather function then clears the form
    if (cityName) {
        getCityWeatherToday(cityName);
        // clears out the search bar
        cityInputEl.value = "";

        // save city to search history
        saveSearch(cityName);
    } 
    else {
        alert("Please enter a city");
    }
}

loadHistory();

// event listener for submission of search term
searchFormEl.addEventListener("submit", formSubmitHandler);
// event listener for click of loaded history buttons
cityHistoryEl.addEventListener("click", loadFromButton);