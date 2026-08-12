/* ==================================================
   PREMIUM DIGITAL CLOCK + LIVE LOCATION + WEATHER
================================================== */


/* ==================================================
   ELEMENTS
================================================== */

const hour = document.getElementById("hour");
const minute = document.getElementById("minute");
const second = document.getElementById("second");

const date = document.getElementById("date");
const day = document.getElementById("day");

const greeting =
    document.querySelector(".left-panel h3");

const weatherIcon =
    document.getElementById("weatherIcon");

const locationText =
    document.getElementById("location");

const weatherText =
    document.getElementById("weather");

const humidityText =
    document.getElementById("humidity");

const windText =
    document.getElementById("wind");

const timezoneText =
    document.getElementById("timezone");

const weatherSmallIcon =
    document.getElementById("weatherSmallIcon");


/* ==================================================
   DAYS
================================================== */

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];


/* ==================================================
   MONTHS
================================================== */

const months = [
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


/* ==================================================
   LIVE CLOCK
================================================== */

function updateClock() {

    const now = new Date();

    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();


    /* Time */

    hour.textContent =
        String(h).padStart(2, "0");

    minute.textContent =
        String(m).padStart(2, "0");

    second.textContent =
        String(s).padStart(2, "0");


    /* Date */

    date.textContent =
        `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;


    /* Day */

    day.textContent =
        days[now.getDay()];


    /* Greeting */

    if (h < 12) {

        greeting.textContent =
            "Good Morning";

        weatherIcon.textContent =
            "☀️";

    }

    else if (h < 17) {

        greeting.textContent =
            "Good Afternoon";

        weatherIcon.textContent =
            "🌤️";

    }

    else if (h < 20) {

        greeting.textContent =
            "Good Evening";

        weatherIcon.textContent =
            "🌇";

    }

    else {

        greeting.textContent =
            "Good Night";

        weatherIcon.textContent =
            "🌙";
    }
}


/* Start clock */

updateClock();

setInterval(
    updateClock,
    1000
);



/* ==================================================
   WEATHER CONDITION
================================================== */

function getWeatherInfo(code) {


    /* Clear sky */

    if (code === 0) {

        return {
            icon: "☀️",
            text: "Clear Sky",
            fa: "fa-sun"
        };
    }


    /* Mainly clear / partly cloudy */

    if (
        code === 1 ||
        code === 2
    ) {

        return {
            icon: "🌤️",
            text: "Partly Cloudy",
            fa: "fa-cloud-sun"
        };
    }


    /* Overcast */

    if (code === 3) {

        return {
            icon: "☁️",
            text: "Cloudy",
            fa: "fa-cloud"
        };
    }


    /* Fog */

    if (
        code === 45 ||
        code === 48
    ) {

        return {
            icon: "🌫️",
            text: "Foggy",
            fa: "fa-smog"
        };
    }


    /* Drizzle */

    if (
        code >= 51 &&
        code <= 57
    ) {

        return {
            icon: "🌦️",
            text: "Drizzle",
            fa: "fa-cloud-rain"
        };
    }


    /* Rain */

    if (
        code >= 61 &&
        code <= 67
    ) {

        return {
            icon: "🌧️",
            text: "Rain",
            fa: "fa-cloud-showers-heavy"
        };
    }


    /* Snow */

    if (
        code >= 71 &&
        code <= 77
    ) {

        return {
            icon: "❄️",
            text: "Snow",
            fa: "fa-snowflake"
        };
    }


    /* Rain showers */

    if (
        code >= 80 &&
        code <= 82
    ) {

        return {
            icon: "🌦️",
            text: "Rain Showers",
            fa: "fa-cloud-rain"
        };
    }


    /* Thunderstorm */

    if (
        code >= 95 &&
        code <= 99
    ) {

        return {
            icon: "⛈️",
            text: "Thunderstorm",
            fa: "fa-cloud-bolt"
        };
    }


    /* Default */

    return {
        icon: "🌤️",
        text: "Unknown",
        fa: "fa-cloud"
    };
}



/* ==================================================
   WEATHER API
   OPEN-METEO
   NO API KEY REQUIRED
================================================== */

async function getWeather(
    latitude,
    longitude
) {

    try {

        weatherText.textContent =
            "Loading...";

        humidityText.textContent =
            "Loading...";

        windText.textContent =
            "Loading...";


        /* API URL */

        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${latitude}` +
            `&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&timezone=auto`;


        /* Fetch */

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather API failed"
            );
        }


        /* JSON */

        const data =
            await response.json();


        const current =
            data.current;


        /* Weather condition */

        const weatherInfo =
            getWeatherInfo(
                current.weather_code
            );


        /* Temperature */

        weatherText.textContent =
            `${Math.round(current.temperature_2m)}°C • ${weatherInfo.text}`;


        /* Humidity */

        humidityText.textContent =
            `${current.relative_humidity_2m}%`;


        /* Wind */

        windText.textContent =
            `${current.wind_speed_10m} km/h`;


        /* Main icon */

        weatherIcon.textContent =
            weatherInfo.icon;


        /* Bottom icon */

        weatherSmallIcon.className =
            `fa-solid ${weatherInfo.fa}`;


        /* Timezone */

        timezoneText.textContent =
            data.timezone;


    }

    catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        weatherText.textContent =
            "Weather unavailable";

        humidityText.textContent =
            "--";

        windText.textContent =
            "--";
    }
}



/* ==================================================
   REVERSE GEOCODING
   GET CITY FROM GPS COORDINATES
================================================== */

async function getCityName(
    latitude,
    longitude
) {

    try {

        locationText.textContent =
            "Detecting...";


        /*
           Nominatim Reverse Geocoding
        */

        const url =
            `https://nominatim.openstreetmap.org/reverse` +
            `?format=json` +
            `&lat=${latitude}` +
            `&lon=${longitude}` +
            `&zoom=10` +
            `&addressdetails=1`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Location API failed"
            );
        }


        const data =
            await response.json();


        const address =
            data.address || {};


        /*
           City priority
        */

        let city =
            address.city ||
            address.town ||
            address.municipality ||
            address.village ||
            address.county ||
            "";


        /*
           Haveli → Pune

           कारण Pune area मध्ये
           काही coordinates वर
           Haveli return होऊ शकते.
        */

        if (
            city &&
            city
                .toLowerCase()
                .includes("haveli")
        ) {

            city = "Pune";
        }


        /*
           जर city मिळाली नाही
        */

        if (!city) {

            city =
                address.state_district ||
                address.state ||
                "India";
        }


        /*
           Display city
        */

        locationText.textContent =
            city;


        return city;


    }

    catch (error) {

        console.error(
            "City Detection Error:",
            error
        );


        return null;
    }
}



/* ==================================================
   LIVE LOCATION TRACKING
================================================== */


/*
   Previous coordinates

   छोट्या GPS movements वर
   API पुन्हा call होऊ नये
*/

let lastLatitude = null;
let lastLongitude = null;


/*
   Watch ID

   नंतर location tracking
   बंद करायचं असल्यास उपयोगी
*/

let watchId = null;


function startLiveLocation() {


    /* Browser GPS support */

    if (!navigator.geolocation) {

        locationText.textContent =
            "GPS not supported";

        /*
           Default Pune weather
        */

        getWeather(
            18.5204,
            73.8567
        );

        timezoneText.textContent =
            "Asia/Kolkata";

        return;
    }


    locationText.textContent =
        "Detecting...";


    /*
       WATCH POSITION

       Location बदलली की
       browser नवीन coordinates देईल.
    */

    watchId =
        navigator.geolocation.watchPosition(


            /* ======================================
               SUCCESS
            ====================================== */

            async function(position) {


                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;


                console.log(
                    "Current Latitude:",
                    latitude
                );


                console.log(
                    "Current Longitude:",
                    longitude
                );


                /*
                   First location
                   किंवा significant movement
                */

                if (
                    lastLatitude !== null &&
                    lastLongitude !== null
                ) {


                    const latDifference =
                        Math.abs(
                            latitude -
                            lastLatitude
                        );


                    const lonDifference =
                        Math.abs(
                            longitude -
                            lastLongitude
                        );


                    /*
                       Very small movement
                       ignore करा
                    */

                    if (
                        latDifference < 0.002 &&
                        lonDifference < 0.002
                    ) {

                        return;
                    }
                }


                /*
                   Save new coordinates
                */

                lastLatitude =
                    latitude;

                lastLongitude =
                    longitude;


                /*
                   Get City
                */

                const city =
                    await getCityName(
                        latitude,
                        longitude
                    );


                /*
                   Get Weather
                */

                await getWeather(
                    latitude,
                    longitude
                );


                /*
                   Debug
                */

                console.log(
                    "Current City:",
                    city
                );

            },


            /* ======================================
               ERROR
            ====================================== */

            function(error) {


                console.error(
                    "GPS Error:",
                    error
                );


                /*
                   Don't use
                   "Location unavailable"

                   Instead show useful message.
                */

                if (
                    error.code ===
                    error.PERMISSION_DENIED
                ) {

                    locationText.textContent =
                        "Allow Location";

                }

                else if (
                    error.code ===
                    error.POSITION_UNAVAILABLE
                ) {

                    locationText.textContent =
                        "GPS unavailable";

                }

                else if (
                    error.code ===
                    error.TIMEOUT
                ) {

                    locationText.textContent =
                        "Locating...";

                }

                else {

                    locationText.textContent =
                        "Locating...";
                }


                /*
                   Default Pune weather
                   only when GPS fails
                */

                getWeather(
                    18.5204,
                    73.8567
                );

                timezoneText.textContent =
                    "Asia/Kolkata";
            },


            /* ======================================
               OPTIONS
            ====================================== */

            {

                /*
                   GPS अधिक accurate
                */

                enableHighAccuracy: true,


                /*
                   Maximum time to wait
                */

                timeout: 15000,


                /*
                   30 sec old location चालेल
                */

                maximumAge: 30000
            }
        );
}



/* ==================================================
   START APPLICATION
================================================== */

startLiveLocation();