const usertab = document.querySelector("[data-userweather]");
const searchtab = document.querySelector("[data-searchweather]");
const usercontainer = document.querySelector(".weather-container");

const grantAccesscontainer = document.querySelector(".grant-location-container");
const searchform = document.querySelector("[data-searchform]");
const loadingscreen = document.querySelector(".loading-container");
const userinfocontainer = document.querySelector(".user-info-container");
const err = document.querySelector(".error");
const change = document.querySelector(".wrapper");

//initaila variables
getsavedlocalcoordinates();

let currenttab = usertab;
const API_KEY = "278bb0b5a78dca31ab6f71d53aeb4b9b";
currenttab.classList.add("current-tab");
err.classList.remove("active");


//user tab is bASically your_location tab
usertab.addEventListener("click", () => {
    //pass clicked tab as input
    switchtab(usertab);
    change.classList.remove("clouds");
    change.classList.remove("clear");
    change.classList.remove("snow");
    change.classList.remove("rain");
    change.classList.remove("fog");
    change.classList.remove("mist");
    change.classList.remove("storm");
    change.classList.remove("haze");
    change.classList.remove("few");
});

searchtab.addEventListener("click", () => {
    //pass clicked tab as input
    switchtab(searchtab);
    change.classList.remove("clouds");
    change.classList.remove("clear");
    change.classList.remove("snow");
    change.classList.remove("rain");
    change.classList.remove("fog");
    change.classList.remove("mist");
    change.classList.remove("storm");
    change.classList.remove("haze");
    change.classList.remove("few");
});


function switchtab(clickedtab) {

    //jis tab pr h usi pr click krdiya tb to kuch nhi hona cxhahiye
    if (clickedtab != currenttab) {
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        currenttab.classList.add("current-tab");

        if (!searchform.classList.contains("active")) {
            //it means search tab wala section info invisible hai usko visible kro
            userinfocontainer.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else {
            //me pehle search wale tab pr tha ab your locaion wale tab pr aaya hu
            searchform.classList.remove("active");
            userinfocontainer.classList.remove("active");
            //this function isto get user/your location coordinates
            getsavedlocalcoordinates();//storage me jo save h

        }

    }

}

function getsavedlocalcoordinates() {//getfromsessionstrogae fucntion h hye
    const usercoordinates = sessionStorage.getItem("user-coordinates");
    if (!usercoordinates) {//agr usercordinates present nhi h to grant location wala page show kro
        grantAccesscontainer.classList.add("active");

    }
    else {
        const coordinates = JSON.parse(usercoordinates); //json string ko object me convert krdega
        fetchuserweatherinfo(coordinates);
    }
}

async function fetchuserweatherinfo(coordinates) {
    const { latitude: lat, longitude: lon } = coordinates;
    //make grantlocation page invisible
    grantAccesscontainer.classList.remove("active");
    //make loader visible
    loadingscreen.classList.add("active");

    //call api

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        //remove loader
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.add("active");//ye khali visible krayega data
        //now make fucntion which puts/input data into userinfoconatainer
        renderweatherinfo(data);

    }
    catch (err) {
        loadingscreen.classList.remove('active');
        
        //alert("ERROR:404");
    }


}

//-----------------------------------------important------------------------------------------------------
//funtion which put data into the ui
//data parameter carries all information about the weather
//data?.main?.temp; //for getting information from data obeject
function renderweatherinfo(data) {
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-countryicon]");
    const description = document.querySelector("[data-weatherdesc]");
    const weathericon = document.querySelector("[data-weathericon]");
    const temperature = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloudiness]");
    const sun = document.querySelector("[data-sunrise]");
    const sunsettime = document.querySelector("[data-sunset]");
    const pressuree = document.querySelector("[data-pressure]");

    //fetch values from weatherinfo object and put it into ui elements
    cityname.innerText = data?.name;
    countryicon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    description.innerText = data?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${data?.weather?.[0].icon}.png`;
    temperature.innerText = `${data?.main?.temp}°C`;
    windspeed.innerText = `${data?.wind?.speed}m/s`;
    humidity.innerText = `${data?.main?.humidity}%`;
    cloud.innerText = `${data?.clouds?.all}%`;
    sun.innerText = timeconversion(`${data?.sys?.sunrise}`);
    sunsettime.innerText = timeconversion(`${data?.sys?.sunset}`);
    pressuree.innerText = `${data?.main?.pressure}hpa`;
    changebackground(data?.weather?.[0]?.description);
}

const grantaccessbtn = document.querySelector("[data-grantaccess]");
grantaccessbtn.addEventListener("click", getuserlocation);

function getuserlocation() {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(showposition);
    else {
        alert("Can,t Find your location");
    }
}
function showposition(position) {

    const yourlocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,

    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(yourlocation));//it stores ur coordinates into system with name usercoordinates
    fetchuserweatherinfo(yourlocation);//ui pr ye function show krega info ko
}

const searchbarinputvalue = document.querySelector("[datasearchinput]");
searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let citykaname = searchbarinputvalue.value;
    if (citykaname === "") return;
    else fetchsearchweatherinfo(citykaname);

})
//search bar me jo input city ko uski weahter info nikalega
async function fetchsearchweatherinfo(city) {
    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (response.ok) {
            //jese hi response aagya remove loader
            loadingscreen.classList.remove("active");
            //info dikhane k liye isko call kiya h
            userinfocontainer.classList.add("active");
            err.classList.remove("active");
            searchbarinputvalue.value = '';
            renderweatherinfo(data);
        }
        else {
            searchbarinputvalue.value = '';
            loadingscreen.classList.remove("active");
            change.classList.remove("clouds");
            change.classList.remove("clear");
            change.classList.remove("snow");
            change.classList.remove("rain");
            change.classList.remove("fog");
            change.classList.remove("mist");
            change.classList.remove("storm");
            err.classList.add("active");
        }

    }
    catch (err) {
        loadingscreen.classList.remove("active");
        userinfocontainer.classList.remove("active");
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        err.classList.add("active");
        
    }
}

function timeconversion(value) {
    let unix_timestamp = value;
    var date = new Date(unix_timestamp * 1000).toLocaleTimeString();
    return date;
}

function changebackground(value) {
    if (value.includes("clouds") && (value.includes("scattered") || value.includes("overcast"))) {
        change.classList.add("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.remove("few");



        // document.body.wrapper.style.backgroundImage="url(./images/clear-sky-with-clouds.jpg)"
        // document.body.wrapper.style.zIndex = "-1";
        //change.style.backgroundImage=`url("https://images.app.goo.gl/DGSrzWyqjzCoApTp8")`;
    }
    else if (value.includes("mist") || value.includes("smoke")) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.add("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.remove("few");
        // document.body.wrapper.style.backgroundImage="url('')"
    }
    else if (value.includes("rain")) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.add("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.remove("few");
    }
    else if (value.includes("fog")) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.add("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.remove("few");
    }
    else if (value.includes("clear")) {
        change.classList.remove("clouds");
        change.classList.add("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.remove("few");
    }
    else if (value.includes("snow")) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.add("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.remove("few");
    }
    else if (value.includes("storm") || value.includes("thunderstorm") || value.includes("lightening")) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.add("storm");
        change.classList.remove("haze");
        change.classList.remove("few");
    }
    else if (value.includes("haze")) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.add("haze");
        change.classList.remove("few");

    }
    else if ((value.includes("few") && value.includes("clouds")) || (value.includes("broken") && value.includes("clouds"))) {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
        change.classList.remove("haze");
        change.classList.add("few");
    }
    else {
        change.classList.remove("clouds");
        change.classList.remove("clear");
        change.classList.remove("snow");
        change.classList.remove("rain");
        change.classList.remove("fog");
        change.classList.remove("mist");
        change.classList.remove("storm");
    }
}









