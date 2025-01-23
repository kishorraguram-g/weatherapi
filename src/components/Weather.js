import React, { useState } from "react";
import "./Weather.css";
import { FaSearch } from "react-icons/fa";
import clear_icon from "../assets/clear.jpg";
import cloud_icon from "../assets/cloud.jpg";
import drizzle_icon from "../assets/drizzle.jpg";
import rain_icon from "../assets/rain.jpg";

const Weather = () => {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [previousSearches, setPreviousSearches] = useState([]);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C"); // 'C' for Celsius, 'F' for Fahrenheit

  const handleSearch = async () => {
    if (!search.trim()) return;

    const API_URL = `http://api.weatherapi.com/v1/current.json?key=ce25608afb2848baa8f11206243001&q=${search}`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setWeather(null);
      } else {
        setWeather(data);
        setError("");

        setPreviousSearches((prev) => {
          const newSearch = {
            city: data.location.name,
            temp: data.current.temp_c,
            condition: data.current.condition.text,
          };
          return [newSearch, ...prev.filter((item) => item.city !== newSearch.city)];
        });
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setWeather(null);
    }

    setSearch(""); // Clear input field after search
  };

  // Convert Celsius to Fahrenheit
  const convertToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("clear")) return clear_icon;
    if (conditionLower.includes("cloud")) return cloud_icon;
    if (conditionLower.includes("drizzle")) return drizzle_icon;
    if (conditionLower.includes("rain")) return rain_icon;
    
    return clear_icon; // Default to clear weather
  };

  return (
    <div className="weather">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a city"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FaSearch onClick={handleSearch} />
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Weather Information */}
      {weather && (
        <div>
          <img
            src={getWeatherIcon(weather.current.condition.text)}
            alt="Weather Icon"
            className="weather-icon"
          />
          <p>{unit === "C" ? weather.current.temp_c : convertToFahrenheit(weather.current.temp_c)}°{unit}</p>
          <p>{weather.location.name}</p>

          <div className="weather-data">
            <div className="col">
              <p>{weather.current.humidity}%</p>
              <span>Humidity</span>
            </div>
            <div className="col">
              <p>{weather.current.wind_kph} km/h</p>
              <span>Wind Speed</span>
            </div>
          </div>

          {/* Toggle for Celsius / Fahrenheit */}
          <button className="change-to-farenheit" onClick={() => setUnit(unit === "C" ? "F" : "C")}>
            Switch to {unit === "C" ? "°F" : "°C"}
          </button>
        </div>
      )}

      {/* Previous Searches */}
      {previousSearches.length > 0 && (
        <div className="previous-searches">
          <h3>Previous Searches</h3>
          <ul>
            {previousSearches.map((item, index) => (
              <li key={index}>
                <span>{item.city}</span>
                <span>{unit === "C" ? item.temp : convertToFahrenheit(item.temp)}°{unit}</span>
                <span>{item.condition}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather;
