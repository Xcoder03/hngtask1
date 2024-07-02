import ipify from "ipify"
import openweathermap  from "openweathermap"



  export const helloController  = async(req, res) => {
      try {
        const visitorName = req.query.visitor_name;
        const ip = req.ip;
        const location = await ipify.getLocation(ip);
        const temperature = await openweathermap.getCurrentTemperature(location.city);

        const response = {
            client_ip: ip,
            location: location.city,
            greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location.city}.`
          };
          res.json(response);

      } catch (error) {
        next(appError(error.message));
      }
  }