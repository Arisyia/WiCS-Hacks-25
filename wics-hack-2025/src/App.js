import React, { useEffect, useState } from 'react';
import L from 'leaflet';  // Leaflet.js for map handling
import 'leaflet/dist/leaflet.css';  // Leaflet CSS for styling
import 'leaflet.markercluster/dist/leaflet.markercluster.css';  // Marker clustering styles
import 'leaflet.markercluster/dist/leaflet.markercluster.js';  // Marker clustering logic
import ReactLeafletSearch from 'react-leaflet-search';

const App = () => {
  const [iconUrl, setIconUrl] = useState(null);  // State to store custom icon URL
  const [currentLocation, setCurrentLocation] = useState(null);  // State to store user location

  useEffect(() => {
    // Initialize map after component mounts
    const map = L.map('map').setView([30.2849, -97.7341], 15);  // Coordinates for UT Austin

    // Add the OpenStreetMap tile layer
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Satellite view tile layer (used for layer control)
    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });

    // Terrain view tile layer (used for layer control)
    const terrainLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');

    // Add a marker cluster group to cluster nearby markers
    const markers = L.markerClusterGroup();

    // Example of adding markers with popups for buildings
    const buildings = [
      { name: 'Jester Center', coords: [30.2849, -97.7341], description: 'A large residence hall and student services center.', category: 'Dormitory' },
      { name: 'UT Tower', coords: [30.2850, -97.7333], description: 'The iconic tower of the University of Texas.', category: 'Landmark' },
      { name: 'LBJ Library', coords: [30.2852, -97.7357], description: 'Library and center for historical research.', category: 'Library' },
      { name: 'Perry-Castañeda Library (PCL)', coords: [30.2843, -97.7337], description: 'Main library for undergraduate students.', category: 'Library' },
      { name: 'Blanton Museum of Art', coords: [30.2863, -97.7385], description: 'A museum of contemporary and modern art.', category: 'Museum' },
      { name: 'Union Building', coords: [30.2840, -97.7360], description: 'Student union with dining and meeting areas.', category: 'Building' }
    ];

    // Add markers for each building to the marker cluster group
    buildings.forEach(building => {
      const { name, coords, description, category } = building;
      const marker = L.marker(coords).bindPopup(`<b>${name}</b><br>${description}<br>Category: ${category}`);
      markers.addLayer(marker);
    });

    // Add the marker cluster group to the map
    map.addLayer(markers);

    // Add layer control for switching between tile layers
    const baseLayers = {
      'OpenStreetMap': osmLayer,
      'Satellite': satelliteLayer,
      'Terrain': terrainLayer,
    };
    const overlays = {
      'Buildings': markers,
    };
    L.control.layers(baseLayers, overlays).addTo(map);

    // Add search functionality
    new ReactLeafletSearch({
      position: 'topright',
      layer: markers,
      initial: false,
      zoom: 15,
    }).addTo(map);

    // Get the user's current location and set a marker
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        setCurrentLocation(userCoords);

        const userLocationMarker = L.marker(userCoords, {
          icon: L.icon({
            iconUrl: iconUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',  // Default user location icon
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          }),
        }).addTo(map);
        userLocationMarker.bindPopup('<b>Your Location</b><br>This is where you are currently.');
        map.setView(userCoords, 15);
      });
    }

    // Cleanup: Remove map instance when the component unmounts
    return () => {
      map.remove();
    };
  }, [iconUrl]);

  return (
    <div>
      <div id="map" style={{ height: '100vh', width: '100%' }}></div>

      {/* Optional Title and Description */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, fontSize: '30px', fontWeight: 'bold', color: 'white' }}>
        UT Austin Interactive Map
      </div>
      <div style={{ position: 'absolute', top: 50, left: 10, zIndex: 1000, fontSize: '16px', color: 'white', maxWidth: '300px' }}>
        Click on the markers to explore different buildings on campus.
      </div>

      {/* File input for uploading custom icon */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setIconUrl(reader.result);  // Set the uploaded image as a Data URL
            reader.readAsDataURL(file);  // Converts the image file into a data URL
          }
        }}
        style={{ position: 'absolute', top: 100, left: 10, zIndex: 1000 }}
      />
      <p style={{ position: 'absolute', top: 140, left: 10, zIndex: 1000, color: 'white' }}>
        Upload your custom icon for the current location marker.
      </p>
    </div>
  );
};

export default App;

