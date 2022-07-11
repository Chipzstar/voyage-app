import { AppProps } from 'next/app';
import Head from 'next/head';
import Favicon from '../components/Favicon';
import '../styles/globals.css';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import Layout from '../layout/Layout';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import store, { persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react';

import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekday from 'dayjs/plugin/weekday';
import updateLocale from 'dayjs/plugin/updateLocale'
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(updateLocale)
dayjs.extend(objectSupport);
dayjs.extend(weekday)
dayjs.extend(customParseFormat);

function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Layout>
					<Head>
						<Favicon />
						<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
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
			</PersistGate>
		</Provider>
	);
}

export default App;
