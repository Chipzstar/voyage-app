import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from '@mantine/form';
import { Box, Button, Center, Checkbox, CloseButton, Group, Loader, Paper, Radio, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core';
import { InfoCircle } from 'tabler-icons-react';
import { useSelector } from 'react-redux';
import { useNewCarrier } from '../../store/feature/profileSlice';

const Step3 = ({ nextStep, prevStep }) => {
	const [loading, setLoading] = useState(false);
	const [directorForm, showNewDirectorForm] = useState(false);
	const newCarrier = useSelector(useNewCarrier);
	const form = useForm({
		initialValues: {
			isOwner: false,
			onlyOwner: 'no',
			isDirector: false,
			onlyDirector: 'no',
			owners: [
				{
					fullName: 'Chisom Oguibe',
					email: 'chisom.oguibe@googlemail.com'
				}
			],
			directors: [
				{
					fullName: 'Ola Oladapo',
					email: 'ola@usevoyage.com'
				}
			]
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
			console.log("isOwner:", form.values.isOwner)
			const { checked } = event.currentTarget
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
				form.removeListItem('owners', 0)
			}
		},
		[form.values.isOwner]
	);

	const toggleDirectors = useCallback(
		event => {
			const { checked } = event.currentTarget
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
				form.removeListItem('directors', 0)
			}
		},
		[form.values.isDirector]
	);

	const submitDisabled = useMemo(() => {
		// disable submitting if....
		// if representative has not stated that he/she is either a company owner/director
		if (!(form.values.isOwner || form.values.isDirector)) {
			return true;
		}
		// if stated that there is more than one owner, but no other owner has been added yet
		else if (form.values.onlyOwner === "no" && form.values.owners.length < 2){
			return true
		}
		// if stated that there is more than one director, but no other director has been added yet
		else if (form.values.onlyDirector === "no" && form.values.directors.length < 2) {
			return true
		}
		return false
	}, [form.values]);

	const handleSignUp = useCallback(async values => {
		alert(JSON.stringify(values));
	}, []);

	return (
		<div className='flex h-full w-full flex-col items-center justify-center'>
			<figure className='mb-4 flex flex-row items-center justify-center space-x-2'>
				<img src={'/static/images/logo.svg'} alt='' />
				<span className='mb-1 text-2xl font-bold'>voyage</span>
			</figure>
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
											{index > 0 && <CloseButton aria-label='Close modal' onClick={() => form.removeListItem('owners', index)}/>}
										</Group>
									</Paper>
								))}
								<Button disabled={form.values.onlyOwner === "yes"} variant='outline' color='gray' size='lg' radius={0} onClick={() => showNewDirectorForm(true)}>
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
											{index > 0 && <CloseButton aria-label='Close modal' onClick={() => form.removeListItem('directors', index)}/>}
										</Group>
									</Paper>
								))}
								<Button disabled={form.values.onlyDirector === "yes"} variant='outline' color='gray' size='lg' radius={0} onClick={() => showNewDirectorForm(true)}>
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
