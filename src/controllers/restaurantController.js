const {
  searchRestaurants,
  searchAllRestaurants,
  formatRestaurants,
} = require("../services/yelpService");

const getRestaurants = async (req, res) => {
  const { city, limit } = req.query;

  if (!city || city.trim() === "") {
    return res.status(400).json({ error: "City parameter is required." });
  }

  const cityName = city.trim();

  try {
    let data;

    if (limit === "all") {
      data = await searchAllRestaurants(cityName);
    } else {
      const parsedLimit = Number(limit);
      const limitValue = Math.min(
        50,
        Math.max(1, isNaN(parsedLimit) ? 20 : parsedLimit),
      );
      data = await searchRestaurants(cityName, limitValue);
    }

    if (!data.businesses || data.businesses.length === 0) {
      return res.json({
        city: cityName,
        total: 0,
        results: [],
        message: "No restaurants found. Try a different city.",
      });
    }

    res.json({
      city: cityName,
      total: data.total,
      count: data.businesses.length,
      radius: "5 miles",
      results: formatRestaurants(data.businesses),
    });
  } catch (err) {
    if (err.status === 400) {
      return res.status(404).json({
        error: `Location "${cityName}" not found. Please try a different city name.`,
      });
    }

    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

module.exports = { getRestaurants };
