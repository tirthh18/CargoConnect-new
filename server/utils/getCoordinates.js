const axios = require("axios");

async function getCoordinates(
  address,
  city,
  state,
  country,
  pincode
) {
  try {
    const fullAddress = [
      address,
      city,
      state,
      pincode,
      country,
    ]
      .filter(Boolean)
      .join(", ");

    console.log("Geocoding:", fullAddress);

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: fullAddress,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (
      response.data.status !== "OK" ||
      !response.data.results ||
      response.data.results.length === 0
    ) {
      console.log(
        "Google Geocoding Status:",
        response.data.status
      );

      return null;
    }

    const result = response.data.results[0];

    const location = result.geometry.location;

    console.log("Google matched address:", result.formatted_address);
    console.log("Partial match:", result.partial_match);
    console.log(
      "Location type:",
      result.geometry.location_type
    );

    /*
      partial_match = true means Google found
      a close/partial match instead of an exact match.

      We still accept it because the address may be
      a valid local address that Google cannot identify
      exactly.
    */

    return {
      lat: location.lat,
      lng: location.lng,

      // Optional information
      partialMatch: result.partial_match || false,
      formattedAddress: result.formatted_address,
      locationType: result.geometry.location_type,
    };

  } catch (err) {
    console.error(
      "Google Geocoding Error:",
      err.response?.data || err.message
    );

    return null;
  }
}

module.exports = getCoordinates;