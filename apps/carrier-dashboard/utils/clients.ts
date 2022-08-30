import { Node as Logtail } from '@logtail/js';
import mbxClient from '@mapbox/mapbox-sdk';

// Initialize logtail
export const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

export const mapboxClient = mbxClient({
	accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
});