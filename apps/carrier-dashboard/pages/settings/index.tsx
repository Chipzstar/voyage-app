import TabBar from '../../layout/TabBar';
import { PUBLIC_PATHS, SETTINGS_TABS } from '../../utils/constants'
import React from 'react'
import { Container, Tabs } from '@mantine/core'
import Organisation from './containers/Organisation'
import Financial from './containers/Financial'
import { wrapper } from '../../store'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'
import { fetchProfile, fetchSettings } from '../../utils/functions'
import prisma from '../../db'
import { setCarrier, useCarrier } from '../../store/feature/profileSlice'
import { useSelector } from 'react-redux';
import Documents from './containers/Documents';
import { setSettings, useSettings } from '../../store/feature/settingsSlice'
import Stripe from 'stripe';
import { CURRENCY, formatAmountForStripe } from '../../utils/stripe';
import { Carrier } from '../../utils/types';
import Workflows from './Workflows';

const TAB_LABELS = {
	ORGANIZATION: SETTINGS_TABS[0].value,
	WORKFLOWS: SETTINGS_TABS[1].value,
	FINANCIAL: SETTINGS_TABS[2].value,
	DOCUMENTS: SETTINGS_TABS[3].value,
}

const settings = ({clientSecret}) => {
	const profile = useSelector(useCarrier)
	const settings = useSelector(useSettings)

	return (
		<Container fluid px={0} className="h-full">
			<TabBar tabLabels={SETTINGS_TABS} defaultTab={SETTINGS_TABS[0].value}>
				<Tabs.Panel value={TAB_LABELS.ORGANIZATION}>
					<Organisation carrierInfo={profile}/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.WORKFLOWS}>
					<Workflows carrierInfo={profile} settings={settings}/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.FINANCIAL}>
					<Financial carrierInfo={profile} settings={settings} clientSecret={clientSecret}/>
				</Tabs.Panel>
				<Tabs.Panel value={TAB_LABELS.DOCUMENTS}>
					<Documents carrierInfo={profile}/>
				</Tabs.Panel>
			</TabBar>
		</Container>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	let clientSecret = null
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id || token?.carrierId) {
		let carrier: Carrier = await fetchProfile(session.id, token?.carrierId, prisma);
		let settings = await fetchSettings(token?.carrierId, prisma);
		store.dispatch(setCarrier(carrier));
		store.dispatch(setSettings(settings));
		// fetch clientSecret from stripe payment intent
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-08-01'
		});
		const formattedAmount = formatAmountForStripe(1, CURRENCY)
		const params: Stripe.PaymentIntentCreateParams = {
			payment_method_types: ['card'],
			setup_future_usage: 'off_session',
			amount: formattedAmount,
			currency: CURRENCY,
			customer: carrier.stripe.customerId
		};
		const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
			params
		);
		console.log(payment_intent)
		clientSecret = payment_intent.client_secret;
	}
	return {
		props: {
			session,
			clientSecret
		}
	};
});

export default settings;