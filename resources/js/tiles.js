const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msg = document.querySelector(".top-banner .msg");
const list = document.querySelector(".ajax-section .cities");

const apiKey = "5e1df15d1ca6979db5d1e2028ddf3643";



form.addEventListener("submit", e => {
    e.preventDefault();
    let input = document.querySelector(".top-banner input");
    const inputVal = input.value.toLowerCase().replace(" ", "").replace("uk", "gb");

    const listItems = list.querySelectorAll(".ajax-section .city");
    const listItemsArray = Array.from(listItems);
    if (listItemsArray.length > 0) {
        console.log(listItemsArray);
        const filteredArray = listItemsArray.filter(el => {
            let content = "";
            //athens,gr 
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

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const { main, name, sys, weather } = data;
            const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
            const li = document.createElement("li");
            li.classList.add("city");
            const markup = ` 
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
});

