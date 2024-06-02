console.log("Hello World");

// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
const API_KEY = "44698f57859ce1a84bfc121b1a89f6ba";


function renderWeatherInfo(data){
    
    let newPara = document.createElement('p');
    newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`
    
     document.body.appendChild(newPara);
}

async function fetchWeatherDetails() {
    // let latitude = 15.3333;
    // let longitude = 74.0833;

    try{
        let city = "goa";

        const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
        const data = await response.json();
        console.log("Weather data:->" , data);
    
        renderWeatherInfo(data);
    }

    catch(err)
    {
        //Handle error
    }
   
}

async function getCustomWeatherDetails() {
    try{
        let latitude = 17.633;
        let longitude = 18.333;
    
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    
        let data = await result.json();
    
        console.log(data);

        renderWeatherInfo(data);

    }

    catch(err){
        console.log("Error Found" + err);
    }
}


function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);  
    }
    else{
        console.log("No Geolocation Support");
    }
}

function showPosition(position) 
    {
    let lat = position.coords.latitude;
    let longi = position.coords.longitude;

    console.log(lat);
    console.log(longi);
}