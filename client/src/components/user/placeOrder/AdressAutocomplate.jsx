import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
}) {
  const places = useMapsLibrary("places");
  const inputRef = useRef(null);
  const selectingRef = useRef(false);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectingRef.current) {
      selectingRef.current = false;
      return;
    }

    if (!places || !value || value.length < 2) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response =
          await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: value,
            includedRegionCodes: ["in"],
          });

        if (!cancelled) {
          setSuggestions(response.suggestions || []);
        }
      } catch (error) {
        console.error("Autocomplete error:", error);

        if (!cancelled) {
          setSuggestions([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [places, value]);

  const handleSelect = async (suggestion) => {
    try {
      selectingRef.current = true;

      const prediction = suggestion.placePrediction;
      const place = prediction.toPlace();

      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location"],
      });

      const address = place.formattedAddress || place.displayName || "";

      setSuggestions([]);
      setLoading(false);

      onChange(address);

      if (place.location && onPlaceSelect) {
        onPlaceSelect({
          address,
          formattedAddress: place.formattedAddress || address,
          lat: place.location.lat(),
          lng: place.location.lng(),
        });
      }

      inputRef.current?.blur();
    } catch (error) {
      console.error("Place selection error:", error);
      setSuggestions([]);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          selectingRef.current = false;
          onChange(e.target.value);
        }}
        onBlur={() => {
          setTimeout(() => {
            setSuggestions([]);
          }, 200);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:border-[#E8734A] focus:ring-1 focus:ring-[#E8734A]/30"
      />

      {suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;

            return (
              <button
                type="button"
                key={prediction?.placeId || index}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(suggestion);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 border-b border-slate-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-slate-800">
                  {prediction?.mainText?.text ||
                    prediction?.text?.text ||
                    ""}
                </div>

                <div className="text-xs text-slate-500 mt-1">
                  {prediction?.secondaryText?.text || ""}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {loading &&
        value.length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute z-50 right-3 top-3 text-xs text-slate-400">
            Searching...
          </div>
        )}
    </div>
  );
}