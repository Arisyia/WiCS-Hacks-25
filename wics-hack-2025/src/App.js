import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapStyles.css"; // Custom styles

const LeafletMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const leafletMap = L.map(mapRef.current).setView([30.2851, -97.7335], 15);
    setMap(leafletMap);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    const locations = [
      { coords: [30.2851, -97.7335], name: "University of Texas at Austin", img: "https://nscs.org/wp-content/uploads/2024/05/University_of_Texas_at_Austin_logo.svg.png", desc: "Hook 'em Horns!" },
      { coords: [30.2861, -97.7394], name: "UT Tower", img: "https://upload.wikimedia.org/wikipedia/commons/4/4d/UT_Tower.jpg", desc: "Iconic tower of UT Austin." },
      { coords: [30.2831, -97.7326], name: "DKR-Texas Memorial Stadium", img: "https://upload.wikimedia.org/wikipedia/commons/6/68/DKR_Texas_Memorial_Stadium.jpg", desc: "Home of Texas Longhorns Football." },
      { coords: [30.2811, -97.7348], name: "Jester Center", img: "https://upload.wikimedia.org/wikipedia/commons/3/3f/JesterCenter.jpg", desc: "Largest residence hall on campus." },
      { coords: [30.2838, -97.7322], name: "Perry-Castañeda Library", img: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Perry-Casta%C3%B1eda_Library.jpg", desc: "Main library on campus." },
      { coords: [30.2865, -97.7350], name: "Gregory Gym", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/GregoryGymUT.jpg", desc: "Recreation center for students." },
      { coords: [30.2843, -97.7276], name: "LBJ Presidential Library", img: "https://upload.wikimedia.org/wikipedia/commons/4/4c/LBJ_Library.jpg", desc: "Library and museum dedicated to Lyndon B. Johnson." },
      { coords: [30.2835, -97.7371], name: "McCombs School of Business", img: "https://upload.wikimedia.org/wikipedia/commons/d/dc/McCombs_Business_School.jpg", desc: "Business school at UT Austin." },
      { coords: [30.2862, -97.7405], name: "Texas Union", img: "https://upload.wikimedia.org/wikipedia/commons/9/9a/TexasUnion.jpg", desc: "Student activity center." },
      { coords: [30.2882, -97.7359], name: "RLM Hall", img: "https://upload.wikimedia.org/wikipedia/commons/7/75/RLM_Hall_UT.jpg", desc: "Department of Mathematics and Astronomy." },
      { coords: [30.2802, -97.7321], name: "Frank Erwin Center", img: "https://upload.wikimedia.org/wikipedia/commons/5/5e/FrankErwinCenter.jpg", desc: "Former basketball arena for the Longhorns." },
    ];

    locations.forEach(({ coords, name, img, desc }) => {
      const googleStreetViewURL = `https://www.google.com/maps?q=&layer=c&cbll=${coords[0]},${coords[1]}`;

      const marker = L.marker(coords).addTo(leafletMap)
        .bindPopup(`
          <div class="wild-west-popup">
            <h3>${name}</h3>
            <img src="${img}" width="150" />
            <p>${desc}</p>
            <a href="${googleStreetViewURL}" target="_blank" style="color: #BF5700; font-weight: bold; text-decoration: none;">
              🔍 View in Street View
            </a>
          </div>
        `);
      marker.bindTooltip(name, { permanent: true, direction: "top", className: "wild-west-label" });
    });

    return () => {
      leafletMap.remove();
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const cowboyBootsIcon = L.icon({
            iconUrl: "https://png.pngtree.com/png-clipart/20220806/ourmid/pngtree-cartoon-cowboy-hat-png-image_6101832.png",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50]
          });

          const streetViewURL = `https://www.google.com/maps?q=&layer=c&cbll=${latitude},${longitude}`;

          L.marker([latitude, longitude], { icon: cowboyBootsIcon }).addTo(map)
            .bindPopup(`<h3>Your Location</h3><p>Howdy, partner!</p>
              <a href="${streetViewURL}" target="_blank" style="color: #BF5700; font-weight: bold; text-decoration: none;">
                🔍 View Your Street View
              </a>`)
            .openPopup();

          map.setView([latitude, longitude], 15);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, [map]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default LeafletMap;
