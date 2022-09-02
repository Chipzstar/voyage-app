import { AppProps } from 'next/app';
import Head from 'next/head';
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-credit-cards/lib/styles.scss';
import '../styles/globals.css';
import '../scss/styles.scss';
import '../utils/string.extensions';
import '@stripe/stripe-js';
import Favicon from '../components/Favicon';
import moment from 'moment-timezone';
import { SessionProvider as AuthProvider } from 'next-auth/react';
import Layout from '../layout/Layout';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { wrapper } from '../store';

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css';
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
	return (
		<AuthProvider session={session}>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: 'light'
				}}
			>
				<NotificationsProvider position='top-right'>
					<ModalsProvider>
						<Layout session={session}>
							<Head>
								<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
								<Favicon />
								<title>Carrier Dashboard</title>
							</Head>
							<main className='app'>
								<Component {...pageProps} />
							</main>
						</Layout>
					</ModalsProvider>
				</NotificationsProvider>
			</MantineProvider>
		</AuthProvider>
	);
}

export default wrapper.withRedux(App)
