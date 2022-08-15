import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Load, MapType } from '../utils/types';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
	type: MapType;
	height?: number;
	customers?: unknown[];
	route?: {
		type: 'LineString';
		coordinates: [];
	};
	tripId?: string;
}

const Map = ({
	height = 500,
	customers = [],
	type = MapType.DASHBOARD,
	route = {
		type: 'LineString',
		coordinates: []
	},
	tripId
}: MapProps) => {
	const [pageIsMounted, setPageIsMounted] = useState(false);
	const [geoJSON, setGeoJSON] = useState({
		type: 'geojson',
		data: {
			type: 'Feature',
			properties: {},
			geometry: route
		}
	});
	const map = useRef(null);

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: 'map-container',
			zoom: 6.5,
			center: [-3.4433238, 55.3617609],
			style: 'mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
		});
		setPageIsMounted(true);
		map.current.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			})
		);
		map.current.addControl(
			new mapboxgl.FullscreenControl({
				container: document.querySelector('#map-container')
			})
		);
		const nav = new mapboxgl.NavigationControl();
		map.current.addControl(nav, 'top-right');
	}, []);

	useEffect(() => {
		if (map.current) {
			let coordinates = [];
			customers.forEach((customer: Load) => {
				const pickupCoords = customer.pickup?.location?.coordinates;
				const deliveryCoords = customer.delivery?.location?.coordinates;
				if (pickupCoords && deliveryCoords) {
					new mapboxgl.Marker().setLngLat(pickupCoords).addTo(map.current);
					new mapboxgl.Marker().setLngLat(deliveryCoords).addTo(map.current);
					coordinates.push(pickupCoords, deliveryCoords);
				}
			});
			map.current.setPadding({ left: 50, top: 50, right: 50, bottom: 40 });
			if (coordinates.length >= 2) {
				const bounds = coordinates.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));
				map.current.fitBounds(bounds);
			}
		}
	}, [customers]);

	useEffect(() => {
		if (map.current && type === MapType.ORDER) {
			map.current.on('load', () => {
				map.current.addSource(`route_${tripId}`, geoJSON);
				map.current.addLayer({
					id: `route_${tripId}`,
					type: 'line',
					source: `route_${tripId}`,
					layout: {
						'line-join': 'round',
						'line-cap': 'round'
					},
					paint: {
						'line-color': '#f97316',
						'line-width': 3
					}
				});
			});
		}
	}, [type, tripId]);

	return <div id='map-container' style={{ height: `calc(100vh - ${height}px)`, width: '100%' }} />;
};

export default Map;
