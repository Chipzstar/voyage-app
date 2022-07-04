import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Favicon from '../components/Favicon';

function CustomApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<Favicon/>
				<title>Welcome to shipper-dashboard!</title>
			</Head>
			<main className='app'>
				<Component {...pageProps} />
			</main>
		</>
	);
}

export default CustomApp;
