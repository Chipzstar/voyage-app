import { AppProps } from 'next/app';
import Head from 'next/head';
import Favicon from '../components/Favicon';
import '../styles/globals.css';
import '../scss/main.scss';
import 'react-credit-cards/lib/styles.scss';
import 'antd/dist/antd.css';
import 'react-big-calendar/lib/sass/styles.scss';
import '@stripe/stripe-js';
import moment from 'moment-timezone';
import { wrapper } from '../store';
import Layout from '../layout/Layout';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { Session } from 'next-auth';
import { SessionProvider as AuthProvider } from 'next-auth/react';

import { IntercomProvider } from '../context/IntercomProvider';
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

function App({ Component, pageProps }: AppProps<{session: Session}>) {
	return (
		<AuthProvider session={pageProps.session}>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: 'light'
				}}
			>
				<NotificationsProvider position='top-right'>
					<ModalsProvider>
						<Layout>
							<Head>
								<Favicon />
								<meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
								<title>Shipper Dashboard</title>
							</Head>
							<IntercomProvider session={pageProps.session}>
								<Component {...pageProps} />
							</IntercomProvider>
						</Layout>
					</ModalsProvider>
				</NotificationsProvider>
			</MantineProvider>
		</AuthProvider>
	);
}

export default wrapper.withRedux(App);
