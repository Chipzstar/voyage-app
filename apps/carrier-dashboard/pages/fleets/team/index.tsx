import React, { useCallback, useEffect, useState } from 'react';
import { ActionIcon, Avatar, Group, Select, Text, TextInput } from '@mantine/core';
import { Empty } from '@voyage-app/shared-ui-components';
import { Check, Pencil, Search, Trash, X } from 'tabler-icons-react';
import { PATHS, PUBLIC_PATHS } from '../../../utils/constants';
import DataGrid from '../../../components/DataGrid';
import ContentContainer from '../../../layout/ContentContainer';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMember, setMembers, updateMember, useMembers } from '../../../store/features/memberSlice';
import { TeamRole } from '../../../utils/types';
import { capitalize, notifyError, notifySuccess, sanitize } from '@voyage-app/shared-utils';
import { useModals } from '@mantine/modals';
import _ from 'lodash';
import '../../../utils/string.extensions';
import { AppDispatch, wrapper } from '../../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '../../../db';
import { SelectInputData } from '@voyage-app/shared-types';
import { getToken } from 'next-auth/jwt';
import { fetchMembers } from '../../../utils/functions';

const team = () => {
	const modals = useModals();
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const team = useSelector(useMembers);
	const [filteredTeam, setFilter] = useState([...team]);
	const [activePage, setPage] = useState(1);

	const openConfirmModal = (id: string, name) =>
		modals.openConfirmModal({
			title: 'Delete Team Member',
			children: (
				<Text size='md'>
					You have selected <strong>{name}</strong>
					<br />
					Are you sure you want to delete this member?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () =>
				dispatch(deleteMember(id))
					.unwrap()
					.then(res => notifySuccess('delete-member-success', 'Member deleted!', <Check size={20} />))
					.catch(err => notifyError('delete-member-failure', `There was a problem deleting this member.\n${err.message}`, <X size={20} />)),
			onCancel: () => console.log('Cancel'),
			classNames: {
				title: 'modal-header'
			},
			confirmProps: {
				color: 'red',
				classNames: {
					root: 'bg-red-500'
				}
			},
			closeOnCancel: true,
			closeOnConfirm: true
		});

	const debouncedSearch = useCallback(
		_.debounce(value => {
			setFilter(prevState => (value.length >= 2 ? team.filter(({ fullName, email, phone, role }) => fullName.contains(value) || email.contains(value) || phone.includes(value) || role.contains(value)) : team));
		}, 300),
		[team]
	);

	useEffect(() => setFilter(team), [team]);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const rows = filteredTeam.map((element, index) => {
		console.log(`${element.fullName} - ${element.role}`);
		return (
			<tr key={index}>
				<td colSpan={1}>
					<Group spacing='sm'>
						<Avatar
							size={40}
							radius={40}
							classNames={{
								placeholder: 'bg-transparent'
							}}
						/>
						<Text weight={500}>
							{element.firstName} {element.lastName}
						</Text>
					</Group>
				</td>
				<td colSpan={1}>
					<span className='text-base font-normal'>{element.email}</span>
				</td>
				<td colSpan={1}>
					<span>{element.phone}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-shrink flex-col'>
						<Select
							data={Object.values(TeamRole).map(
								(role): SelectInputData => ({
									value: role,
									label: capitalize(role.toLowerCase().replace(/_/g, ' '))
								})
							)}
							value={element.role}
							variant='unstyled'
							onChange={(value: TeamRole) => {
								dispatch(updateMember({ id: element.id, role: value }))
									.unwrap()
									.then(res => {
										console.log('RESULT', res);
										notifySuccess('edit-member-success', `${element.firstName} has a new role of ${capitalize(sanitize(value))}!`, <Check size={20} />);
									})
									.catch(err => {
										console.error(err);
										notifyError('edit-member-failure', `There was a problem changing this member's role to ${capitalize(sanitize(value))}`, <X size={20} />);
									});
							}}
						/>
					</div>
				</td>
				<td colSpan={2}>
					<Group spacing='md' position='left'>
						<ActionIcon
							size='sm'
							onClick={() =>
								router.push({
									pathname: `${PATHS.NEW_MEMBER}`,
									query: { memberId: element.memberId }
								})
							}
						>
							<Pencil />
						</ActionIcon>
						<ActionIcon size='sm' color='red' onClick={() => openConfirmModal(element.id, element.fullName)}>
							<Trash />
						</ActionIcon>
					</Group>
				</td>
			</tr>
		);
	});
	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='mt-2 mb-6 flex items-center justify-between'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} onChange={e => debouncedSearch(e.target.value)} placeholder='Search for name, email or phone' size='md' />
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_MEMBER)}>
					<span className='text-base'>Add member</span>
				</button>
			</div>
			<DataGrid
				activePage={activePage}
				setPage={setPage}
				rows={rows}
				headings={[
					{ label: 'Full Name', key: null },
					{ label: 'Email', key: null },
					{
						label: 'Phone',
						key: null
					},
					{ label: 'Role', key: null },
					{ label: 'Actions', key: null }
				]}
				emptyContent={
					<Empty
						message={
							<span className='text-center text-2xl'>
								You have no team members
								<br />
								Click the 'Add Member' button to add a new member
							</span>
						}
					/>
				}
				spacingY='md'
			/>
		</ContentContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id) {
		let members = await fetchMembers(token?.carrierId, prisma);
		store.dispatch(setMembers(members));
	}
	return {
		props: {
			session
		}
	};
});

export default team;