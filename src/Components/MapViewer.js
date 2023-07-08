import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import axios from "axios";
import './style.css';
import { renderHeatmap, toggleHeatmap } from './heatmap.js';
import { makeSearchTargets } from "./SearchBar.js";

async function getLocationData(location, buttonInfo) {
	try {
		let searchTargets = makeSearchTargets(buttonInfo);
		const res = await axios.get(
			`http://localhost:5000/locs/${location.latitude},${location.longitude},${location.radius + 500}/${searchTargets}`
		);

		return res.data;
	} catch (error) {
		console.error(error);

		return null;
	}
}

function MapViewer({ location, LOIResponse, heatmapOn, buttonInfo, setLocation, locationChangedByInteraction }) {
	const mapRef = useRef(null);
	const isProgrammaticMove = useRef(false);

	useEffect(() => {
		toggleHeatmap(heatmapOn, mapRef.current)
	}, [heatmapOn, mapRef]);

	useEffect(() => {
		if (!heatmapOn) return;

		getLocationData(location, buttonInfo).then(data => {
			renderHeatmap(mapRef.current, data);
		});
		// eslint-disable-next-line
	}, [buttonInfo, heatmapOn, mapRef]);

	const handleMoveEnd = useCallback(() => {
		if (isProgrammaticMove.current) {
			isProgrammaticMove.current = false;
			return;
		}

		let bounds = mapRef.current.getBounds();
		let center = mapRef.current.getCenter();

		locationChangedByInteraction.current = true;
		setLocation({
			longitude: center.lng,
			latitude: center.lat,
			radius: (center.distanceTo(bounds.getNorthWest())), //meters
			zoom: mapRef.current.getZoom(),
		});
	}, [setLocation, isProgrammaticMove, mapRef, locationChangedByInteraction]);

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

		if (locationChangedByInteraction.current && heatmapOn) {
			getLocationData(location, buttonInfo).then(data => {
				renderHeatmap(mapRef.current, data);
			});
		}

	}, [location, heatmapOn, buttonInfo, handleMoveEnd, mapRef, locationChangedByInteraction, isProgrammaticMove]);

	useEffect(() => {
		if (locationChangedByInteraction.current) {
			const timeoutId = setTimeout(() => {
				locationChangedByInteraction.current = false;
			}, 2000);

			return () => clearTimeout(timeoutId);
		}
	}, [locationChangedByInteraction]);

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
			renderHeatmap(mapRef.current, LOIResponse);
		}

	}, [LOIResponse, setLocation, mapRef, isProgrammaticMove]);

	return (
		<div id="map-container">
			<div id="map-viewer"></div>
		</div>
	);
}

export default React.memo(MapViewer);
