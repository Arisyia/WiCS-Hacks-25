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
      attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'
    }).addTo(leafletMap);

    const locations = [
      {
        coords: [30.2851, -97.7335],
        name: "University of Texas at Austin",
        img: "https://nscs.org/wp-content/uploads/2024/05/University_of_Texas_at_Austin_logo.svg.png",
        desc: "Hook 'em Horns!",
      },
      {
        coords: [30.2861, -97.7394],
        name: "UT Tower",
        img: "https://www.shutterstock.com/image-photo/austin-texas-usa-april-11-260nw-1953863413.jpg",
        desc: "Iconic tower of UT Austin.",
      },
      {
        coords: [30.2831, -97.7326],
        name: "DKR-Texas Memorial Stadium",
        img: "https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,g_xy_center,h_415,q_75,w_623,x_662,y_427/v1/clients/austin/DKR_Stadium_at_UT_Austin_Credit_alccharlo_Instagram_Exp_Aug_2026_2388df20-d9b3-4c7f-9a11-1a2ae597e7ce.jpg",
        desc: "Home of Texas Longhorns Football.",
      },
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

          const cowboyHatIcon = L.icon({
            iconUrl: "https://png.pngtree.com/png-clipart/20220806/ourmid/pngtree-cartoon-cowboy-hat-png-image_6101832.png", 
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -50]
          });

          const streetViewURL = `https://www.google.com/maps?q=&layer=c&cbll=${latitude},${longitude}`;

          L.marker([latitude, longitude], { icon: cowboyHatIcon }).addTo(map)
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
