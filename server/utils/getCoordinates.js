const axios = require("axios");

async function getCoordinates( address, city, state, country, pincode) {
  try {
    const fullAddress = [address, city, state, pincode, country].filter(Boolean).join(", ");

    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: fullAddress,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status !== "OK" ||response.data.results.length === 0) 
      throw new Error("Location not found");
    
    const result = response.data.results[0];

    return {
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    };

  } catch (err) {
    console.error("Google Geocoding Error:",err.response?.data || err.message
    );

    return null;
  }
}

module.exports = getCoordinates;