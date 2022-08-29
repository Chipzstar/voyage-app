import React, { useCallback, useEffect, useState } from 'react';
import { useForm, yupResolver } from '@mantine/form';
import { signupSchema2 } from '../../validation';
import { Anchor, Box, Button, Loader, Select, Stack, Text, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PUBLIC_PATHS, STRIPE_PUBLIC_KEY } from 'apps/carrier-dashboard/utils/constants';
import { loadStripe } from '@stripe/stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { createCarrier, saveNewCarrier, useNewCarrier } from '../../store/feature/profileSlice';
import { Address } from '../../utils/types';
import { countries, isValidUrl } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { notifyError, notifySuccess } from 'apps/carrier-dashboard/utils/functions';
import { Check, X } from 'tabler-icons-react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { AppDispatch } from 'apps/carrier-dashboard/store';

const Stripe = await loadStripe(String(STRIPE_PUBLIC_KEY));

const Step1 = ({ nextStep, prevStep }) => {
	const [loading, setLoading] = useState(false);
	const newCarrier = useSelector(useNewCarrier);
	const dispatch = useDispatch<AppDispatch>();
	useEffect(() => console.log(newCarrier), [newCarrier]);

	const form = useForm<Address>({
		initialValues: {
			line1: '',
			line2: '',
			city: '',
			region: '',
			postcode: '',
			country: 'GB'
		},
		validate: yupResolver(signupSchema2)
	});

	const handleSignUp = useCallback(async (values: Address) => {
		setLoading(true);
		try {
			// generate secure tokens to create account + person in stripe
			const isUrlValid = isValidUrl(newCarrier.website);
			// @ts-ignore
			const accountResult = await Stripe.createToken('account', {
				business_type: 'company',
				company: {
					name: newCarrier.company,
					phone: newCarrier.phone,
					address: {
						line1: values.line1,
						line2: values.line2,
						city: values.city,
						state: values.region,
						postal_code: values.postcode,
						country: values.country
					}
				},
				tos_shown_and_accepted: true
			});
			console.log('Account', accountResult);
			// @ts-ignore
			const account = (
				await axios.post('/api/stripe/accounts', {
					token: accountResult.token,
					business_profile: {
						mcc: '4214'
						/*url: isUrlValid ? newCarrier.website : '',
						product_description: !isUrlValid ? newCarrier.website : ''*/
					}
				})
			).data;
			dispatch(saveNewCarrier({ accountId: account.id } ));
			await dispatch(createCarrier(newCarrier)).unwrap();
			await signIn('credentials', {
				email: newCarrier.email,
				password: newCarrier.password,
				redirect: false
			});
			notifySuccess('create-business-address-success', 'Business Address saved successfully!', <Check size={20} />);
			setTimeout(() => {
				setLoading(false);
				nextStep();
			}, 500);
		} catch (err) {
			console.error(err);
			notifyError('create-business-address-failed', `There was an error creating the business address: ${err.message}`, <X size={20} />);
			setLoading(false);
		}
	}, []);

	return (
		<div className='flex h-full w-full items-center justify-center'>
			<form onSubmit={form.onSubmit(handleSignUp)} className='w-196 flex flex-col space-y-6'>
				<figure className='flex flex-row items-center justify-center space-x-2'>
					<img src={'/static/images/logo.svg'} alt='' />
					<span className='mb-1 text-2xl font-bold'>voyage</span>
				</figure>
				<Stack>
					<Box pb='xs'>
						<TextInput autoComplete='address-line1' size='md' radius={0} placeholder='Address Line 1' {...form.getInputProps('line1')} />
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='address-line2' size='md' radius={0} placeholder='Address Line 2' {...form.getInputProps('line2')} />
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='address-level1' size='md' radius={0} placeholder='City' {...form.getInputProps('city')} />
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='address-level2' size='md' radius={0} placeholder='Region' {...form.getInputProps('region')} />
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='postal-code' size='md' radius={0} placeholder='Postcode' {...form.getInputProps('postcode')} />
					</Box>
					<Box pb='xs'>
						<Select
							searchable
							placeholder='Country'
							radius={0}
							size='md'
							data={countries.map(
								(country): SelectInputData => ({
									label: country.name,
									value: country.code
								})
							)}
							{...form.getInputProps('country')}
						/>
					</Box>
				</Stack>
				<div className='flex flex-col items-center space-y-4'>
					<Button
						type='submit'
						color='dark'
						radius={0}
						size='md'
						classNames={{
							root: 'bg-black'
						}}
						className='text-normal h-12 w-full text-center text-white'
					>
						{loading && <Loader size='xs' className='mr-2' />}
						<Text color='white' size='lg' weight={400}>
							Continue
						</Text>
					</Button>
					<span>
						Already have an account?&nbsp;
						<Link href={PUBLIC_PATHS.LOGIN} passHref>
							<Anchor component='a'>Login Here</Anchor>
						</Link>
					</span>
				</div>
			</form>
		</div>
	);
};

Step1.propTypes = {};

export default Step1;
