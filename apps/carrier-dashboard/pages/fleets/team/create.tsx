import React, { useCallback, useMemo, useState } from 'react'
import PageNav from '../../../layout/PageNav';
import { Anchor, Loader, Select, TextInput } from '@mantine/core'
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { Team, TeamRole } from '../../../utils/types'
import { alphanumericId, capitalize } from '@voyage-app/shared-utils'
import { SelectInputData } from '@voyage-app/shared-types';
import { createMember, useMembers } from '../../../store/feature/memberSlice'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, wrapper } from '../../../store'
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';
import moment from 'moment/moment';
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../api/auth/[...nextauth]'
import prisma from '../../../db'
import { setCarrier, useCarrier } from '../../../store/feature/profileSlice'

const create = ({memberId}) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const members = useSelector(useMembers)
	const profile = useSelector(useCarrier)

	const member = useMemo(() => {
		return memberId ? members.find((item: Team) => item.memberId === memberId) : null;
	}, [members]);
	
	const initialValues: Team = {
		id: member?.id ?? undefined,
		carrierId: member?.carrierId ?? profile.id,
		memberId: memberId ?? `MEMBER-ID${alphanumericId(8)}`,
		createdAt: member?.createdAt ?? undefined,
		role: member?.role ?? TeamRole.ADMIN,
		fullName: member?.fullName ?? '',
		firstname: member?.firstname ?? '',
		lastname: member?.lastname ?? '',
		email: member?.email ?? '',
		phone: member?.phone ?? '',
		isActive: !!member?.isActive,
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
		setLoading(true)
		values.fullName = values.firstname + ' ' + values.lastname
		dispatch(createMember(values)).unwrap()
			.then((res) => {
				console.log(res)
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
				setLoading(false)
				setTimeout(() => router.push(PATHS.TEAM), 1000)
			})
			.catch(err => {
				console.error(err)
				setLoading(false);
				showNotification({
					id: 'new-member-failure',
					disallowClose: true,
					onClose: () => console.log('unmounted'),
					onOpen: () => console.log('mounted'),
					autoClose: 3000,
					title: "Error",
					message: `There was a problem creating your new member. \n${err.message}`,
					color: 'red',
					icon: <X size={20}/>,
					loading: false,
				});
			});
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
									label: capitalize(item.toLowerCase().replace(/_/g, ' '))
								}))} />
						</div>
					</div>
					<div>
						<button type="submit" className='flex items-center justify-center voyage-button'>
							<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
							<span>Save</span>
						</button>
					</div>
				</form>
			</div>
		</ContentContainer>
	);
};


export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, query }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	if (session.id) {
		const carrier = await prisma.carrier.findFirst({
			where: {
				userId: {
					equals: session.id
				}
			}
		});
		if (carrier) {
			carrier.createdAt = moment(carrier.createdAt).unix();
			carrier.updatedAt = moment(carrier.updatedAt).unix();
			store.dispatch(setCarrier(carrier));
		}
	}
	return {
		props: {
			memberId: query?.memberId ?? null,
		}
	}
});

export default create;
