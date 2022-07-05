import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Favicon from '../components/Favicon';

function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<Favicon/>
				<title>Shipper Dashboard</title>
			</Head>
			<main className='app'>
				<Component {...pageProps} />
			</main>
		</>
	);
}

export default App;
