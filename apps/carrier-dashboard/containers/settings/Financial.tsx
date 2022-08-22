import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Button, Center, Container, Group, Loader, Select, Stack, TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { PaymentMethod } from '@stripe/stripe-js';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { BankAccountForm, StripeDetails } from '../../utils/types';
import { createBankAccount, updateCarrier } from '../../store/feature/profileSlice';
import { useForm } from '@mantine/form';
import { countries } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { notifyError, notifySuccess } from '../../utils/functions';
import { Check, X } from 'tabler-icons-react';

const formatAccNumber = (accNumber: string): string => {
	return accNumber ? '****' + accNumber : undefined
}

const formatCode = codeText => {
	return codeText
		.replace(' ', '')
		.replace('-', '')
		.match(/.{1,2}/g)
		.join('-');
};

const Financial = ({ carrierInfo }) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();

	const bankAccount = useMemo(() => {
		return carrierInfo?.stripe?.bankAccount;
	}, [carrierInfo]);

	const form = useForm<BankAccountForm>({
		initialValues: {
			accountId: carrierInfo?.stripe?.accountId ?? '',
			id: bankAccount?.id ?? '',
			currency: bankAccount?.currency ?? 'GBP',
			country: bankAccount?.country ?? 'GB',
			accountHolderName: bankAccount?.accountHolderName ??'',
			sortCode: bankAccount?.sortCode ?? '',
			last4: formatAccNumber(bankAccount?.last4) ?? '',
		}
	});

	const submitPaymentInfo = useCallback(async paymentIntent => {
		try {
			const paymentMethod: PaymentMethod = (
				await axios.put(`/api/stripe/payment-method/${paymentIntent.payment_method}`, {
					customer: carrierInfo.stripe.customerId
				})
			).data;
			let data: StripeDetails = {
				...carrierInfo.stripe,
				paymentMethod: {
					id: paymentMethod.id ?? paymentIntent.payment_method,
					fingerprint: paymentMethod.card.fingerprint,
					brand: paymentMethod.card.brand,
					last4: paymentMethod.card.last4,
					expMonth: paymentMethod.card.exp_month,
					expYear: paymentMethod.card.exp_year
				}
			};
			await dispatch(updateCarrier({ ...carrierInfo, stripe: data })).unwrap();
			return 'Payment Added successfully';
		} catch (e) {
			throw e;
		}
	}, []);

	const handleSubmit = useCallback(async values => {
		values.sortCode = formatCode(values.sortCode);
		let payload = {...values, accountId: carrierInfo?.stripe.accountId }
		console.log(payload)
		try {
			const carrier = await dispatch(createBankAccount(payload)).unwrap();
			notifySuccess('update-bank-details-success', 'Bank details updated successfully', <Check size={20} />)
		}
		catch (e) {
			console.error(e)
			notifyError('update-bank-details-failed', e.message, <X size={20} />)
		}
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex h-full flex-col'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center'>
					<header className='page-header my-6'>Bank Account Details</header>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Stack className='md:w-196'>
							<TextInput required label='Account Holder Name' radius={0} {...form.getInputProps('accountHolderName')} />
							<Group grow>
								<TextInput required={!bankAccount} disabled={bankAccount} label='Sort Code' radius={0} minLength={6} maxLength={6} value={form.values.sortCode} onChange={event => form.setFieldValue('sortCode', event.currentTarget.value)} />
								<TextInput required={!bankAccount} disabled={bankAccount} label='Account Number' radius={0} minLength={8} {...form.getInputProps('last4')} />
							</Group>
							<Group grow>
								<Select
									required={!bankAccount}
									disabled={bankAccount}
									searchable
									label='Country'
									radius={0}
									{...form.getInputProps('country')}
									data={countries.map(
										(country): SelectInputData => ({
											label: country.name,
											value: country.code
										})
									)}
								/>
								<Select disabled={bankAccount} required={!bankAccount} searchable readOnly label='Currency' radius={0} data={['GBP', 'EUR', 'USD']} {...form.getInputProps('currency')} />
							</Group>
							<Group position='right' py={6}>
								<Button
									disabled={!!bankAccount}
									size='md'
									type='submit'
									classNames={{
										root: 'bg-secondary hover:bg-secondary-600'
									}}
								>
									<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
									<span>Save Changes</span>
								</Button>
								<Button
									size='md'
									type='button'
									color="red"
									className="bg-red-500 hover:bg-red-600"
								>
									<span>Delete Bank Account</span>
								</Button>
							</Group>
						</Stack>
					</form>
				</section>
			</Center>
		</Container>
	);
};

export default Financial;
