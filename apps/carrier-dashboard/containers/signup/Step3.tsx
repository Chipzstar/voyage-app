import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { Box, Button, Center, Checkbox, CloseButton, Group, Loader, Paper, Radio, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core';
import { Check, InfoCircle, X } from 'tabler-icons-react';
import { useSelector } from 'react-redux';
import { useNewCarrier } from '../../store/feature/profileSlice';
import NewBusinessMemberForm from 'apps/carrier-dashboard/modals/NewBusinessMemberForm';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_PUBLIC_KEY } from '../../utils/constants';
import { NewBusinessMember } from '../../utils/types';
import moment from 'moment';
import { notifyError, notifySuccess } from '../../utils/functions';
import axios from 'axios';

const MEMBER_TYPES = {
	OWNER: 'owner',
	DIRECTOR: 'director'
};

interface BusinessManagementForm {
	isOwner: boolean;
	onlyOwner: 'yes' | 'no';
	isDirector: boolean;
	onlyDirector: 'yes' | 'no';
	owners: NewBusinessMember[];
	directors: NewBusinessMember[];
}

const Stripe = await loadStripe(String(STRIPE_PUBLIC_KEY));

const Step3 = ({ nextStep, prevStep }) => {
	const [loading, setLoading] = useState(false);
	const [executiveForm, showNewExecForm] = useState({
		show: false,
		type: null
	});
	const newCarrier = useSelector(useNewCarrier);
	const form = useForm<BusinessManagementForm>({
		initialValues: {
			isOwner: false,
			onlyOwner: 'yes',
			isDirector: false,
			onlyDirector: 'yes',
			owners: [],
			directors: []
		}
	});

	useEffect(() => {
		const storedValue = window.localStorage.getItem('management-form');
		if (storedValue) {
			try {
				form.setValues(JSON.parse(window.localStorage.getItem('management-form')));
			} catch (e) {
				console.log('Failed to parse stored value');
			}
		}
	}, []);

	const toggleOwners = useCallback(
		event => {
			console.log('isOwner:', form.values.isOwner);
			const { checked } = event.currentTarget;
			form.setFieldValue('isOwner', checked);
			if (checked) {
				form.insertListItem(
					'owners',
					{
						...newCarrier
					},
					0
				);
			} else {
				form.removeListItem('owners', 0);
			}
		},
		[form.values.isOwner]
	);

	const toggleDirectors = useCallback(
		event => {
			const { checked } = event.currentTarget;
			form.setFieldValue('isDirector', checked);
			if (checked) {
				form.insertListItem(
					'directors',
					{
						...newCarrier
					},
					0
				);
			} else {
				form.removeListItem('directors', 0);
			}
		},
		[form.values.isDirector]
	);

	const submitDisabled = useMemo(() => {
		// disable submitting if....
		// if representative has not stated that he/she is either a company owner/director
		let isDisabled = false;
		if (!(form.values.isOwner || form.values.isDirector)) {
			console.log('check 1');
			isDisabled = true;
		}
		// if stated that there is more than one owner, but no other owner has been added yet
		else if (form.values.onlyOwner === 'no' && form.values.owners.length < 2) {
			console.log('check 2');
			isDisabled = true;
		}
		// if stated that there is more than one director, but no other director has been added yet
		else if (form.values.onlyDirector === 'no' && form.values.directors.length < 2) {
			console.log('check 3');
			isDisabled = true;
		}
		console.log('isDisabled', isDisabled);
		return isDisabled;
	}, [form.values]);

	const handleSignUp = useCallback(async (values: BusinessManagementForm) => {
		setLoading(true);
		let ownerTokens = [];
		let directorTokens = [];
		try {
			if (values.owners.length) {
				ownerTokens = await Promise.all(
					values.owners.map(async (owner: NewBusinessMember, index) => {
						if (index === 0 && values.isOwner) return;
						try {
							const { token } = await Stripe.createToken('person', {
								email: owner.email,
								dob: {
									day: moment(owner.dob).date(),
									month: moment(owner.dob).month(),
									year: moment(owner.dob).year()
								},
								first_name: owner.firstname,
								last_name: owner.lastname,
								address: {
									line1: owner.address.line1,
									line2: owner.address.line2,
									city: owner.address.city,
									postal_code: owner.address.postcode
								},
								relationship: {
									owner: true,
									executive: true
								}
							});
							return token;
						} catch (error) {
							throw error;
						}
					})
				);
				console.log(ownerTokens);
			}
			if (values.directors.length) {
				directorTokens = await Promise.all(
					values.directors.map(async (director: NewBusinessMember, index) => {
						if (index === 0 && values.isOwner) return;
						try {
							const { token } = await Stripe.createToken('person', {
								email: director.email,
								dob: {
									day: moment(director.dob).date(),
									month: moment(director.dob).month(),
									year: moment(director.dob).year()
								},
								first_name: director.firstname,
								last_name: director.lastname,
								address: {
									line1: director.address.line1,
									line2: director.address.line2,
									city: director.address.city,
									postal_code: director.address.postcode
								},
								relationship: {
									director: true
								}
							});
							return token;
						} catch (error) {
							throw error;
						}
					})
				);
				console.log(directorTokens);
			}
			// create persons using owner tokens
			await Promise.all(ownerTokens.map(async token => token && (await axios.post(`/api/stripe/accounts/${newCarrier.accountId}/person`, token))));
			// create persons using director tokens
			await Promise.all(directorTokens.map(async token => token && (await axios.post(`/api/stripe/accounts/${newCarrier.accountId}/person`, token))));
			// update details about the representative
			const { token: personToken } = await Stripe.createToken('person', {
				relationship: {
					owner: values.isOwner,
					executive: values.isOwner || values.isDirector,
					director: values.isDirector
				}
			});
			const person = (await axios.put(`/api/stripe/accounts/${newCarrier.accountId}/person/${newCarrier.personId}`, personToken)).data;
			console.log('PERSON', person);
			// approve management has all been correctly added by representative
			const { token: accountToken } = await Stripe.createToken('account', {
				company: {
					owners_provided: true,
					directors_provided: true,
					executives_provided: true
				}
			});
			const account = (await axios.put(`/api/stripe/accounts/${newCarrier.accountId}`, accountToken)).data;
			console.log('ACCOUNT', account);
			notifySuccess('add-business-managers-success', 'Business managers added successfully', <Check size={20} />);
			setTimeout(() => {
				setLoading(false);
				nextStep();
			}, 500);
		} catch (e) {
			console.error(e);
			notifyError('add-business-managers-failure', `There was an error adding your business managers ${e.message}`, <X size={20} />);
			setLoading(false);
		}
	}, []);

	const handleNewMember = useCallback(
		async values => {
			values.fullName = values.firstname + ' ' + values.lastname;
			console.log(values);
			if (executiveForm.type === MEMBER_TYPES.DIRECTOR) {
				form.insertListItem('directors', values);
			} else {
				form.insertListItem('owners', values);
			}
			showNewExecForm(prevState => ({ ...prevState, show: false }));
		},
		[executiveForm]
	);

	return (
		<div className='flex h-full w-full flex-col items-center justify-center'>
			<figure className='mb-4 flex flex-row items-center justify-center space-x-2'>
				<img src={'/static/images/logo.svg'} alt='' />
				<span className='mb-1 text-2xl font-bold'>voyage</span>
			</figure>
			<NewBusinessMemberForm opened={executiveForm.show} type={executiveForm.type} onClose={() => showNewExecForm(prevState => ({ ...prevState, show: false }))} onSubmit={handleNewMember} />
			<form onSubmit={form.onSubmit(handleSignUp)} className='w-full space-y-4 px-6'>
				<SimpleGrid cols={2} spacing='lg'>
					<div className='space-y-4 pb-2'>
						<Group align='center' position='center'>
							<Checkbox size='sm' label='I am an owner of the company' checked={form.values.isOwner} onChange={toggleOwners} />
							<Tooltip label='You own at least 25% of the company' position='top-end' withArrow transition='pop-bottom-right'>
								<Text color='dimmed' sx={{ cursor: 'help' }}>
									<Center>
										<InfoCircle size={18} />
									</Center>
								</Text>
							</Tooltip>
						</Group>
						<Radio.Group
							classNames={{
								root: !form.values.isOwner && 'hidden'
							}}
							label='Are you the only person who owns 25% or more of the company?'
							required
							{...form.getInputProps('onlyOwner')}
						>
							<Radio size='sm' value='yes' label='Yes' />
							<Radio size='sm' value='no' label='No' />
						</Radio.Group>
						<Box className='space-y-3'>
							<header className='pb-3'>
								<Text size='xl' weight='bold'>
									Add your business owners
								</Text>
							</header>
							<span className='text-sm text-gray-600'>Due to regulatory guidelines, we’re required to collect information about anyone who has significant ownership of your business.</span>

							<p className='font-semibold'>Please add any individual who owns 25% or more of {newCarrier.company}.</p>
							<Stack>
								{form.values.owners.map((owner, index) => (
									<Paper p='md' withBorder className='bg-slate-50'>
										<Group position='apart' align='start'>
											<Stack spacing={0}>
												<span className='text-lg font-medium'>{owner.fullName}</span>
												<span className='text-sm'>{owner.email}</span>
											</Stack>
											{index > 0 && <CloseButton aria-label='Close modal' onClick={() => form.removeListItem('owners', index)} />}
										</Group>
									</Paper>
								))}
								<Button
									disabled={form.values.onlyOwner === 'yes'}
									variant='outline'
									color='gray'
									size='lg'
									radius={0}
									onClick={() =>
										showNewExecForm(prevState => ({
											show: true,
											type: MEMBER_TYPES.OWNER
										}))
									}
								>
									<Text>+ Add Another Owner</Text>
								</Button>
							</Stack>
						</Box>
					</div>
					<div className='space-y-4 pb-2'>
						<Group align='center' position='center'>
							<Checkbox size='sm' label='I am a member of the governing body of the company' checked={form.values.isDirector} onChange={toggleDirectors} />
						</Group>
						<Radio.Group
							classNames={{
								root: !form.values.isDirector && 'hidden'
							}}
							label='Are you the only person on the governing board of the company?'
							required
							{...form.getInputProps('onlyDirector')}
						>
							<Radio size='sm' value='yes' label='Yes' />
							<Radio size='sm' value='no' label='No' />
						</Radio.Group>
						<Box className='space-y-3'>
							<header className='pb-3'>
								<Text size='xl' weight='bold'>
									Add your business directors
								</Text>
							</header>
							<span className='text-sm text-gray-600'>Due to regulations, we’re required to collect information about a company’s directors.</span>

							<p className='font-semibold'>Please list all individuals who are members of the governing board of {newCarrier.company}.</p>
							<Stack>
								{form.values.directors.map((owner, index) => (
									<Paper p='md' withBorder className='bg-slate-50'>
										<Group position='apart' align='start'>
											<Stack spacing={0}>
												<span className='text-lg font-medium'>{owner.fullName}</span>
												<span className='text-sm'>{owner.email}</span>
											</Stack>
											{index > 0 && <CloseButton aria-label='Close modal' onClick={() => form.removeListItem('directors', index)} />}
										</Group>
									</Paper>
								))}
								<Button
									disabled={form.values.onlyDirector === 'yes'}
									variant='outline'
									color='gray'
									size='lg'
									radius={0}
									onClick={() =>
										showNewExecForm(prevState => ({
											show: true,
											type: MEMBER_TYPES.DIRECTOR
										}))
									}
								>
									<Text>+ Add Another Director</Text>
								</Button>
							</Stack>
						</Box>
					</div>
				</SimpleGrid>
				<div className='flex flex-col items-center space-y-4'>
					<Button
						disabled={submitDisabled}
						type='submit'
						color='dark'
						radius={0}
						size='md'
						classNames={{
							root: 'bg-black w-256'
						}}
						className='text-normal h-12 w-full text-center text-white'
					>
						{loading && <Loader size='xs' className='mr-2' />}
						<Text color='white' size='lg' weight={400}>
							Continue
						</Text>
					</Button>
					<span role='button' onClick={() => prevStep()} className='hover:underline'>
						Go Back
					</span>
				</div>
			</form>
		</div>
	);
};

export default Step3;
