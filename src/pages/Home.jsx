import React, { useState } from "react";
import SearchBox from "../components/SearchBox";
import WeatherCard from "../components/WeatherCard";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Home = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 City name se geocoding + weather fetch
  const fetchWeather = async (city) => {
    try {
      setLoading(true);
      setError("");

      // 1️ Geocoding API
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found!");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // 2️⃣ Weather API
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m`
      );
      const weatherJson = await weatherRes.json();

      const weather = {
        city: cleanName,
        country,
        temperature: weatherJson.current_weather.temperature,
        windspeed: weatherJson.current_weather.windspeed,
        weathercode: weatherJson.current_weather.weathercode,
        sunrise: weatherJson.daily.sunrise[0],
        sunset: weatherJson.daily.sunset[0],
      };

      const daily = weatherJson.daily.time.map((date, idx) => ({
        date,
        min: weatherJson.daily.temperature_2m_min[idx],
        max: weatherJson.daily.temperature_2m_max[idx],
        sunrise: weatherJson.daily.sunrise[idx],
        sunset: weatherJson.daily.sunset[idx],
      }));

      const hourly = weatherJson.hourly.time
        .slice(0, 12)
        .map((time, idx) => ({
          time: new Date(time).getHours() + ":00",
          temp: weatherJson.hourly.temperature_2m[idx],
        }));

      setWeatherData(weather);
      setDailyForecast(daily);
      setHourlyForecast(hourly);
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="px-4 py-6 flex flex-col items-center w-full max-w-6xl mx-auto"
    >
      {/* 🔹 Search box */}
      <div className="w-full max-w-md">
        <SearchBox onSearch={fetchWeather} />
      </div>

      {/* 🔹 Loading state */}
      {loading && <p className="mt-4 text-blue-500">Loading...</p>}

      {/* 🔹 Error */}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* 🔹 Weather data card */}
      <div className="w-full max-w-md mt-6">
        {weatherData && <WeatherCard data={weatherData} />}
      </div>

      {/* 🔹 Daily Forecast */}
      {dailyForecast.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-3 text-center sm:text-left">
            5-Day Forecast
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {dailyForecast.slice(0, 5).map((day, idx) => (
              <div
                key={idx}
                className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center shadow-md"
              >
                <p className="font-medium">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </p>
                <p className="text-sm">
                  {day.min}°C / <b>{day.max}°C</b>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Hourly Forecast Chart */}
      {hourlyForecast.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-lg font-semibold mb-3 text-center sm:text-left">
            Next 12 Hours
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyForecast}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="temp" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.main>
  );
};

export default Home;
