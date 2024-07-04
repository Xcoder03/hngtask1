import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress;

  if (ip && ip.startsWith('::ffff:')) {
    return ip.split(':').pop(); // Convert IPv6 to IPv4
  }
  return ip;
}

export const helloController = async (req, res) => {
  try {
    const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
    const openWeatherMapApiKey = process.env.OPENWEATHERMAP_API_KEY;
    const visitorName = req.query.visitor_name
    let ip = getClientIp(req);

    if (!geoapifyApiKey || !openWeatherMapApiKey) {
      throw new Error('API keys are not defined');
    }

    console.log(`Using Geoapify API Key: ${geoapifyApiKey}`);
    console.log(`Using OpenWeatherMap API Key: ${openWeatherMapApiKey}`);
    console.log(`Requesting geolocation for IP: ${ip}`);

    const geoResponse = await axios.get(`https://api.geoapify.com/v1/ipinfo`, {
      params: {
        apiKey: geoapifyApiKey,
        client_ip: ip
      }
    });

    const geoData = geoResponse.data;
    console.log('Geoapify API Response:', geoData);

    // Check if the IP address is private
    if (geoData.isPrivate) {
      // Use a fallback public IP address for testing
      ip = '8.8.8.8';
      console.log(`IP address is private. Using fallback IP: ${ip}`);
      const fallbackGeoResponse = await axios.get(`https://api.geoapify.com/v1/ipinfo`, {
        params: {
          apiKey: geoapifyApiKey,
          client_ip: ip
        }
      });
      const fallbackGeoData = fallbackGeoResponse.data;
      console.log('Geoapify Fallback API Response:', fallbackGeoData);
      geoData.city = fallbackGeoData.city;
      geoData.country = fallbackGeoData.country;
      geoData.location = fallbackGeoData.location;
    }

    if (!geoData.city || !geoData.country || !geoData.location) {
      throw new Error('Geolocation data is incomplete');
    }

    const city = geoData.city.name;
    const country = geoData.country.name;
    const latitude = geoData.location.latitude;
    const longitude = geoData.location.longitude;

    console.log(`Requesting weather for coordinates: ${latitude}, ${longitude}`);

    const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        lat: latitude,
        lon: longitude,
        units: 'metric',
        appid: openWeatherMapApiKey
      }
    });

    const weatherData = weatherResponse.data;
    console.log('OpenWeatherMap API Response:', weatherData);

    const weatherDescription = weatherData.weather[0].description;
    const temperature = weatherData.main.temp;

    const response = {
      client_ip: ip,
      location: city,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${city}`
    };

    res.json({ response });
  } catch (error) {
    console.error('Error fetching geolocation or weather data:', error.message);
    res.status(500).json({ error: error.message });
  }
};
