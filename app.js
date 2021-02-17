    let long; // longitude 
    let lat; // latitude 
    let temparatureDescription = document.querySelector('.temparature-description');

    const temparatureDescription__text = temparatureDescription.textContent;
    
    let temparatureDegree = document.querySelector('.temparature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    const temparatureSection = document.querySelector('.temparature-wrap');
    const temparatureSpan = document.querySelector('.temparature-wrap span');
    const feelsLike = document.querySelector('.feelsLike');
    const feelsLikeSpan = document.querySelector('.feelsLike-section span');
    const region = document.getElementById('region');
    
    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    const alterProxy = 'https://secret-ocean-49799.herokuapp.com/'
    let myRegion = '';

    // commons 
function setIcons(main, iconID) {
    const skycons = new Skycons({ 
        color: "white"
    });

    const currentIcon = main.toUpperCase();
        
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon])
}

function getApi(api, alterProxy) { 
    fetch(api)
    .then(response => {
        return response.json();
    })
    .then(data => {
        const { temp, feels_like } = data.main;
        
        const {description} = data.weather[0];
        let {main} = data.weather[0]
        const {country} = data.sys;

        // main atmosphere filtering
        const atmosphere = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'];
        const matched = atmosphere.includes(main);
        if(matched) {
            main = atmosphere[4];
        }
        
        // Set DOM ELements from the API
        const temFixed = Number((temp).toFixed(1));
        let feelsLikeTem = Number((feels_like).toFixed(1));
        temparatureDegree.textContent = temFixed;
        feelsLike.textContent = feelsLikeTem;
        temparatureDescription.textContent = description;
        locationTimezone.textContent = `${data.name.toUpperCase()} / ${country}`;

        // FORMULA FOR CELCIUS
        let fahrenheit = Number(((temp * 1.8) + 32).toFixed(1));
        let feelsLikeFahrenheit = Number(((feels_like * 1.8) + 32).toFixed(1));
        
        // Set Icon
        setIcons(main, document.querySelector('.icon'))

        // Change temparature to Celsius/Fahrenheit
        temparatureSection.addEventListener('click', () => {
            if(temparatureSpan.textContent === "C") {
                temparatureSpan.textContent = "F";
                temparatureDegree.textContent = fahrenheit;
                feelsLikeSpan.textContent = "F";
                feelsLike.textContent = feelsLikeFahrenheit;
            } else {
                temparatureSpan.textContent = "C";
                temparatureDegree.textContent = temFixed;
                feelsLikeSpan.textContent = "C";
                feelsLike.textContent = feelsLikeTem;
            }
        });

        // Unsplash api scope
        const currentTheme = description.split(' ').join();
        const unsplash_api = `${alterProxy}https://api.unsplash.com/search/photos?query=${currentTheme},weather&client_id=-vvPx1nl3XaoE4pYMYBz4VcEZVsJuxjLvtKNUk-Kjvs`;

        fetch(unsplash_api)
            .then(unsplash_response => {
                return unsplash_response.json();
            })
            .then(data => {
                const {urls} = data.results[0];
                const full = urls.full;

                // set the background iamge
                const bgImage = document.body.style;
                bgImage.backgroundImage = `url(${full})`;
                bgImage.backgroundRepeat = "no-repeat";
                bgImage.backgroundSize = "cover";
                
            });
        region.value = '';
    }).catch(err => { 
        h1.textContent = 'sorry!'
    })
}

function getLocation(location, alterProxy) { 
    location.getCurrentPosition(position => { 
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const api = `${alterProxy}https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=4bc4f6d6639c0b4294d6e1eb992b6382&units={metric}`

        getApi(api, alterProxy)
    })

}

function yearCount() { 
    const year = new Date().getFullYear();
    const thisYear = document.querySelector('.this-year');
    thisYear.innerHTML = year;
}

window.addEventListener('load', () => {
    if (myRegion.length > 0) { 
        region.value = '';
    }
    const location = navigator.geolocation;
    if (location) {
        getLocation(location, alterProxy);
    } else { 
        h1.textContent = "🌐 Sorry, Geolocation is not supported by this browser";
    }
    yearCount();    
});

region.onchange = (e) => { 
    myRegion = e.target.value.trim();
    
    if (myRegion) {
        const api = `${alterProxy}https://api.openweathermap.org/data/2.5/weather?q=${myRegion}&units=metric&appid=4bc4f6d6639c0b4294d6e1eb992b6382`;
        getApi(api, alterProxy);
    } else { 
         h1.textContent = "Sorry, Region infomation is not valid!"
    }
}
