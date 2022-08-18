import React, { useCallback } from 'react';
import { Button, Checkbox, Container, Group, NumberInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { createSettings, updateSettings } from '../../../store/feature/settingsSlice';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { notifyError, notifySuccess } from 'apps/carrier-dashboard/utils/functions';
import { Check, X } from 'tabler-icons-react';
import { ChargeUnitType, Settings } from 'apps/carrier-dashboard/utils/types';
import { defaultSettings } from '../../../utils/constants';
import PaymentCardForm from 'apps/carrier-dashboard/components/PaymentCardForm';
import PaymentStatus from '../../../components/PaymentStatus';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY);

const Financial = ({ settings, carrierInfo, clientSecret }) => {
	const dispatch = useDispatch<AppDispatch>();
	const initialValues: Settings = {
		id: settings?.id ?? undefined,
		carrierId: settings?.carrierId ?? carrierInfo?.id ?? undefined,
		rateChargeRules: settings?.rateChargeRules ?? defaultSettings.rateChargeRules
	};
	const options: StripeElementsOptions = {
		clientSecret: clientSecret,
		appearance: {
			theme: 'stripe'
		}
	};

	const submitPaymentInfo = useCallback(async paymentIntent => {
		try {
			console.log(paymentIntent)
			await axios.put(`/api/stripe/payment-method/${paymentIntent.payment_method}`, {
				customer: carrierInfo.stripe.customerId
			});
			await axios.put(`/api/carrier/${carrierInfo.id}`, {
				stripe: {
					...carrierInfo.stripe,
					paymentMethodId: paymentIntent.payment_method
				}
			});
			return "Payment Added successfully";
		} catch (e) {
			throw(e)
		}
	}, []);

	const quoteConfigForm = useForm({
		initialValues
	});

	const submitQuoteSettings = useCallback(values => {
		settings.id
			? dispatch(updateSettings(values))
					.unwrap()
					.then(() => {
						notifySuccess('update-settings-success', 'Quote settings saved!', <Check size={20} />);
					})
					.catch(err => notifyError('update-settings-success', `There was a problem saving your settings. ${err?.message}`, <X size={20} />))
			: dispatch(createSettings(values))
					.unwrap()
					.then(() => {
						notifySuccess('create-settings-success', 'Quote settings saved!', <Check size={20} />);
					});
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<div className='grid h-full grid-cols-2 py-6'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center border-r'>
					<header className='page-header my-6'>Payment Settings</header>
					{/*<form>
						<Group px={20}>
							<TextInput label='Card Info' placeholder='1234 1234 1234 1234' />
							<Group>
								<TextInput
									label='Month'
									placeholder='MM'
									classNames={{
										root: 'w-24'
									}}
								/>
								<TextInput
									label='Year'
									placeholder='YY'
									classNames={{
										root: 'w-24'
									}}
								/>
							</Group>
							<TextInput
								label='CVV'
								placeholder=''
								classNames={{
									root: 'w-24'
								}}
							/>
						</Group>
						<Stack align='center' py={20}>
							<Button className='bg-secondary hover:bg-secondary-600'>Save Changes</Button>
						</Stack>
					</form>*/}
					{options.clientSecret && (
						<Elements stripe={stripePromise} options={options}>
							<PaymentCardForm onSave={submitPaymentInfo} />
							<PaymentStatus />
						</Elements>
					)}
				</section>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center border-l'>
					<header className='page-header my-6'>Quote Settings</header>
					<form onSubmit={quoteConfigForm.onSubmit(submitQuoteSettings)}>
						<Stack>
							<Group position='center'>
								<Checkbox
									checked={quoteConfigForm.values.rateChargeRules[ChargeUnitType.DISTANCE].active}
									label='Charge per mile'
									className='lg:w-48'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.DISTANCE}.active`)}
								/>
								<NumberInput
									disabled={!quoteConfigForm.values.rateChargeRules[ChargeUnitType.DISTANCE].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.DISTANCE}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>
							<Group position='center'>
								<Checkbox
									checked={quoteConfigForm.values.rateChargeRules[ChargeUnitType.PACKAGE].active}
									label='Charge per pallet'
									className='lg:w-48'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.PACKAGE}.active`)}
								/>
								<NumberInput
									disabled={!quoteConfigForm.values.rateChargeRules[ChargeUnitType.PACKAGE].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.PACKAGE}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>

							<Group position='center'>
								<Checkbox
									checked={quoteConfigForm.values.rateChargeRules[ChargeUnitType.WEIGHT].active}
									label='Charge per kg'
									className='lg:w-48'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.WEIGHT}.active`)}
								/>
								<NumberInput
									disabled={!quoteConfigForm.values.rateChargeRules[ChargeUnitType.WEIGHT].active}
									required
									size='sm'
									radius={0}
									precision={2}
									step={0.05}
									min={0}
									max={100}
									placeholder='Charge'
									{...quoteConfigForm.getInputProps(`rateChargeRules.${ChargeUnitType.WEIGHT}.value`)}
									icon={<span className='text-voyage-grey'>£</span>}
								/>
							</Group>
						</Stack>
						<Stack align='center' py={20}>
							<Button type='submit' className='bg-secondary hover:bg-secondary-600'>
								Save Changes
							</Button>
						</Stack>
					</form>
				</section>
			</div>
		</Container>
	);
};

export default Financial;
