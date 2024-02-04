const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");
const notFoundCity = document.querySelector("[data-notfound]");
let API_KEY='972017af572545cb246ec18713471dda'; //api key 
let currentTab=userTab;
currentTab.classList.add("current-tab");
getfromSessionStorage();

//function for swithing tabs
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
    //currrently on the user weather showing tab 
    //so needed to visible the search tab and make invisble the user tab
     if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
     }
     //else if we are at search tab and wanted to see the user tab 
     // so we need to make user tab visible and search tab invisible
     else{
     searchForm.classList.remove("active");//removed the active from searchform to make it invisible
     userInfoContainer.classList.remove("active");
     //Now we are at user's location weather so , now we need the coordinated if they are are stored in local storage
     getfromSessionStorage();
     }
    }
};

// Here adding event listener on the tabs so that if they are click than they will 
// call the swithTab fucntion for "Switching the tab"

//on user tab
userTab.addEventListener("click",() => {
    //pass clicked tab as input paramter
    switchTab(userTab);});
//on search tab
searchTab.addEventListener("click", () => {
    //pass clicked tab as input paramter
    switchTab(searchTab);
});

//functon to check that if coordinated are already present in session storage
// the point to notice that even calling the function before declaration
//the code will run (HOISTING PROPERTY IN FUNCTION DECLARATION)
function getfromSessionStorage(){
    //trying to fetch the local coordinates
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    //if co-ordinates are not avaliable in local storage then
    if(!localCoordinates){
        //then show the page of grant access functions
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

};

async function fetchUserWeatherInfo(coordinates){
   const {lat,lon}=coordinates;
   //make grant container invisble
   grantAccessContainer.classList.remove("active");
    //and make loader container visible
    loadingScreen.classList.add("active");
  // api call
    
    //fetch api
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    //convert in json
    const data=await response.json();
    //now data is fetched so remove loader
    loadingScreen.classList.remove("active");
    // and now show the userInfoContainer visible
    userInfoContainer.classList.add("active");
    // to show the data take from json and put in UI,functon called
    renderWeatherInfo(data);
    
}


function renderWeatherInfo(weatherInfo){
   //fetch the elements
   const cityName = document.querySelector("[data-cityName]");
   const countryIcon = document.querySelector("[data-countryicon]");
   const desc = document.querySelector("[data-WeatherDesc]");
   const weatherIcon = document.querySelector("[data-weatherIcon]");
   const temp = document.querySelector("[data-temp]");
   const windspeed = document.querySelector("[data-windSpeed]");
   const humidity = document.querySelector("[data-humidity]");
   const cloudiness = document.querySelector("[data-cloudiness]");

  //fetch values from weatherINfo object and put it UI elements
   
  // to this we check the weatherInfo that we got by api call and convert it in Json format and now try to fetch the required data

  cityName.innerText = weatherInfo?.name;//here it will give the name from weatherinfo
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  let kelvinTemperature = parseFloat(weatherInfo?.main?.temp);

// Convert Kelvin to Celsius
  let celsiusTemperature = kelvinTemperature - 273.15;

// Round the temperature to two decimal places
   celsiusTemperature = celsiusTemperature.toFixed(2);

// Update temp.innerText with the Celsius temperature
  temp.innerText = `${celsiusTemperature} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
};

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click",getLocation);


// add a eventListener so that if there is given a city name in search bar then it will fetch the weather data from the function etchSearchWeatherInfo;
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") //if no name is entered then return 
        return;
    else 
        fetchSearchWeatherInfo(cityName);//else call this function
})

//Let's write the function to fetch the weatherr information using the city name
async function fetchSearchWeatherInfo(city){
   
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    
    //fetching the response using this api call
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
}

