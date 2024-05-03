document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.querySelector(".city-input");
  const searchButton = document.querySelector(".search-btn");
  const locationButton = document.querySelector(".location-btn");
  const currentAqiDiv = document.querySelector(".current-aqi");

  const API_KEY = 'fcb1847ffa6305fa9a90b5deb873a71c';

  const displayAqiData = (data, cityName) => {
    const aqiDetailsHtml = `
      <div class="details">
        <h2>${cityName}</h2>
        <h6>AQI: ${data.list[0].main.aqi}</h6>
        <h6>PM2.5: ${data.list[0].components.pm2_5} µg/m³</h6>
        <h6>PM10: ${data.list[0].components.pm10} µg/m³</h6>
      </div>
    `;
    currentAqiDiv.innerHTML = aqiDetailsHtml;
  };

  const getAqiData = (latitude, longitude, cityName) => {
    const AQI_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(AQI_URL)
      .then(response => response.json())
      .then(data => {
        displayAqiData(data, cityName);
      })
      .catch(error => {
        console.error('Error fetching AQI data:', error);
      });
  };

  const getCityCoordinates = (cityName) => {
    const GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_URL)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          getAqiData(lat, lon, cityName);
        } else {
          alert('City not found!');
        }
      })
      .catch(error => {
        console.error('Error fetching city coordinates:', error);
      });
  };

  searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
      getCityCoordinates(cityName);
    }
  });

  cityInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && cityInput.value.trim()) {
      getCityCoordinates(cityInput.value.trim());
    }
  });

  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const cityName = 'Your Location'; // Placeholder for the geolocation case
        getAqiData(position.coords.latitude, position.coords.longitude, cityName);
      }, () => {
        alert('Unable to retrieve your location.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });
});
