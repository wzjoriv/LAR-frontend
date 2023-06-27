import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import './style.css';

function MapViewer({ location, LOIResponse, setLocation, isProgrammaticMove }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      isProgrammaticMove.current = true;
      mapRef.current = L.map('map-viewer').setView(
        [location['latitude'], location['longitude']],
        location['zoom']
      );

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 13,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);

      mapRef.current.on('moveend', function () {
        if (isProgrammaticMove.current) {
          isProgrammaticMove.current = false;
          return;
        }

        console.log(mapRef.current.getCenter().toString());

        //Get radius + execute API call

        setLocation({
          longitude: mapRef.current.getCenter().lng,
          latitude: mapRef.current.getCenter().lat,
          radius: 1500.0, //meters
          zoom: mapRef.current.getZoom(),
        });

        //Render heatmap

      });
    } else {
      const currentCenter = mapRef.current.getCenter();
      // const currentZoom = mapRef.current.getZoom();
      if (
        currentCenter.lat !== location.latitude ||
        currentCenter.lng !== location.longitude
      ) {
        isProgrammaticMove.current = true;
        mapRef.current.setView(
          [location['latitude'], location['longitude']],
          location['zoom']
        );
      }
    }
  }, [location, setLocation, isProgrammaticMove]);

  useEffect(() => {

    if (LOIResponse) {

      //Get zoom from radius

      setLocation({
        longitude: LOIResponse.search.longitude,
        latitude: LOIResponse.search.latitude,
        radius: LOIResponse.search.radius, //meters
        zoom: Math.ceil(14),
      });

      //Render heatmap
    }
  }, [LOIResponse, setLocation]);

  return (
    <div id="map-container">
      <div id="map-viewer"></div>
    </div>
  );
}

export default MapViewer;