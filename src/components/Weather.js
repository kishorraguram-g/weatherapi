import React, { useState } from "react";
import "./Weather.css";
import { FaSearch } from "react-icons/fa";

const Weather = () => {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [previousSearches, setPreviousSearches] = useState([]);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");

  const handleSearch = async () => {
    if (!search.trim()) return;

    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.cod !== 200) {
        setError(data.message);
        setWeather(null);
      } else {
        setWeather(data);
        setError("");

        setPreviousSearches((prev) => {
          const newSearch = {
            city: data.name,
            temp: data.main.temp,
            condition: data.weather[0].description,
          };
          return [newSearch, ...prev.filter((item) => item.city !== newSearch.city)];
        });
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setWeather(null);
    }

    setSearch(""); 
  };

  const convertToFahrenheit = (celsius) => {
    return ((celsius * 9) / 5 + 32).toFixed(1);
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
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="Weather Icon"
            className="weather-icon"
          />
          <p>{unit === "C" ? weather.main.temp : convertToFahrenheit(weather.main.temp)}°{unit}</p>
          <p>{weather.name}</p>

          <div className="weather-data">
            <div className="col">
              <p>{weather.main.humidity}%</p>
              <span>Humidity</span>
            </div>
            <div className="col">
              <p>{weather.wind.speed} m/s</p>
              <span>Wind Speed</span>
            </div>
          </div>

          <button className="change-to-farenheit" onClick={() => setUnit(unit === "C" ? "F" : "C")}>
            Switch to {unit === "C" ? "°F" : "°C"}
          </button>
        </div>
      )}


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
