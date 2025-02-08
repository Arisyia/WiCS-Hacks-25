import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet's CSS for styles

const locations = [
  {
    id: 1,
    name: "UT Tower",
    position: [30.2849, -97.7341],
    image: "/images/ut-tower.jpg", // Your custom image path
    description: "The UT Austin Tower is a famous landmark on campus.",
  },
  {
    id: 2,
    name: "Darrell K Royal–Texas Memorial Stadium",
    position: [30.2846, -97.7355],
    image: "/images/stadium.jpg", // Your custom image path
    description: "Home of the Texas Longhorns football team.",
  },
  // Add more locations here
];

const MapComponent = () => {
  const mapRef = useRef(null); // Create a reference to the map

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.leafletElement; // Access the Leaflet map object directly
      map.invalidateSize(); // Ensure the map resizes correctly when the component mounts
    }
  }, []);

  const center = [30.2849, -97.7341]; // Default to UT Austin's coordinates
  const zoom = 15; // Set zoom level directly

  return (
    <MapContainer
      ref={mapRef}
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "100vh" }}
      whenCreated={(map) => { mapRef.current = map }} // Initialize mapRef when created
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.position}
          icon={new L.Icon({
            iconUrl: "/path-to-your-marker-icon.png", // Custom marker image URL
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>
            <h3>{location.name}</h3>
            <img src={location.image} alt={location.name} style={{ width: "100%", height: "auto" }} />
            <p>{location.description}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;