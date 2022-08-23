import React, { useCallback, useState } from 'react';
import { useForm, yupResolver } from '@mantine/form';
import { signupSchema2 } from '../../validation';
import { Anchor, Box, Button, Loader, Stack, Text, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PUBLIC_PATHS } from 'apps/carrier-dashboard/utils/constants';
import { Check } from 'tabler-icons-react';
import { notifySuccess } from '../../utils/functions';

const Step1 = ({ nextStep, prevStep }) => {
	const [loading, setLoading] = useState(false);
	const form = useForm({
		initialValues: {
			line1: '',
			line2: '',
			city: '',
			region: '',
			postcode: '',
			country: ''
		},
		validate: yupResolver(signupSchema2)
	});

	const handleSignUp = useCallback(values => {
		setLoading(true);
		setTimeout(() => {
			notifySuccess('account-creation-success', 'Account created!', <Check size={20} />);
			nextStep();
		}, 5000);
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
						<TextInput size='md' radius={0} placeholder='Address Line 1' {...form.getInputProps('line1')} />
					</Box>
					<Box pb='xs'>
						<TextInput size='md' radius={0} placeholder='Address Line 2' {...form.getInputProps('line2')} />
					</Box>
					<Box pb='xs'>
						<TextInput size='md' radius={0} placeholder='City' {...form.getInputProps('city')} />
					</Box>
					<Box pb='xs'>
						<TextInput size='md' radius={0} placeholder='Region' {...form.getInputProps('region')} />
					</Box>
					<Box pb='xs'>
						<TextInput size='md' radius={0} placeholder='Postcode' {...form.getInputProps('postcode')} />
					</Box>
					<Box pb='xs'>
						<TextInput size='md' radius={0} placeholder='Country' {...form.getInputProps('country')} />
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
