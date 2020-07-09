window.addEventListener('load', () => {
    let long; // longitude 
    let lat; // latitude 
    let temparatureDescription = document.querySelector('.temparature-description');
    let temparatureDegree = document.querySelector('.temparature-degree');
    let locationTimezone = document.querySelector('.location-timezone');
    const temparatureSection = document.querySelector('.temparature-wrap');
    const temparatureSpan = document.querySelector('.temparature-wrap span');
    const feelsLike = document.querySelector('.feelsLike');
    const feelsLikeSpan = document.querySelector('.feelsLike-section span');

    if(navigator.geolocation) { // "If this exists, .."
        navigator.geolocation.getCurrentPosition(position => { 
            // we can name whatever we want for "position"
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = 'https://cors-anywhere.herokuapp.com/';
            const api = `${proxy}https://api.openweathermap.org/data/2.5/weather?q=Seoul,KR&units=metric&appid=4bc4f6d6639c0b4294d6e1eb992b6382`;
            
            fetch(api)
                .then(response => { // we can name whatever we want for "response"
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const {temp, feels_like} = data.main;
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
                })
            
        }); 
    } else {
        h1.textContent = "hey this is not working!";
    }

    function setIcons(main, iconID) {
        const skycons = new Skycons({ 
            // Like Creating New library of icons
            color: "white"
        });
        // const currentIcon = main.replace(/-/g, "_") regExp 
        
        const currentIcon = main.toUpperCase();
         
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon])
    }

});