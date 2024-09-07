import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import WeatherInfo from './WeatherInfo';

function App() {
  const [weather, setWeather] = useState(null); // State for weather data
  const [forecast, setForecast] = useState([]); // State for forecast data
  const [city, setCity] = useState(localStorage.getItem('lastCity') || ''); // Remember the last searched city
  const [loading, setLoading] = useState(false); // State to handle loading indicator
  const [error, setError] = useState(''); // State to handle any errors
  const [currentTime, setCurrentTime] = useState(new Date()); // State for the current time
  const [isCityEmpty, setIsCityEmpty] = useState(!city); // To track if the city input is empty

  const apiKey = '16b65a53578d4f9999a55642240509'; // Your API key for the WeatherAPI

  // Function to fetch weather, air quality, and forecast data from the API
  const fetchWeatherAndForecast = useCallback(async () => {
    if (!city) {
      setError("Please enter a city name"); // Prevent API call if city is empty
      return;
    }

    setLoading(true); // Set loading to true while waiting for the API response
    setError(''); // Clear previous errors before making a new request
    try {
      // Make the API call to fetch weather, air quality, and forecast data
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&aqi=yes`
      );
      const data = await weatherResponse.json(); // Parse the response data

      if (weatherResponse.ok) {
        setWeather(data.current); // Set the current weather data
        setForecast(data.forecast.forecastday); // Set the forecast data
        localStorage.setItem('lastCity', city); // Remember the last searched city
        setIsCityEmpty(false); // City is not empty anymore
      } else {
        setError('Failed to fetch data'); // Handle API errors
        setWeather(null); // Clear weather data if the request fails
      }
    } catch (err) {
      setError('Failed to fetch data'); // Handle network or other errors
      setWeather(null); // Clear weather data in case of failure
    } finally {
      setLoading(false); // Stop the loading indicator after the request completes
    }
  }, [city, apiKey]); // Dependencies: function re-runs when 'city' or 'apiKey' changes

  // Function to handle changes in the input field
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setCity(inputValue); // Update the city state when the user types
    if (!inputValue) {
      // If the input is cleared, reset the state
      setIsCityEmpty(true);
      setWeather(null); // Clear weather data when city input is cleared
      setForecast([]); // Clear forecast data as well
    }
  };

  // Function to handle the search button click
  const handleSearchClick = () => {
    if (city) {
      fetchWeatherAndForecast(); // Fetch weather data when the user clicks 'Search'
    }
  };

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup timer on component unmount
  }, []);

  // Automatically fetch weather data for last searched city when app loads
  useEffect(() => {
    if (city) {
      fetchWeatherAndForecast();
    }
  }, [fetchWeatherAndForecast, city]);

  return (
    <div className={`weather-app ${isCityEmpty ? 'empty' : ''}`}>
      <h1>MFTG Weather App</h1>
      <div className="search">
        <input
          type="text"
          value={city} // The value of the input field is bound to the city state
          onChange={handleInputChange} // Update city state when the user types
          placeholder="Enter city" // Placeholder for the input field
        />
        <button onClick={handleSearchClick}>Search</button> {/* Button to trigger the API call */}
      </div>

      {loading && <div className="loader">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {/* Pass weather, air quality, and forecast data to WeatherInfo component */}
      {weather && (
        <WeatherInfo weather={weather} forecast={forecast} city={city} />
      )}

      {/* Footer with current time and "Created by MFTG" */}
      <footer>
        Created By MFTG 2024 <br />
        {currentTime.toLocaleTimeString()} - {currentTime.toDateString()}
      </footer>
    </div>
  );
}

export default App;
