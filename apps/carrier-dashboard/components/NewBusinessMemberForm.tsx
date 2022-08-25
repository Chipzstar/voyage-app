import React from 'react';
import { Box, Button, Divider, Group, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { NewBusinessMember } from '../utils/types';

const NewBusinessMemberForm = ({ opened, type, onClose, onSubmit }) => {
	const form = useForm<NewBusinessMember>({
		initialValues: {
			fullName: '',
			firstname: '',
			lastname: '',
			email: '',
			jobTitle: '',
			dob: '',
			address: {
				line1: '',
				line2: '',
				city: '',
				postcode: ''
			}
		}
	});
	return (
		<Modal
			centered
			opened={opened}
			onClose={onClose}
			title='Edit identity details'
			classNames={{
				title: 'text-xl font-semibold'
			}}
		>
			<div>
				<form onSubmit={form.onSubmit(onSubmit)}>
					<Box pb='xs'>
						<Group grow>
							<TextInput required placeholder='First Name' {...form.getInputProps('firstname')} />
							<TextInput required placeholder='Last Name' {...form.getInputProps('lastname')} />
						</Group>
					</Box>
					<Box pb='xs'>
						<TextInput type='email' required placeholder={'Email Address'} {...form.getInputProps('email')} />
					</Box>
					<Box pb='xs'>
						<TextInput required placeholder={'Job title'} {...form.getInputProps('jobTitle')} />
					</Box>
					<Box pb='xs'>
						<DatePicker required placeholder='Date of birth' {...form.getInputProps('dob')} />
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='address-line1' required placeholder={'Address line 1'} {...form.getInputProps('address.line1')}/>
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='address-line2' placeholder={'Address line 2'} {...form.getInputProps('address.line2')}/>
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='address-level1' required placeholder={'Town or City'} {...form.getInputProps('address.city')}/>
					</Box>
					<Box pb='xs'>
						<TextInput autoComplete='postal-code' required placeholder={'Postal Code'} {...form.getInputProps('address.postcode')}/>
					</Box>
					<Divider py='xs' />
					<Group position='right'>
						<Button type='button' color='gray' variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit' color='blue' variant='outline'>
							Save
						</Button>
					</Group>
				</form>
			</div>
		</Modal>
	);
};

NewBusinessMemberForm.propTypes = {};

export default NewBusinessMemberForm;
