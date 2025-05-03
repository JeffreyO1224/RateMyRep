import React, { useState } from "react";
import axios from "axios";

const Geocode = () => {
  const [addressInput, setAddressInput] = useState("");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_REACT_APP_GEOCODE_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!addressInput) return;

    setLoading(true);
    setError(null);
    setCoords(null);

    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: addressInput,
          key: apiKey
        }
      });

      const result = response.data;

      if (result.status === "OK") {
        const location = result.results[0].geometry.location;
        setCoords(location); // { lat: ..., lng: ... }
      } else {
        setError(result.error_message || "No results found");
      }
    } catch (err) {
      setError(err.message || "Geocoding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Geocode an Address</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={addressInput}
          placeholder="Enter address"
          onChange={(e) => setAddressInput(e.target.value)}
          style={{ width: "100%", padding: "0.5em", marginBottom: "0.5em" }}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Geocoding..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {coords && (
        <div>
          <p><strong>Latitude:</strong> {coords.lat}</p>
          <p><strong>Longitude:</strong> {coords.lng}</p>
        </div>
      )}
    </div>
  );
};

export default Geocode;
