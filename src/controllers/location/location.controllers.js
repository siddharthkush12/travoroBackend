import axios from "axios";

const getNearByPlaces = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and Longitude required",
      });
    }

    const response = await axios.get(
      "https://api.geoapify.com/v2/places",
      {
        params: {
          categories:
            "accommodation.hotel,catering.cafe,commercial.gas",
          filter: `circle:${longitude},${latitude},3000`,
          limit: 20,
          apiKey: process.env.GEOAPIFY_API_KEY,
        },
      }
    );

    const places = response.data.features.map((place) => ({
      name: place.properties.name || "Unknown",
      category: formatCategory(place.properties.categories[0]),
      distance: place.properties.distance, // in meters
      lat: place.geometry.coordinates[1],
      lon: place.geometry.coordinates[0],
      address: place.properties.formatted || "Address not available",
    }));

    res.json({
      success: true,
      data: places,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby places",
    });
  }
};

// 🔥 Clean category display
const formatCategory = (category) => {
  if (!category) return "Unknown";

  if (category.includes("hotel")) return "Hotel";
  if (category.includes("cafe")) return "Cafe";
  if (category.includes("gas")) return "Fuel Pump";

  return category;
};


export default getNearByPlaces;