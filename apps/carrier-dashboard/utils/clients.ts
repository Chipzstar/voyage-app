import mbxClient from '@mapbox/mapbox-sdk';

export const mapboxClient = mbxClient({
	accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
});