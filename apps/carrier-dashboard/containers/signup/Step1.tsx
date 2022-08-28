import React, { useCallback, useState } from 'react';
import { useForm, yupResolver } from '@mantine/form';
import { signupSchema1 } from '../../validation';
import { Anchor, Box, Button, Center, Group, Loader, PasswordInput, Stack, Text, TextInput, Tooltip } from '@mantine/core';
import Link from 'next/link';
import { phoneUtil, PUBLIC_PATHS } from 'apps/carrier-dashboard/utils/constants';
import { PhoneNumberFormat as PNF } from 'google-libphonenumber';
import { Calendar, InfoCircle } from 'tabler-icons-react';
import { saveNewCarrier } from '../../store/feature/profileSlice';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { NewCarrier } from '../../utils/types';
import { DatePicker } from '@mantine/dates';

const Step1 = ({ nextStep }) => {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const form = useForm<Partial<NewCarrier>>({
		initialValues: {
			dob: '',
			fullName: '',
			firstname: '',
			lastname: '',
			company: '',
			email: '',
			phone: '',
			crn: undefined,
			jobTitle: '',
			website: '',
			password: '',
			confirmPassword: ''
		},
		validate: yupResolver(signupSchema1)
	});

	const handleSignUp = useCallback(values => {
		setLoading(true);
		const number = phoneUtil.parseAndKeepRawInput(values.phone, 'GB');
		if (phoneUtil.getRegionCodeForNumber(number) === 'GB') {
			const E164Number = phoneUtil.format(number, PNF.E164);
			console.log('E164Number:', E164Number);
			values.phone = E164Number;
		}
		values.fullName = `${values.firstname} ${values.lastname}`;
		dispatch(saveNewCarrier(values));
		setTimeout(() => {
			nextStep();
			setLoading(false);
		}, 3000);
	}, []);

	const valid = form.values.password.trim().length >= 6;
	return (
		<div className='flex h-full w-full items-center justify-center'>
			<form onSubmit={form.onSubmit(handleSignUp)} className='w-196 flex flex-col space-y-6'>
				<figure className='flex flex-row items-center justify-center space-x-2'>
					<img src={'/static/images/logo.svg'} alt='' />
					<span className='mb-1 text-2xl font-bold'>voyage</span>
				</figure>
				<Stack>
					<Group grow pb='xs'>
						<TextInput size='md' radius={0} placeholder='First Name' {...form.getInputProps('firstname')} />
						<TextInput size='md' radius={0} placeholder='Last Name' {...form.getInputProps('lastname')} />
					</Group>
					<Group grow pb='xs'>
						<TextInput type='email' size='md' radius={0} placeholder='Work Email' {...form.getInputProps('email')} />
						<TextInput size='md' radius={0} placeholder='Company Phone Number' {...form.getInputProps('phone')} />
					</Group>
					<Group grow pb='xs'>
						<TextInput
							size='md'
							radius={0}
							placeholder='Legal Company Name'
							{...form.getInputProps('company')}
							rightSection={
								<Tooltip
									multiline
									width={250}
									title='Companies House Registration Number'
									label="The name must exactly match the name associated with your company's tax ID"
									position='top-end'
									withArrow
									transition='pop-bottom-right'
								>
									<Text color='dimmed' sx={{ cursor: 'help' }}>
										<Center>
											<InfoCircle size={18} />
										</Center>
									</Text>
								</Tooltip>
							}
						/>
						<TextInput
							type='number'
							size='md'
							radius={0}
							placeholder='CRN'
							rightSection={
								<Tooltip
									multiline
									width={250}
									title='Companies House Registration Number'
									label='7 or 8-digit Company Number. Can be found at https://find-and-update.company-information.service.gov.uk/'
									position='top-end'
									withArrow
									transition='pop-bottom-right'
								>
									<Text color='dimmed' sx={{ cursor: 'help' }}>
										<Center>
											<InfoCircle size={18} />
										</Center>
									</Text>
								</Tooltip>
							}
							{...form.getInputProps('crn')}
						/>
					</Group>
					{/*<Group grow pb='xs'>
						<DatePicker size='md' radius={0} placeholder='Date of birth' {...form.getInputProps('dob')} icon={<Calendar size={18} />} />
						<TextInput size='md' radius={0} placeholder='Job Title / Role' {...form.getInputProps('jobTitle')} />
					</Group>*/}
					{/*<Box pb='xs'>
						<TextInput
							size='md'
							radius={0}
							placeholder='Company Website'
							{...form.getInputProps('website')}
							rightSection={
								<Tooltip
									multiline
									width={250}
									label='No website? You can share an app store link, a business social media profile, or add a product description instead.'
									position='top-end'
									withArrow
									transition='pop-bottom-right'
								>
									<Text color='dimmed' sx={{ cursor: 'help' }}>
										<Center>
											<InfoCircle size={18} />
										</Center>
									</Text>
								</Tooltip>
							}
						/>
					</Box>*/}
					<Box pb='xs'>
						<Tooltip label={valid ? 'All good!' : 'Password must include at least 6 characters'} position='bottom-start' withArrow opened={opened} color={valid ? 'teal' : undefined}>
							<PasswordInput size='md' onFocus={() => setOpened(true)} onBlur={() => setOpened(false)} placeholder='Password' radius={0} {...form.getInputProps('password')} />
						</Tooltip>
					</Box>
					<Box pb='xs'>
						<PasswordInput size='md' placeholder='Confirm Password' radius={0} {...form.getInputProps('confirmPassword')} />
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
