
import axios from 'axios';
import { configDotenv } from 'dotenv';
configDotenv()




export const helloController = async (req, res, next) => {
  try {
    const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
    const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
    const ip = "8.8.8.8"; // Use a test IP address for demonstration. Replace with req.ip for actual use.

    if (!geoapifyApiKey || !openWeatherMapApiKey) {
      throw new Error('API keys are not defined');
    }

    console.log(`Using Geoapify API Key: ${geoapifyApiKey}`);
    console.log(`Using OpenWeatherMap API Key: ${openWeatherMapApiKey}`);
    console.log(`Requesting geolocation for IP: ${ip}`);

    const geoResponse = await axios.get(`https://api.geoapify.com/v1/ipinfo?apiKey=${geoapifyApiKey}&ip=${ip}`);
    const geoData = geoResponse.data;

    console.log('Geoapify API Response:', geoData);

    const city = geoData.city.name;
    const country = geoData.country.name;
    const latitude = geoData.location.latitude;
    const longitude = geoData.location.longitude;

    console.log(`Requesting weather for coordinates: ${latitude}, ${longitude}`);

    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherMapApiKey}`);
    const weatherData = weatherResponse.data;

    console.log('OpenWeatherMap API Response:', weatherData);

    const weatherDescription = weatherData.weather[0].description;
    const temperature = weatherData.main.temp;

    const greeting = `Hello, visitor from ${city}, ${country}! The weather is ${weatherDescription} with a temperature of ${temperature}°C.`;

    res.json({ greeting });
  } catch (error) {
    console.error('Error fetching geolocation or weather data:', error.message);
    res.status(500).json({ error: error.message });
  }
};