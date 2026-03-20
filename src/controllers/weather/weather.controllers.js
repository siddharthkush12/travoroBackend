
import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const response = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude,
          longitude,
          current_weather: true,
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data.current_weather,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Weather fetch failed",
    });
  }
};