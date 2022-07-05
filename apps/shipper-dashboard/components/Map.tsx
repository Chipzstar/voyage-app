import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import styles from '../scss/map.module.scss';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = props => {
	const [pageIsMounted, setPageIsMounted] = useState(false)

	useEffect(() => {
		setPageIsMounted(true)
		const map = new mapboxgl.Map({
			container: 'map-container',
			zoom: 6.5,
			center: [-0.118092, 51.509865],
			style: 'mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
		});
		map.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
			})
		);
		map.addControl(
			new mapboxgl.FullscreenControl({
				container: document.querySelector('#map-container')}
			)
		);
	}, [])
	return (
		<div id="map-container" className={styles.mapWrapper} style={{height: 500}}/>
	);
};

Map.propTypes = {

};

export default Map;
