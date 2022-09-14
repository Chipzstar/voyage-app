import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Center, Container, Group, Loader, Popover, Select, Stack, Text, TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { BankAccountForm, Carrier, ActivationStatus } from '../../utils/types';
import { createBankAccount, editCarrier } from '../../store/feature/profileSlice';
import { useForm } from '@mantine/form';
import { countries, notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { Check, X } from 'tabler-icons-react';
import { useInterval } from '@mantine/hooks';
import SortCodeInput from '../../components/SortCodeInput';

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
	nextTab: () => void;
}

const Financial = ({ carrierInfo, nextTab }: FinancialProps) => {
	const [loading, setLoading] = useState(false);
	const [opened, setOpen] = useState(false);
	const interval = useInterval(() => setOpen(true), 3000);
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
					nextTab();
				}
			} catch (e) {
				console.error(e);
				notifyError('update-bank-details-failed', e.message, <X size={20} />);
				setLoading(false);
			}
		},
		[carrierInfo]
	);

	useEffect(() => {
		carrierInfo.status !== ActivationStatus.COMPLETE && interval.start();
		return interval.stop();
	}, [carrierInfo]);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Popover opened={opened} onChange={setOpen} transition='fade' transitionDuration={500} position='bottom' withArrow shadow='md'>
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
									{/*<TextInput
										required={!bankAccount}
										disabled={!!bankAccount}
										label='Sort Code'
										radius={0}
										minLength={8}
										maxLength={8}
										value={form.values.sortCode}
										onKeyDown={event => event.key === "Backspace"}
										onChange={event => {
											console.log(event)
											form.setFieldValue('sortCode', formatCode(event.currentTarget.value))
										}}
									/>*/}
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
								<Group position='right' py={6}>
									<Popover.Target>
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
									</Popover.Target>
									<Popover.Dropdown>
										<Text size='sm'>Click "Save Changes" to continue</Text>
									</Popover.Dropdown>
									{!!bankAccount && (
										<Button disabled size='md' type='button' color='red' className='bg-red-500 hover:bg-red-600'>
											<span>Delete Bank Account</span>
										</Button>
									)}
								</Group>
							</Stack>
						</form>
					</section>
				</Center>
			</Popover>
		</Container>
	);
};

export default Financial;
