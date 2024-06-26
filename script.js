const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");



let currentTab = userTab;
const API_KEY = "44698f57859ce1a84bfc121b1a89f6ba";
currentTab.classList.add("current-tab");
getfromSessionStorage();


 
function switchTab (newTab){
    if(currentTab != newTab) {
        currentTab.classList.remove("current-tab");
        currentTab = newTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            searchForm.classList.add("active");
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
    }
} 

userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter 
    switchTab(userTab);
});


searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter 
    switchTab(searchTab); 
});


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchWeatherInfo(coordinates);
    }
}


async function fetchWeatherInfo(coordinates){
    const{lat, lon} = coordinates;
    //grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader active
    loadingScreen.classList.add("active");

    //API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        // notFound.classList.add('active');
        // errorImage.style.display = 'none';
        // errorText.innerText = `Error: ${err?.message}`;
        // errorBtn.style.display = 'block';
        // errorBtn.addEventListener("click", fetchWeatherInfo);
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
} 

function getLocation(){
    if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
            //show an alert no geolocation support available
            grantAccessButton.style.display = 'none';
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
     let cityName = searchInput.value;
     
    if(cityName === "")
        {
            return;
        }
        // comsole.log(cityName);
        fetchSearchWeatherInfo(cityName);
         cityName = "";
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(err){
        loadingContainer.classList.remove('active');
        userInfoContainer.classList.remove('active');
        notFound.classList.add('active');
        errorText.innerText = `${err?.message}`;
        errorBtn.style.display = "none"; 
    }
}