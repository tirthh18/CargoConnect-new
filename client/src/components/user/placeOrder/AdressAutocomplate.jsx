const handleSelect = async (suggestion) => {
  try {
    selectingRef.current = true;

    console.log("1. SUGGESTION SELECTED:", suggestion);

    const prediction = suggestion.placePrediction;
    const place = prediction.toPlace();

    console.log("2. PLACE CREATED:", place);

    await place.fetchFields({
      fields: [
        "displayName",
        "formattedAddress",
        "location",
      ],
    });

    const address =
      place.formattedAddress ||
      place.displayName ||
      "";

    console.log("3. GOOGLE ADDRESS:", address);
    console.log("4. GOOGLE LOCATION:", place.location);

    const selectedPlace = {
      address,
      lat: place.location?.lat(),
      lng: place.location?.lng(),
      formattedAddress: place.formattedAddress || address,
    };

    console.log("5. PLACE SENT TO PARENT:", selectedPlace);

    setSuggestions([]);
    setLoading(false);

    onChange(address);

    if (place.location && onPlaceSelect) {
      onPlaceSelect(selectedPlace);
    }

    inputRef.current?.blur();
  } catch (error) {
    console.error("6. PLACE SELECTION ERROR:", error);
    setSuggestions([]);
    setLoading(false);
  }
};