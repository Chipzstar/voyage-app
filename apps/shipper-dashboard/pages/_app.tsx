import { AppProps } from 'next/app';
import Head from 'next/head';
import Favicon from '../components/Favicon';
import '../styles/globals.css';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Layout from '../layout/Layout';
import { MantineProvider } from '@mantine/core';

dayjs.extend(customParseFormat);

function App({ Component, pageProps }: AppProps) {
	return (
		<Layout>
			<Head>
				<Favicon />
				<title>Shipper Dashboard</title>
			</Head>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: 'light'
				}}
			>
				<main className='app'>
					<Component {...pageProps} />
				</main>
			</MantineProvider>
		</Layout>
	);
}

export default App;
