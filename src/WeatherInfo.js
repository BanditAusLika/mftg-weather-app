import React from 'react';

const WeatherInfo = ({ weather, forecast, city }) => {
  return (
    <div className="weather-info">
      <h2>Weather for {city}</h2>
      <p>Temperature: {weather.temp_c}°C</p>
      <p>Condition: {weather.condition.text}</p>
      <p>UV Index: {weather.uv}</p>

      <h3>Air Quality:</h3>
      <p>PM2.5: {weather.air_quality.pm2_5.toFixed(2)} µg/m³</p>
      <p>PM10: {weather.air_quality.pm10.toFixed(2)} µg/m³</p>
      <p>CO: {weather.air_quality.co.toFixed(2)} µg/m³</p>

      <h3>5-Day Forecast:</h3>
      <ul className="forecast-list">
        {forecast.map((day, index) => (
          <li key={index}>
            <p>{day.date}</p>
            <p>Condition: {day.day.condition.text}</p>
            <p>Max Temp: {day.day.maxtemp_c}°C</p>
            <p>Min Temp: {day.day.mintemp_c}°C</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(WeatherInfo);
