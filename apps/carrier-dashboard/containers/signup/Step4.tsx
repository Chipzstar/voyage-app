import React, { useCallback, useState } from 'react';
import { createCarrier, useNewCarrier } from '../../store/feature/profileSlice';
import { signIn } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'apps/carrier-dashboard/store';
import { useForm } from '@mantine/form';
import { NewCarrier } from '../../utils/types';
import { X } from 'tabler-icons-react';
import { notifyError } from '../../utils/functions';
import { Anchor, Button, Grid, Loader, PasswordInput, SimpleGrid, Text, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PUBLIC_PATHS } from '../../utils/constants';

const Step4 = ({ prevStep }) => {
	const [loading, setLoading] = useState(false);
	const newCarrier = useSelector(useNewCarrier);
	const dispatch = useDispatch<AppDispatch>();

	const form = useForm<NewCarrier>({
		initialValues: {
			...newCarrier
		}
	});

	const handleSignUp = useCallback(async () => {
		try {
			await dispatch(createCarrier(newCarrier)).unwrap();
			await signIn('credentials', {
				email: newCarrier.email,
				password: newCarrier.password,
				redirect: false
			});
		} catch (err) {
			console.error(err);
			notifyError('signup-failure', `${err.message}`, <X size={20} />);
		}
	}, []);

	return (
		<div className='flex h-full w-full flex-col items-center justify-center'>
			<figure className='mb-8 flex flex-row items-center justify-center space-x-2'>
				<img src={'/static/images/logo.svg'} alt='' />
				<span className='mb-1 text-2xl font-bold'>voyage</span>
			</figure>
			<form onSubmit={form.onSubmit(handleSignUp)} className='w-full space-y-4 px-6'>
				<Grid gutter='lg' grow>
					<Grid.Col span={6}>
						<header className='page-subheading'>Basic Information</header>
						<SimpleGrid cols={1}>
							<TextInput size="xs" label="First Name" {...form.getInputProps('firstname')}/>
							<TextInput size="xs" label="Last Name" {...form.getInputProps('lastname')}/>
							<TextInput size="xs" label="Work Email Address" {...form.getInputProps('email')}/>
							<TextInput size="xs" label="Work Phone Number" {...form.getInputProps('phone')}/>
							<TextInput size="xs" label="Legal Company Name" {...form.getInputProps('company')}/>
							<PasswordInput label="Password" size="xs"  {...form.getInputProps('password')}/>
						</SimpleGrid>
					</Grid.Col>
					<Grid.Col span={6}>
						<header className='page-subheading'>Address Details</header>
						<SimpleGrid cols={1}>
							<TextInput size="xs" label="Address Line 1" {...form.getInputProps('address.line1')}/>
							<TextInput size="xs" label="Address Line 2" {...form.getInputProps('address.line2')}/>
							<TextInput size="xs" label="City" {...form.getInputProps('address.city')}/>
							<TextInput size="xs" label="Region" {...form.getInputProps('address.region')}/>
							<TextInput size="xs" label="Postal Code" {...form.getInputProps('address.postcode')}/>
							<TextInput size="xs" label="Country" {...form.getInputProps('address.country')}/>
						</SimpleGrid>
					</Grid.Col>
					<Grid.Col>
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
									Sign Up
								</Text>
							</Button>
							<span>
								Already have an account?&nbsp;
								<Link href={PUBLIC_PATHS.LOGIN} passHref>
									<Anchor component='a'>Login Here</Anchor>
								</Link>
							</span>
						</div>
					</Grid.Col>
				</Grid>
			</form>
		</div>
	);
};

export default Step4;
