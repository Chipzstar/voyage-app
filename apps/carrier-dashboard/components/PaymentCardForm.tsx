import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Loader, Stack, Text } from '@mantine/core';
import classNames from 'classnames';
import { notifyError, notifySuccess } from '../utils/functions';
import { Check, X } from 'tabler-icons-react';

const PaymentCardForm = ({ onSave }) => {
	const [loading, setLoading] = useState(false);
	const stripe = useStripe();
	const elements = useElements();

	const submitButton = useMemo(
		() =>
			classNames({
				'bg-secondary': stripe,
				'hover:bg-secondary-600': stripe
			}),
		[stripe]
	);

	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => console.log(elements ? elements['_commonOptions'].clientSecret.clientSecret : elements), [elements]);

	const handleSubmit = async event => {
		// We don't want to let default form submission happen here,
		// which would refresh the page.
		event.preventDefault();
		setLoading(true);
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			setLoading(false);
			return;
		}
		try {
			const { error, paymentIntent } = await stripe.confirmPayment({
				//`Elements` instance that was used to create the Payment Element
				elements,
				redirect: 'if_required',
				confirmParams: {
					save_payment_method: true,
					return_url: `${window.location.origin}/settings`
				}
			});
			if (error) {
				console.log(error);
				// This point will only be reached if there is an immediate error when
				// confirming the payment. Show error to your customer (for example, payment
				// details incomplete)
				setErrorMessage(error.message);
				notifyError('confirm-payment-failure', `Failed to confirm your payment method: ${error.message}`, <X size={20} />);
				setLoading(false)
				return;
			} else if (paymentIntent) {
				// Your customer will be redirected to your `return_url`. For some payment
				// methods like iDEAL, your customer will be redirected to an intermediate
				// site first to authorize the payment, then redirected to the `return_url`.
				await onSave(paymentIntent);
				notifySuccess('confirm-payment-success', `Your payment method has been authorized`, <Check size={20} />);
				setLoading(false)
				return
			}
		} catch (err) {
			notifyError('confirm-payment-failure', `Failed to confirm your payment method: ${err.message}`, <X size={20} />);
			setLoading(false)
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement />
			<Stack align='center' py={20}>
				<Button size="md" disabled={!stripe} type='submit' className={submitButton}>
					<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
					<Text>Submit</Text>
				</Button>
			</Stack>
		</form>
	);
};


export default PaymentCardForm;
