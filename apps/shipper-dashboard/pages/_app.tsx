import { AppProps } from 'next/app';
import Head from 'next/head';
import Favicon from '../components/Favicon';
import '../styles/globals.css';
import 'antd/dist/antd.css';
import 'react-big-calendar/lib/sass/styles.scss';
import moment from 'moment-timezone';
import Layout from '../layout/Layout';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Provider } from 'react-redux';
import getStore from '../store';
import TabContextProvider from '../context/TabContext';
import { SessionProvider as AuthProvider } from 'next-auth/react';

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; //styles of nprogress
//Binding events.
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

moment.tz.setDefault('Europe/London');
moment.updateLocale('en', {
	week: {
		dow: 1
	}
});
moment.locale('en');

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const store = getStore(pageProps.initialState);
	return (
		<Provider store={store}>
			<AuthProvider session={session}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{
						colorScheme: 'light'
					}}
				>
					<ModalsProvider>
						<Layout>
							<Head>
								<Favicon />
								<meta name='viewport'
									  content='minimum-scale=1, initial-scale=1, width=device-width' />
								<title>Shipper Dashboard</title>
							</Head>

							<TabContextProvider>
								<main className='app'>
									<Component {...pageProps} />
								</main>
							</TabContextProvider>
						</Layout>
					</ModalsProvider>
				</MantineProvider>
			</AuthProvider>
		</Provider>
	);
}

export default App;
