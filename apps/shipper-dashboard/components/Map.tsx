import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import styles from '../scss/map.module.scss';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

mapboxgl.accessToken = MAPBOX_TOKEN;

const Map = ({ height=500 }) => {
	const [pageIsMounted, setPageIsMounted] = useState(false);

	useEffect(() => {
		setPageIsMounted(true);
		const map = new mapboxgl.Map({
			container: 'map-container',
			zoom: 6.5,
			center: [-3.4433238, 55.3617609],
			style: 'mapbox://styles/chipzstar/cktenny8g0ez218nx2wue8i08'
		});
		map.addControl(
			new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			})
		);
		map.addControl(
			new mapboxgl.FullscreenControl({
				container: document.querySelector('#map-container')
			})
		);
	}, []);
	return <div id='map-container' className={styles.mapWrapper} style={{ height: `calc(100vh - ${height}px)` }} />;
};

Map.propTypes = {

};

export default Map;
