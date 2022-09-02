import React, { useCallback, useMemo, useState } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Loader, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { Member, TeamRole } from '../../../utils/types';
import { alphanumericId, capitalize, notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { createMember, setMembers, updateMember, useMembers } from '../../../store/feature/memberSlice'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, wrapper } from '../../../store';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { Check, X } from 'tabler-icons-react';
import moment from 'moment/moment';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '../../../db';
import { setCarrier, useCarrier } from '../../../store/feature/profileSlice';
import { getToken } from 'next-auth/jwt'

const items = [
	{ title: 'Home', href: PATHS.HOME },
	{ title: 'Team', href: PATHS.TEAM },
	{ title: 'New Member', href: PATHS.NEW_MEMBER }
].map((item, index) => (
	<Anchor component={Link} href={item.href} key={index}>
		<span className='hover:text-secondary hover:underline'>{item.title}</span>
	</Anchor>
));

const create = ({ memberId, session }) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const members = useSelector(useMembers);
	const profile = useSelector(useCarrier);

	const member = useMemo(() => {
		return memberId ? members.find((item: Member) => item.memberId === memberId) : null;
	}, [members]);

	const initialValues: Member = {
		id: member?.id ?? undefined,
		userId: member?.userId ?? session?.id,
		carrierId: member?.carrierId ?? profile.id,
		memberId: memberId ?? `MEMBER-ID${alphanumericId(8)}`,
		createdAt: undefined,
		role: member?.role ?? TeamRole.ADMIN,
		fullName: member?.fullName ?? '',
		firstName: member?.firstName ?? '',
		lastName: member?.lastName ?? '',
		email: member?.email ?? '',
		phone: member?.phone ?? '',
		isActive: !!member?.isActive
	};

	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		setLoading(true);
		values.fullName = values.firstName + ' ' + values.lastName;
		member
			? dispatch(updateMember(values))
					.unwrap()
					.then(res => {
						console.log(res);
						notifySuccess('update-member-success', `Member ${values.memberId} has been updated`, <Check size={20} />);
						setLoading(false);
						setTimeout(() => router.push(PATHS.TEAM), 1000);
					})
					.catch(err => {
						console.error(err);
						notifyError('update-member-failure', `There was a problem updating this member. \n${err.message}`, <X size={20} />);
						setLoading(false);
					})
			: dispatch(createMember(values))
					.unwrap()
					.then(res => {
						console.log(res);
						notifySuccess('new-member-success', 'A new member has been added to your team!', <Check size={20} />);
						setLoading(false);
						setTimeout(() => router.push(PATHS.TEAM), 1000);
					})
					.catch(err => {
						console.error(err);
						notifyError('new-member-failure', `There was a problem creating your new member. \n${err.message}`, <X size={20} />);
						setLoading(false);
					});
	}, [member]);

	return (
		<ContentContainer classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
						<div>
							<TextInput required className='w-96' label='First Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('firstName')} />
						</div>
						<div>
							<TextInput required className='w-96' label='Last Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('lastName')} />
						</div>
						<div>
							<TextInput required type='email' className='w-96' label='Email Address' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('email')} />
						</div>
						<div>
							<TextInput required type='tel' className='w-96' label='Phone Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('phone')} />
						</div>
						<div>
							<Select
								required
								className='w-96'
								label='Role'
								radius={0}
								autoCapitalize='on'
								size='md'
								{...form.getInputProps('role')}
								data={Object.values(TeamRole).map(
									(item): SelectInputData => ({
										value: item,
										label: capitalize(item.toLowerCase().replace(/_/g, ' '))
									})
								)}
							/>
						</div>
					</div>
					<div>
						<button type='submit' className='flex items-center justify-center voyage-button'>
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
	const token = await getToken({ req });
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
		let members = await prisma.member.findMany({
			where: {
				OR: [
					{
						carrierId: {
							equals: token?.carrierId
						}
					},
					{
						userId: {
							equals: session.id
						}
					}
				]
			},
			orderBy: {
				createdAt: 'desc'
			}
		});
		members = members.map(member => ({
			...member,
			createdAt: moment(member.createdAt).unix(),
			updatedAt: moment(member.updatedAt).unix()
		}));
		store.dispatch(setMembers(members));
	}
	return {
		props: {
			memberId: query?.memberId ?? null
		}
	};
});

export default create
