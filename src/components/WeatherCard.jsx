import React from "react";
import { getWeatherDescription } from "../utils/weatherCodes";

const WeatherCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-6 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-6 w-full max-w-md text-center">
      {/* City + Country */}
      <h2 className="text-2xl font-bold mb-2">
        {data.city}, {data.country}
      </h2>

      {/* Temperature */}
      <p className="text-4xl font-extrabold mb-4">{data.temperature}°C</p>

      {/* Extra Weather Info */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-100">
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="font-semibold">🌬 Wind</p>
          <p>{data.windspeed} km/h</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="font-semibold">☀️ Sunrise</p>
          <p>
            {data.sunrise
              ? new Date(data.sunrise).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--"}
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="font-semibold">🌇 Sunset</p>
          <p>
            {data.sunset
              ? new Date(data.sunset).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--"}
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="font-semibold">🌦 Condition</p>
          <p>{getWeatherDescription(data.weathercode)}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
