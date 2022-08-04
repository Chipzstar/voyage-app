import React, { useCallback, useState } from 'react';
import { AccountType, Contact, Customer } from '../../../utils/types';
import { useForm } from '@mantine/form';
import { PATHS } from '../../../utils/constants';
import { Anchor, Button, Card, ScrollArea, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import PageNav from '../../../layout/PageNav';
import ContentContainer from '../../../layout/ContentContainer';
import { Check, Trash, User } from 'tabler-icons-react';
import { SelectInputData } from '@voyage-app/shared-types';
import { alphanumericId, capitalize, sanitize } from '@voyage-app/shared-utils';
import { addVehicle } from '../../../store/feature/vehicleSlice';
import { showNotification } from '@mantine/notifications';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { addCustomer } from '../../../store/feature/customerSlice'
import moment from 'moment';

const create = () => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const initialValues: Customer = {
		id: '',
		createdAt: moment().unix(),
		customerId: `CUSTOMER-ID${alphanumericId(8)}`,
		accountType: undefined,
		addressLine1: '',
		billingEmail: '',
		city: '',
		companyName: '',
		country: '',
		email: '',
		extraContacts: [],
		fullName: '',
		firstname: '',
		lastname: '',
		phone: '',
		postcode: '',
		region: '',
		taxIDNumber: ''
	};

	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		setLoading(true);
		values.firstname = values.fullName.split()[0]
		values.lastname = values.fullName.split()[-1]
		console.log(values);
		dispatch(addCustomer(values));
		showNotification({
			id: 'new-customer-success',
			disallowClose: true,
			onClose: () => console.log('unmounted'),
			onOpen: () => console.log('mounted'),
			autoClose: 5000,
			title: 'Success',
			message: 'A new customer has been created!',
			color: 'green',
			icon: <Check size={20} />,
			loading: false
		});
		setTimeout(() => {
			router.push(PATHS.CUSTOMERS);
			setLoading(false);
		}, 500);
	}, []);

	const emptyContact: Contact = {
		name: '',
		email: '',
		phone: '',
		notes: ''
	};

	const contacts = form.values.extraContacts.map((item, index) => (
		<Card key={index} p='lg' radius={0} withBorder mb={10}>
			<Card.Section p='xl'>
				<header className='page-subheading mb-4'>Contact {index + 1}</header>
				<section className='flex flex-col'>
					<div className='space-y-3'>
						<TextInput placeholder='Full Name' icon={<User size={16} />} radius='xs' {...form.getInputProps(`extraContacts.${index}.name`)} />
						<TextInput type='email' placeholder='Email Address' icon={<User size={16} />} radius='xs' {...form.getInputProps(`extraContacts.${index}.email`)} />
						<TextInput type='tel' placeholder='Phone Number' icon={<User size={16} />} radius='xs' {...form.getInputProps(`extraContacts.${index}.phone`)} />
						<TextInput placeholder='Notes' icon={<User size={16} />} radius='xs' {...form.getInputProps(`extraContacts.${index}.notes`)} />
					</div>
					<div className='mt-4 flex justify-between'>
						<Button leftIcon={<Trash size={16} />} color='red' variant='outline' onClick={() => form.removeListItem('extraContacts', index)}>
							Remove contact
						</Button>
					</div>
				</section>
			</Card.Section>
		</Card>
	));

	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Customers', href: PATHS.CUSTOMERS },
		{ title: 'New Account', href: PATHS.NEW_ACCOUNT }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	return (
		<ContentContainer classNames='px-8 h-screen flex flex-col overflow-y-auto pb-5'>
			<PageNav items={items} />
			<form onSubmit={form.onSubmit(handleSubmit)} className='flex flex-col h-full'>
				<main className='grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8'>
					<section>
						<header>
							<h1 className='page-header mb-4'>New Account</h1>
						</header>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
							<div>
								<TextInput required label='Company Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('companyName')} />
							</div>
							<div>
								<TextInput label='Tax ID Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('taxIDNumber')} />
							</div>
							<div>
								<TextInput required label='POC Full Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('fullName')} />
							</div>
							<div>
								<TextInput required label='Contact Email' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('email')} />
							</div>
							<div>
								<TextInput required label='Address Line 1' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine1')} />
							</div>
							<div>
								<TextInput label='Address Line 2' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine2')} />
							</div>
							<div>
								<TextInput required label='City' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('city')} />
							</div>
							<div>
								<TextInput label='Region' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('region')} />
							</div>
							<div>
								<TextInput required label='Postal Code' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('postcode')} />
							</div>
							<div>
								<TextInput label='Country' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('country')} />
							</div>
							<div>
								<TextInput label='Invoice Email' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('billingEmail')} />
							</div>
							<div>
								<Select
									required
									label='Account Type'
									radius={0}
									autoCapitalize='on'
									size='sm'
									data={Object.values(AccountType).map(
										(item): SelectInputData => ({
											value: item,
											label: capitalize(sanitize(item))
										})
									)}
									{...form.getInputProps('accountType')}
								/>
							</div>
						</div>
						<div>
							<button type="submit" className='voyage-button'>Save</button>
						</div>
					</section>
					<section>
						<header className='page-header mb-4'>Add Contacts</header>
						<ScrollArea.Autosize maxHeight={550}>{contacts}</ScrollArea.Autosize>
						<div className='flex justify-end py-5'>
							<Button variant='outline' color='green' onClick={() => form.insertListItem('extraContacts', emptyContact)}>
								+ New contact
							</Button>
						</div>
					</section>
				</main>
			</form>
		</ContentContainer>
	);
};

export default create;
