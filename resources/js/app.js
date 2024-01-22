const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const openweathermapKey = "5e1df15d1ca6979db5d1e2028ddf3643";

//const url2 = "https://api.open-meteo.com/v1/forecast?latitude=51.41326&longitude=4.20546&hourly=wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_direction_10m,wind_direction_80m,wind_direction_120m&forecast_days=1&models=ecmwf_ifs04"


form.addEventListener("submit", addLocation);



function addLocation(event) {
    event.preventDefault();

    //Input pprocess
    const inputVal = input.value.toLowerCase().replace(" ", "").replace("uk", "gb");

    //Get tile list
    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);

    //handle duplicate location
    if (listItemsArray.length > 0) {
        const filteredArray = listItemsArray.filter(el => {
            let content = "";

            if (inputVal.includes(",")) {
                //athens,grrrrrr->invalid country code, so we keep only the first part of inputVal 
                if (inputVal.split(",")[1].length > 5) {
                    inputVal = inputVal.split(",")[0];
                    content = el.querySelector(".city-name span").textContent.toLowerCase();
                } else {
                    content = el.querySelector(".city-name").dataset.name.toLowerCase();
                }
            } else {
                //athens 
                content = el.querySelector(".city-name span").textContent.toLowerCase();
            }
            return content == inputVal.toLowerCase();
        });
        //3 
        if (filteredArray.length > 0) {
            msg.textContent = `You already know the weather for ${filteredArray[0].querySelector(".city-name span").textContent
                } ...otherwise be more specific by providing the country code as well`;
            form.reset();
            input.focus();
            return;
        }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${openweathermapKey}&units=metric`;

    locationMarkup(url);
}

function removeLocation(event) {

}

function locationMarkup(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather, wind } = data;
            if (wind.gust == null) wind.gust = wind.speed;
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
            const li = document.createElement("li");
            li.classList.add("cityli");
            const markup = `
        <h1 class='close-container'><button class="close-button">X</button></h1>
        <div class='city'>
            <div class="city-grid">
                <h2 class="city-name" data-name="${name},${sys.country}"> 
                    <span>${name}</span> 
                    <sup>${sys.country}</sup> 
                </h2> 
                <div class="city-temp">${Math.round(main.temp)}<sup>&deg;C</sup> 
                </div>
                <figure> 
                    <img class="city-icon" src=${icon} alt=${weather[0]["main"]}> 
                    <figcaption>${weather[0]["description"]}</figcaption> 
                </figure>
            </div>
            <div class="city-grid">
                <div class="city-wind">${(wind.speed * 0.868976).toFixed(2)}<sup>kts</sup> 
                </div>
                <div class="city-wind city-gust">${(wind.gust * 0.868976).toFixed(2)}<sup>kts</sup> 
                </div>
                <div class="city-arrow" style="transform: rotate(${wind.deg - 180}deg);">&uarr;
                </div>
            </div>
        </div>
        `;
            li.innerHTML = markup;
            list.appendChild(li);
        })
        .catch(() => {
            msg.textContent = "Please search for a valid city!";
        });

    msg.textContent = "";
    form.reset();
    input.focus();
}