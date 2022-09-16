import React, { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import Cards from 'react-credit-cards';
import prisma from '../../db';
import { authOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { AppDispatch, wrapper } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { formatAmountForStripe } from '../../utils/stripe';
import { fetchShipper } from '../../utils/functions';
import { Shipment, STATUS, ShipperStripe } from '@voyage-app/shared-types';
import { CURRENCY } from '@voyage-app/shared-utils';
import { useShipments } from '../../store/features/shipmentsSlice';
import { PUBLIC_PATHS, STRIPE_PUBLIC_KEY } from '../../utils/constants';
import { setShipper, updateShipper, useShipper } from '../../store/features/profileSlice';
import PaymentCardForm from '../../components/PaymentCardForm';
import PaymentStatus from '../../components/PaymentStatus';
import UpdateCardForm from '../../components/UpdateCardForm';
import Stripe from 'stripe';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethod, StripeElementsOptions } from '@stripe/stripe-js';
import { Group, Button } from '@mantine/core';

const stripePromise = await loadStripe(String(STRIPE_PUBLIC_KEY));

const Billing = ({ clientSecret }) => {
	const [updateCardModal, showUpdateCardModal] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const shipments = useSelector(useShipments);
	const profile = useSelector(useShipper);
	const options: StripeElementsOptions = {
		clientSecret: clientSecret,
		appearance: {
			theme: 'stripe'
		}
	};

	const paymentMethod = useMemo(() => {
		return profile?.stripe?.paymentMethod;
	}, [profile]);

	const totalBalance = useMemo(() => {
		const total = shipments.reduce((prev: number, curr: Shipment) => {
			return curr.status === STATUS.COMPLETED ? prev + curr.rate : prev;
		}, 0);
		return Number(total).toFixed(2);
	}, [shipments]);

	const submitPaymentInfo = useCallback(async paymentIntent => {
		try {
			const paymentMethod: PaymentMethod = (
				await axios.put(`/api/stripe/payment-method/${paymentIntent.payment_method}`, {
					customer: profile.stripe.customerId
				})
			).data;
			let data: ShipperStripe = {
				...profile.stripe,
				paymentMethod: {
					id: paymentMethod.id ?? paymentIntent.payment_method,
					fingerprint: paymentMethod.card.fingerprint,
					brand: paymentMethod.card.brand,
					last4: paymentMethod.card.last4,
					expMonth: paymentMethod.card.exp_month,
					expYear: paymentMethod.card.exp_year
				}
			};
			await dispatch(updateShipper({ ...profile, stripe: data })).unwrap();
			return 'Payment Added successfully';
		} catch (e) {
			throw e;
		}
	}, [profile]);

	return (
		<div className='h-screen p-4'>
			{paymentMethod ? (
				<div className='grid h-full grid-cols-1 gap-x-12 gap-y-8 px-4 md:grid-cols-5'>
					<Elements stripe={stripePromise} options={options}>
						{options.clientSecret && <UpdateCardForm opened={updateCardModal} onClose={() => showUpdateCardModal(false)} clientSecret={clientSecret} onUpdate={submitPaymentInfo} />}
					</Elements>
					<section className='md:col-span-2'>
						<header className='mb-8 flex h-20 flex-row items-center justify-between py-3'>
							<h2 className='page-header'>Billing</h2>
						</header>
						<div className='flex w-full flex-col justify-center space-y-4 border border-2 border-gray-300 py-8 px-4'>
							<span className='text-xl uppercase'>Total Balance Due</span>
							<span className='text-secondary text-4xl font-bold'>£{totalBalance}</span>
							<span className='text-lg text-red-500'>Overdue Balance: £0</span>
						</div>
						<div id='PaymentForm' className="mt-20">
							<Cards
								preview
								issuer={paymentMethod.brand}
								number={`**** **** **** ${paymentMethod.last4}`}
								expiry={moment({ M: paymentMethod.expMonth - 1 }).format('MM') + '/' + paymentMethod.expYear}
								name={profile?.fullName ?? ''}
								cvc=''
							/>
							<Group py='lg' position='center'>
								<Button size="xs" variant='outline' color='blue' onClick={() => showUpdateCardModal(true)}>
									Update Card
								</Button>
							</Group>
						</div>
					</section>
					<section className='md:col-span-3'>
						<header className='mb-8 flex h-20 flex-row items-center justify-between py-3'>
							<h2 className='page-header'>Invoices</h2>
						</header>
						<div className='flex flex-col justify-center'>
							<span className='text-3xl font-semibold'>No Invoices Created</span>
						</div>
					</section>
				</div>
			) : (
				<div className='flex flex-col justify-center items-center h-full gap-x-12 gap-y-8 px-4'>
					<header className='shipment-header my-6'>Payment Details</header>
					<Elements stripe={stripePromise} options={options}>
						<PaymentCardForm onSave={submitPaymentInfo} />
						<PaymentStatus />
					</Elements>
				</div>
			)}
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	let clientSecret = null;
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id || token?.shipperId) {
		let shipper = await fetchShipper(session.id, token?.shipperId, prisma);
		store.dispatch(setShipper(shipper));
		// fetch clientSecret from stripe payment intent
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-08-01'
		});
		const formattedAmount = formatAmountForStripe(1, CURRENCY);
		const params: Stripe.PaymentIntentCreateParams = {
			payment_method_types: ['card'],
			setup_future_usage: 'off_session',
			amount: formattedAmount,
			currency: CURRENCY,
			customer: shipper.stripe.customerId
		};
		const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(params);
		clientSecret = payment_intent.client_secret;
	}
	return {
		props: {
			session,
			clientSecret
		}
	};
});

export default Billing;
