import { Html, Head, Main, NextScript } from 'next/document';
import Favicon from '../components/Favicon';

export default function Document() {
	return (
		<Html>
			<Head>
				<link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
				<Favicon />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
