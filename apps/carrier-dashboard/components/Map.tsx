import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import { Load } from '../utils/types'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapProps {
	height?: number;
	customers?: unknown[]
}

const Map = ({ height=500, customers=[] }: MapProps) => {
	const [pageIsMounted, setPageIsMounted] = useState(false);
	const map = useRef(null)

	useEffect(() => {
		if (map.current) return;
		map.current = new mapboxgl.Map({
			container: 'map-container',
			zoom: 6.5,
			center: [-3.4433238, 55.3617609],
			style: 'mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
		})
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
			let bbox = []
			customers.forEach((customer: Load) => {
				const pickupCoords = customer.pickup?.location?.coordinates;
				const deliveryCoords = customer.delivery?.location?.coordinates
				if (pickupCoords && deliveryCoords) {
					new mapboxgl.Marker()
						.setLngLat(pickupCoords)
						.addTo(map.current);
					new mapboxgl.Marker()
						.setLngLat(deliveryCoords)
						.addTo(map.current);
					bbox.push(pickupCoords, deliveryCoords)
				}
			})
			console.log(bbox)
			map.current.setPadding({left: 15, top: 50, right: 15, bottom: 40});
			bbox.length >=2 && map.current.fitBounds(bbox,"top-right",{ padding: { top: 100, bottom: 100, left: 15, right: 15 } })
		}
	}, [customers])

	return <div id='map-container' style={{ height: `calc(100vh - ${height}px)`, width: "100%" }} />;
};

export default Map;
