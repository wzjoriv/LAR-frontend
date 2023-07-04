import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import axios from "axios";
import './style.css';
import renderHeatmap from './heatmap.worker.js';

function MapViewer({ location, LOIResponse, setLocation, locationChangedByUser }) {
	const mapRef = useRef(null);
  const isProgrammaticMove = useRef(false);

	const getLocationData = useCallback(async (event) => {
		console.log(location);
		try {
			const res = await axios.get(
				`http://localhost:5000/locs/${location.latitude},${location.longitude},${location.radius}/1,2`
			);

			return res.data;
		} catch (error) {
			console.error(error);

			return null;
		}
	}, [location]);

	const handleMoveEnd = useCallback(() => {
		if (isProgrammaticMove.current) {
			isProgrammaticMove.current = false;
			return;
		}

		let bounds = mapRef.current.getBounds();
		let center = mapRef.current.getCenter();

		locationChangedByUser.current = true;
		setLocation({
			longitude: center.lng,
			latitude: center.lat,
			radius: (center.distanceTo(bounds.getNorthWest())) / 2 + 1000, //meters
			zoom: mapRef.current.getZoom(),
		});
	}, [setLocation, isProgrammaticMove, mapRef, locationChangedByUser]);

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

			mapRef.current.on('moveend', handleMoveEnd);
		} else {
			const currentCenter = mapRef.current.getCenter();
			const currentZoom = mapRef.current.getZoom();

			if (
				currentCenter.lat !== location.latitude ||
				currentCenter.lng !== location.longitude ||
				currentZoom !== location.zoom
			) {

				isProgrammaticMove.current = true;
				mapRef.current.setView(
					[location['latitude'], location['longitude']],
					location['zoom']
				);
			}
		}

		if (locationChangedByUser.current) {
			getLocationData().then(data => {
				// Render heatmap; Send request to worker
				renderHeatmap(L, data);
			});
			locationChangedByUser.current = false;
		}

	}, [location, getLocationData, handleMoveEnd, mapRef, locationChangedByUser, isProgrammaticMove]);

	useEffect(() => {

		if (LOIResponse) {

			let latLngLOIs = Object.values(LOIResponse.dbs).flat();
			latLngLOIs = latLngLOIs.map(entry =>
				[entry.geometry.coordinates[1], entry.geometry.coordinates[0]]
			);

			const bounds = L.latLngBounds(latLngLOIs);

			isProgrammaticMove.current = true;
			setLocation({
				longitude: LOIResponse.search.longitude,
				latitude: LOIResponse.search.latitude,
				radius: LOIResponse.search.radius, //meters
				zoom: mapRef.current.getBoundsZoom(bounds)
			});
			renderHeatmap(L, LOIResponse);
		}

	}, [LOIResponse, setLocation, mapRef, isProgrammaticMove]);

	return (
		<div id="map-container">
			<div id="map-viewer"></div>
		</div>
	);
}

export default React.memo(MapViewer);