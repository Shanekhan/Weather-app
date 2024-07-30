
import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import humidity_icon from '../assets/humidity.png';
import windy_icon from '../assets/windy.png';
import cloudy_icon from '../assets/cloudy.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.jfif';
import snow_icon from '../assets/snow.jfif';

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloudy_icon,
    "02n": cloudy_icon,
    "03d": cloudy_icon,
    "03n": cloudy_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city = 'London') => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=cefe612bcf0d2866aa80dbab07820af2`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log('API Data:', data); // Log the response data

      if (data.weather && data.weather.length > 0) {
        const icon = allIcons[data.weather[0].icon] || clear_icon;
        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp), // Temp is already in Celsius
          location: data.name,
          icon: icon
        });
      } else {
        throw new Error('Unexpected weather data format');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      setError(error.message);
      setWeatherData({}); // Clear weather data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(); 
  }, []);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input ref={inputRef} type="text" placeholder='Search city' />
        <img src={search_icon} alt='Search' onClick={() => search(inputRef.current.value)} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className='error-message'>Error: {error}</p>}
      {!loading && !error && (
        <>
          {weatherData.icon && <img src={weatherData.icon} alt="Weather icon" className='weather-icon' />}
          {weatherData.temperature !== undefined && <p className='temperature'>{weatherData.temperature}°C</p>}
          {weatherData.location && <p className='location'>{weatherData.location}</p>}
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={windy_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.windSpeed} km/hr</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;

