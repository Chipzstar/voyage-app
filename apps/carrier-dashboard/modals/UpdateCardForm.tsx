import { Box, Button, Divider, Group, Loader, Modal, Text } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Check, X } from 'tabler-icons-react';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';

const CARD_ELEMENT_OPTIONS = {
	style: {
		base: {
			color: '#32325d',
			fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
			fontSmoothing: 'antialiased',
			fontSize: '16px',
			'::placeholder': {
				color: '#aab7c4'
			}
		},
		invalid: {
			color: '#fa755a',
			iconColor: '#fa755a'
		}
	}
};

const UpdateCardForm = ({ opened, onClose, clientSecret, onUpdate }) => {
	const [processing, setProcessing] = useState(false);
	const stripe = useStripe()
	const elements = useElements()

	const handleSubmit = useCallback(async ev => {
		ev.preventDefault();
		setProcessing(true);
		if (!stripe || !elements) {
			// Stripe.js has not yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			setProcessing(false);
			return;
		}
		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement)
			}
		});

		if (payload.error) {
			notifyError('update-card-failure', `Payment failed ${payload.error.message}`, <X size={20} />);
			setProcessing(false);
		} else {
			setProcessing(false);
			console.log(payload.paymentIntent)
			await onUpdate(payload.paymentIntent)
			notifySuccess('update-card-success', `Card details updated successfully!`, <Check size={20} />);
			onClose();
		}
	},[stripe, elements]);

	return (
		<Modal
			centered
			opened={opened}
			onClose={onClose}
			title='Update Card'
			classNames={{
				title: 'page-subheading'
			}}
			styles={{
				close: {
					width: 30,
					height: 30
				}
			}}
		>
			<form id='payment-form' onSubmit={handleSubmit}>
				<Box my='lg'>
					<CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
				</Box>
				<Divider my='md' />
				<Group position='right'>
					<Button type="button" variant='subtle' color='gray' onClick={onClose}>
						Cancel
					</Button>
					<Button disabled={!stripe} type="submit" variant='filled' className='bg-secondary hover:bg-secondary-600'>
						<Loader size='sm' className={`mr-3 ${!processing && 'hidden'}`} />
						<Text>Update card</Text>
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

export default UpdateCardForm;
