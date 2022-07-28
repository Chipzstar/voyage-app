import React, { useCallback } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import Container from '../../../layout/Container';
import { useForm } from '@mantine/form';
import { Team, TeamRole } from '../../../utils/types';
import { alphanumericId, capitalize } from '@voyage-app/shared-utils'
import { SelectInputData } from '@voyage-app/shared-types';

const create = () => {
	const initialValues: Team = {
		id: '',
		memberId: `user_${alphanumericId(16)}`,
		role: TeamRole.ADMIN,
		firstname: '',
		lastname: '',
		email: '',
		phone: '',
		isActive: false
	};
	const form = useForm({
		initialValues
	});

	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Team', href: PATHS.TEAM },
		{ title: 'New Member', href: PATHS.NEW_MEMBER }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	const handleSubmit = useCallback(values => {
		console.log(values);
	}, []);

	return (
		<Container classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
						<div>
							<TextInput className="w-96" label='First Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('firstname')} />
						</div>
						<div>
							<TextInput className="w-96" label='Last Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('lastname')} />
						</div>
						<div>
							<TextInput type="email" className="w-96" label='Email Address' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('email')} />
						</div>
						<div>
							<TextInput type="tel" className="w-96" label='Phone Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('phone')} />
						</div>
						<div>
							<Select
								className="w-96" label='Role'
								radius={0}
								autoCapitalize='on'
								size='md'
								{...form.getInputProps('role')}
								data={Object.values(TeamRole).map((item): SelectInputData => ({
									value: item,
									label: capitalize(item.replace(/_/g, ' '))
								}))} />
						</div>
					</div>
					<div>
						<button className='voyage-button'>
							Save
						</button>
					</div>
				</form>
			</div>
		</Container>
	);
};

export default create;
