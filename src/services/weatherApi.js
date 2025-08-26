import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast"

export const getWeatherByCoordinates = async (lat, lon) => {
	try {
		const response = await axios.get(BASE_URL, {
			params: {
				latitude: lat,
				longitude: lon,
				current_weather: true,
			}
		})
		return response.data;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		throw error;
	}
}