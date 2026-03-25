import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({
        code: 400,

        success: false,

        message: "location is required",
      });
    }

    const response = await axios.get(
      "https://api.weatherapi.com/v1/forecast.json",

      {
        params: {
          key: process.env.WEATHER_API_KEY,

          q: location,

          days: 7,

          alerts: "yes",

          aqi: "yes",
        },
      },
    );

    const forecastDays = response.data.forecast.forecastday.map((day) => ({
      date: day.date,

      maxTemp: day.day.maxtemp_c,

      minTemp: day.day.mintemp_c,

      avgTemp: day.day.avgtemp_c,

      condition: day.day.condition.text,

      icon: day.day.condition.icon,

      humidity: day.day.avghumidity,

      rainChance: day.day.daily_chance_of_rain,

      windSpeed: day.day.maxwind_kph,

      uv: day.day.uv,
    }));

    const alerts =
      response.data.alerts?.alert?.map((alert) => ({
        headline: alert.headline,

        severity: alert.severity,

        urgency: alert.urgency,

        areas: alert.areas,

        category: alert.category,

        effective: alert.effective,

        expires: alert.expires,

        description: alert.desc,

        instruction: alert.instruction,
      })) || [];

    res.status(200).json({
      code: 200,

      success: true,

      message: "Forecast + alerts fetched",

      data: {
        location: response.data.location.name,

        forecast: forecastDays,

        alerts: alerts,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,

      success: false,

      message: "Weather fetch failed",
    });
  }
};
