import React, { useCallback, useMemo, useState } from 'react';
import { Button, Center, Container, Group, Loader, Select, Stack, TextInput } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { BankAccountForm, Carrier, SignupStatus } from '../../utils/types';
import { createBankAccount, editCarrier } from '../../store/feature/profileSlice'
import { useForm } from '@mantine/form';
import { countries, notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { Check, X } from 'tabler-icons-react';

const formatAccNumber = (accNumber: string): string => {
	return accNumber ? '****' + accNumber : undefined;
};

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

	const handleSubmit = useCallback(async values => {
		setLoading(true)
		values.sortCode = formatCode(values.sortCode);
		let payload = { ...values, accountId: carrierInfo?.stripe.accountId, status: carrierInfo.status };
		try {
			await dispatch(createBankAccount(payload)).unwrap();
			notifySuccess('update-bank-details-success', 'Bank details updated successfully', <Check size={20} />);
			if (carrierInfo.status === SignupStatus.BANK_ACCOUNT) {
				dispatch(editCarrier({...carrierInfo, status: SignupStatus.DOCUMENTS }))
				nextTab();
			}
		} catch (e) {
			console.error(e);
			notifyError('update-bank-details-failed', e.message, <X size={20} />);
			setLoading(false)
		}
	}, [carrierInfo]);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex h-full flex-col'>
				<section className='border-voyage-grey flex h-full flex-col items-center justify-center'>
					<header className='page-header my-6'>Bank Account Details</header>
					<form onSubmit={form.onSubmit(handleSubmit)}>
						<Stack className='md:w-196'>
							<TextInput required label='Account Holder Name' radius={0} {...form.getInputProps('accountHolderName')} />
							<Group grow>
								<TextInput
									required={!bankAccount}
									disabled={!!bankAccount}
									label='Sort Code'
									radius={0}
									minLength={6}
									maxLength={6}
									value={form.values.sortCode}
									onChange={event => form.setFieldValue('sortCode', event.currentTarget.value)}
								/>
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
								{!!bankAccount && <Button disabled size='md' type='button' color='red' className='bg-red-500 hover:bg-red-600'>
									<span>Delete Bank Account</span>
								</Button>}
							</Group>
						</Stack>
					</form>
				</section>
			</Center>
		</Container>
	);
};

export default Financial;
