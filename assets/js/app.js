    let long; // longitude 
    let lat; // latitude 
    let temparatureDescription = document.querySelector('.temparature-description');

    const temparatureDescription__text = temparatureDescription.textContent;
    
    let temparatureDegree = document.querySelector('.temparature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    const temparatureSection = document.querySelector('.temparature-wrap');
    const temparatureSpan = document.querySelector('.temparature-wrap span');
    const feelsLike = document.querySelector('.feelsLike');
    const feelsLikeSpan = document.querySelector('.feelsLike-section .unit');
    const region = document.getElementById('region');
    
    // Temperatre related
    let currentTemp, currentFeelsLike, temFixed, feelsLikeTem;

    // const proxy = 'https://cors-anywhere.herokuapp.com/';
    const alterProxy = 'https://secret-ocean-49799.herokuapp.com/'
    let myRegion = '';

    // Notification 
    const notiBar = document.querySelector('.notification-bar');
    const notiTxt = document.querySelector('.notification-bar .content-text');
    const closeIcon = document.querySelector('.notification-bar .content-close');

const notice = {
    loading: { text: '🌐 Please wait..', color: '#f7f1e3' },
    update: { text: '👀 Weather Information is updated!', color: '#33d9b2'},
    geoFail: { text: '🌐 Sorry, Geolocation is not supported by this browser', color: '#ff5252' },
    regionFail: { text: '🌐 Sorry, Region infomation is not valid!', color: '#ff5252'
    },
    fail: { text: '😥 Sorry, Something is wrong! Try Again', color: '#ff5252' }
    }

function noticeState(notice) { 
    notiTxt.textContent = notice.text;
    notiBar.style.backgroundColor = notice.color;
    if (notiBar.classList.contains('isClosed')) {
        notiBar.classList.remove('isClosed')
        setTimeout(() => {
            notiBar.classList.add('isClosed')
        }, 3000)
    } else { 
        setTimeout(() => { 
            notiBar.classList.add('isClosed')
        }, 3000)
    }

}


function setIcons(main, iconID) {
    const skycons = new Skycons({ 
        color: "white"
    });

    const currentIcon = main.toUpperCase();
        
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon])
}

function toggleTemp(temp, feels_like, temFixed, feelsLikeTem) { 
    // FORMULA FOR CELCIUS
    let fahrenheit = Number(((temp * 1.8) + 32).toFixed(1));
    let feelsLikeFahrenheit = Number(((feels_like * 1.8) + 32).toFixed(1));
    
    // Change temparature to Celsius/Fahrenheit
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
    
}


function getApi(api, alterProxy) { 
    fetch(api)
    .then(response => {
        return response.json();
    })
    .then(data => {
        const { temp, feels_like } = data.main;
        currentTemp = temp;
        currentFeelsLike = feels_like
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
        temFixed = Number((temp).toFixed(1));
        feelsLikeTem = Number((feels_like).toFixed(1));
        temparatureDegree.textContent = temFixed;
        feelsLike.textContent = feelsLikeTem;
        temparatureDescription.textContent = description;
        locationTimezone.textContent = `${data.name.toUpperCase()} / ${country}`;

        
        // Set Icon
        setIcons(main, document.querySelector('.icon'))

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
            }).then(() => {
                noticeState(notice.update);
            })
        region.value = '';
    }).catch(err => { 
        noticeState(notice.fail);
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

        noticeState(notice.loading)
    } else {
        noticeState(notice.geoFail);
    }
    yearCount();
});

region.onchange = (e) => { 
    myRegion = e.target.value.trim();
    
    if (myRegion) {
        const api = `${alterProxy}https://api.openweathermap.org/data/2.5/weather?q=${myRegion}&units=metric&appid=4bc4f6d6639c0b4294d6e1eb992b6382`;
        getApi(api, alterProxy);
    } else { 
         noticeState(notice.regionFail)
    }
}


temparatureSection.addEventListener('click', () => { 
    toggleTemp(currentTemp, currentFeelsLike, temFixed, feelsLikeTem);
}) 

closeIcon.onClick = () => {
    if (notiBar.classList.contains('isClosed')) {
        notiBar.classList.remove('isClosed')
        setTimeout(() => {
            notiBar.classList.add('isClosed')
        }, 3000)
    }
}