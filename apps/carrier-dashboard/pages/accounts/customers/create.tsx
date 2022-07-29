import React, { useCallback } from 'react';
import { AccountType, Customer } from '../../../utils/types';
import { useForm } from '@mantine/form';
import { PATHS } from '../../../utils/constants';
import { Anchor, Button, Card, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import PageNav from '../../../layout/PageNav';
import Container from '../../../layout/Container';
import { Trash, User } from 'tabler-icons-react'
import { SelectInputData } from '@voyage-app/shared-types';
import { capitalize, sanitize } from '@voyage-app/shared-utils';

const create = () => {
	const initialValues: Customer = {
		accountType: undefined,
		addressLine1: '',
		billingEmail: '',
		city: '',
		companyName: '',
		country: '',
		customerId: '',
		email: '',
		extraContacts: [],
		fullName: '',
		id: '',
		phone: '',
		postcode: '',
		region: '',
		taxIDNumber: ''
	};

	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		console.log(values);
	}, []);

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
		<Container classNames='px-8 h-screen flex flex-col overflow-y-auto pb-5'>
			<PageNav items={items} />
			<form onSubmit={form.onSubmit(handleSubmit)} className='flex flex-col h-full'>
				<main className='grid grid-cols-1 lg:grid-cols-2 lg:gap-x-8'>
					<section>
						<header>
							<h1 className='page-header mb-4'>New Account</h1>
						</header>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
							<div>
								<TextInput label='Company Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('companyName')} />
							</div>
							<div>
								<TextInput label='Tax ID Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('taxIDNumber')} />
							</div>
							<div>
								<TextInput label='POC Full Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('fullName')} />
							</div>
							<div>
								<TextInput label='Contact Email' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('email')} />
							</div>
							<div>
								<TextInput label='Address Line 1' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine1')} />
							</div>
							<div>
								<TextInput label='Address Line 2' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine2')} />
							</div>
							<div>
								<TextInput label='City' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('city')} />
							</div>
							<div>
								<TextInput label='Region' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('region')} />
							</div>
							<div>
								<TextInput label='Postal Code' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('postcode')} />
							</div>
							<div>
								<TextInput label='Country' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('country')} />
							</div>
							<div>
								<TextInput label='Invoice Email' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('billingEmail')} />
							</div>
							<div>
								<Select
									label='Account Type'
									radius={0}
									autoCapitalize='on'
									size='sm'
									classNames={{
										item: 'capitalize'
									}}
									data={Object.values(AccountType).map(
										(item): SelectInputData => ({
											value: item,
											label: sanitize(item)
										})
									)}
									{...form.getInputProps('accountType')}
								/>
							</div>
						</div>
					</section>
					<section>
						<header className='page-header mb-4'>Add Contacts</header>
						<Card p='lg' radius={0} withBorder>
							<Card.Section p='xl'>
								<header className='page-subheading mb-4'>Contact 1</header>
								<form className='flex flex-col'>
									<div className='space-y-3'>
										<TextInput placeholder='Full Name' icon={<User size={16} />} radius='xs' />
										<TextInput placeholder='Email Address' icon={<User size={16} />} radius='xs' />
										<TextInput placeholder='Phone Number' icon={<User size={16} />} radius='xs' />
										<TextInput placeholder='Notes' icon={<User size={16} />} radius='xs' />
									</div>
									<div className='mt-4 flex justify-between'>
										<Button leftIcon={<Trash size={16}/>} color="red" variant='outline'>Remove contact</Button>
									</div>
								</form>
							</Card.Section>
						</Card>
						<div className='flex justify-end py-5'>
							<Button variant='outline' color='green'>
								+ New contact
							</Button>
						</div>
					</section>
				</main>
				<div>
					<button className='voyage-button'>Save</button>
				</div>
			</form>
		</Container>
	);
};

export default create;
