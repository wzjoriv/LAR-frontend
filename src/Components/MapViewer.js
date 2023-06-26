import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import './style.css';

function MapViewer(props) {
  useEffect(() => {
    var map = L.map('map-viewer').setView(
      [props.location['latitude'], props.location['longitude']],
      props.location['zoom']
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map-container">
      <div id="map-viewer"></div>
    </div>
  );
}

export default MapViewer;
