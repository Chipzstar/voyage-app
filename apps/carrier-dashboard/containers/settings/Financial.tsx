import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Center, Container, Group, Loader, Popover, Select, Stack, Text, TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { BankAccountForm, Carrier, ActivationStatus } from '../../utils/types';
import { createBankAccount, editCarrier, updateCarrier } from '../../store/features/profileSlice';
import { useForm } from '@mantine/form';
import { countries, notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { Check, X } from 'tabler-icons-react';
import { useInterval } from '@mantine/hooks';
import SortCodeInput from '../../components/SortCodeInput';
import AccountActivation from '../../modals/AccountActivation';

const formatAccNumber = (accNumber: string): string => (accNumber ? '****' + accNumber : undefined);

const formatCode = codeText => {
	return codeText
		.replace(' ', '')
		.replace('-', '')
		.match(/.{1,2}/g)
		.join('-');
};

interface FinancialProps {
	carrierInfo: Carrier;
}

const Financial = forwardRef<HTMLDivElement, FinancialProps>(({ carrierInfo }, ref) => {
	const [loading, setLoading] = useState(false);
	const [activation, setActivation] = useState(false);
	const dispatch = useDispatch<AppDispatch>();

	const bankAccount = useMemo(() => carrierInfo?.stripe?.bankAccount, [carrierInfo]);

	const form = useForm<BankAccountForm>({
		initialValues: {
			accountId: carrierInfo?.stripe?.accountId ?? '',
			id: bankAccount?.id ?? undefined,
			currency: bankAccount?.currency ?? 'GBP',
			country: bankAccount?.country ?? 'GB',
			accountHolderName: bankAccount?.accountHolderName ?? '',
			sortCode: bankAccount?.sortCode ?? '',
			last4: formatAccNumber(bankAccount?.last4) ?? ''
		}
	});

	const handleSubmit = useCallback(
		async values => {
			setLoading(true);
			let payload = { ...values, accountId: carrierInfo?.stripe.accountId, status: carrierInfo.status };
			try {
				await dispatch(createBankAccount(payload)).unwrap();
				notifySuccess('create-bank-account-success', 'Bank details added successfully', <Check size={20} />);
				setLoading(false);
				if (carrierInfo.status === ActivationStatus.BANK_ACCOUNT) {
					dispatch(editCarrier({ ...carrierInfo, status: ActivationStatus.DOCUMENTS }));
				}
			} catch (e) {
				console.error(e);
				notifyError('update-bank-details-failed', e.message, <X size={20} />);
				setLoading(false);
			}
		},
		[carrierInfo]
	);

	return (
		<Container ref={ref} fluid className='tab-container bg-voyage-background'>
			<AccountActivation opened={activation} onClose={() => setActivation(false)} />
			<Center className='flex h-full flex-col'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center'>
					<header className='page-header my-6'>Bank Account Details</header>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Stack className='md:w-196'>
							<TextInput required label='Account Holder Name' radius={0} {...form.getInputProps('accountHolderName')} />
							<Group grow>
								<div>
									<SortCodeInput
										onChange={event => {
											console.log(event.currentTarget.value);
											form.setFieldValue('sortCode', event.currentTarget.value);
										}}
										value={form.values.sortCode}
										required={!bankAccount}
										disabled={!!bankAccount}
									/>
								</div>
								<TextInput required={!bankAccount} disabled={!!bankAccount} label='Account Number' radius={0} minLength={8} {...form.getInputProps('last4')} />
							</Group>
							<Group grow>
								<Select
									required={!bankAccount}
									disabled={!!bankAccount}
									searchable
									label='Country'
									radius={0}
									data={countries.map(
										(country): SelectInputData => ({
											label: country.name,
											value: country.code
										})
									)}
									{...form.getInputProps('country')}
								/>
								<Select disabled={bankAccount} required={!bankAccount} searchable readOnly label='Currency' radius={0} data={['GBP', 'EUR', 'USD']} {...form.getInputProps('currency')} />
							</Group>
							<Group position='right' py={6} spacing="xl">
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
								{carrierInfo.status !== ActivationStatus.COMPLETE && (
									<Popover width={250} opened transition='fade' transitionDuration={500} position='bottom' withArrow shadow='md'>
										<Popover.Target>
											<Button
												variant='subtle'
												size='md'
												type='button'
												color='gray'
												onClick={() =>
													dispatch(
														updateCarrier({
															...carrierInfo,
															status: ActivationStatus.COMPLETE
														})
													)
														.unwrap()
														.then(() => setActivation(true))
												}
											>
												<span>Skip</span>
											</Button>
										</Popover.Target>
										<Popover.Dropdown className="text-center">
											<Text size='sm'>Click "Skip" to fill in later and complete registration.</Text>
											<Text size='sm' weight={600}>You must provide your bank details before you can book loads</Text>
										</Popover.Dropdown>
									</Popover>
								)}
							</Group>
						</Stack>
					</form>
				</section>
			</Center>
		</Container>
	);
});

export default Financial;
