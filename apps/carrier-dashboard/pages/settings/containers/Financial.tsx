import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Center, Container, Group, Button } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, PaymentMethod, StripeElementsOptions } from '@stripe/stripe-js';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { STRIPE_PUBLIC_KEY } from '../../../utils/constants';
import PaymentCardForm from 'apps/carrier-dashboard/components/PaymentCardForm';
import PaymentStatus from '../../../components/PaymentStatus';
import Cards from 'react-credit-cards';
import { StripeDetails } from '../../../utils/types';
import { updateCarrier } from '../../../store/feature/profileSlice';
import moment from 'moment';
import UpdateCardForm from '../components/UpdateCardForm';

const stripePromise = loadStripe(String(STRIPE_PUBLIC_KEY));

const Financial = ({ settings, carrierInfo, clientSecret }) => {
	const dispatch = useDispatch<AppDispatch>();
	const options: StripeElementsOptions = {
		clientSecret: clientSecret,
		appearance: {
			theme: 'stripe'
		}
	};
	const [updateCardModal, showUpdateCardModal] = useState(false)

	const paymentMethod = useMemo(() => {
		return carrierInfo?.stripe?.paymentMethod;
	}, [carrierInfo]);

	const submitPaymentInfo = useCallback(async paymentIntent => {
		try {
			console.log(paymentIntent);
			const paymentMethod: PaymentMethod = (await axios.put(`/api/stripe/payment-method/${paymentIntent.payment_method}`, {
				customer: carrierInfo.stripe.customerId
			})).data;
			let data: StripeDetails = {
				...carrierInfo.stripe,
				paymentMethod: {
					id: paymentMethod.id ?? paymentIntent.payment_method,
					fingerprint: paymentMethod.card.fingerprint,
					brand: paymentMethod.card.brand,
					last4: paymentMethod.card.last4,
					expMonth: paymentMethod.card.exp_month,
					expYear: paymentMethod.card.exp_year,
				}
			}
			await dispatch(updateCarrier({...carrierInfo, stripe: data})).unwrap()
			return 'Payment Added successfully';
		} catch (e) {
			throw e;
		}
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			{clientSecret && <Elements stripe={stripePromise} options={options}>
				<UpdateCardForm opened={updateCardModal} onClose={() => showUpdateCardModal(false)} clientSecret={clientSecret} onUpdate={submitPaymentInfo} />
			</Elements>}
			<Center className='flex h-full flex-col'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center'>
					<header className='page-header my-6'>Payment Details</header>
					{paymentMethod ? (
						<div id="PaymentForm">
							<Cards
								preview
								issuer={paymentMethod.brand}
								number={`**** **** **** ${paymentMethod.last4}`}
								expiry={moment({M: paymentMethod.expMonth - 1}).format("MM") + "/" + paymentMethod.expYear}
								name={carrierInfo?.fullName ?? ""}
								cvc=""
							/>
							<Group py="lg" position="right">
								<Button variant="outline" color="blue" onClick={() => showUpdateCardModal(true)} >
									Update Card
								</Button>
							</Group>
						</div>
					) : (
						<Elements stripe={stripePromise} options={options}>
							<PaymentCardForm onSave={submitPaymentInfo} />
							<PaymentStatus />
						</Elements>
					)}
				</section>
			</Center>
		</Container>
	);
};

export default Financial;
