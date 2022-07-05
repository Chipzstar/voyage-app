import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Favicon from '../components/Favicon';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

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
