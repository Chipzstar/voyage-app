import React, { useCallback } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { Team, TeamRole } from '../../../utils/types';
import { alphanumericId, capitalize } from '@voyage-app/shared-utils'
import { SelectInputData } from '@voyage-app/shared-types';
import { addMember } from '../../../store/feature/memberSlice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../store'
import { useRouter } from 'next/router'
import { showNotification } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';
import moment from 'moment/moment'

const create = () => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const initialValues: Team = {
		id: '',
		memberId: `MEMBER-ID${alphanumericId(8)}`,
		createdAt: moment().unix(),
		role: TeamRole.ADMIN,
		fullName: '',
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
		values.fullName = values.firstname + ' ' + values.lastname
		console.log(values);
		dispatch(addMember(values))
		showNotification({
			id: 'new-member-success',
			disallowClose: true,
			onClose: () => console.log('unmounted'),
			onOpen: () => console.log('mounted'),
			autoClose: 3000,
			title: "Success",
			message: 'A new member has been added to your team!',
			color: 'green',
			icon: <Check size={20}/>,
			loading: false,
		});
		setTimeout(() => router.push(PATHS.TEAM), 1000)
	}, []);

	return (
		<ContentContainer classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
						<div>
							<TextInput required className="w-96" label='First Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('firstname')} />
						</div>
						<div>
							<TextInput required className="w-96" label='Last Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('lastname')} />
						</div>
						<div>
							<TextInput required type="email" className="w-96" label='Email Address' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('email')} />
						</div>
						<div>
							<TextInput required type="tel" className="w-96" label='Phone Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('phone')} />
						</div>
						<div>
							<Select
								required
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
						<button type="submit" className='voyage-button'>
							Save
						</button>
					</div>
				</form>
			</div>
		</ContentContainer>
	);
};

export default create;
