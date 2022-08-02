import { createGetInitialProps } from '@mantine/next';
import Favicon from '../components/Favicon';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
	static getInitialProps = getInitialProps;

	render() {
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
}
