import React, { useCallback, useEffect, useState } from 'react';
import { PATHS, PUBLIC_PATHS } from '../../../utils/constants';
import { useRouter } from 'next/router';
import ContentContainer from '../../../layout/ContentContainer';
import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { Check, Pencil, Search, Trash, X } from 'tabler-icons-react'
import DataGrid from '../../../components/DataGrid';
import { Empty } from '@voyage-app/shared-ui-components';
import { sanitize } from '@voyage-app/shared-utils';
import { useDispatch, useSelector } from 'react-redux';
import { useCustomers, deleteCustomer, setCustomers } from '../../../store/feature/customerSlice';
import { useModals } from '@mantine/modals';
import _ from 'lodash';
import '../../../utils/string.extensions';
import { AppDispatch, wrapper } from '../../../store';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '../../../db';
import moment from 'moment';
import { notifyError, notifySuccess } from '../../../utils/functions'

const customers = () => {
	const modals = useModals();
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const customers = useSelector(useCustomers);
	const [filteredCustomers, setFilter] = useState(customers);

	const debouncedSearch = useCallback(
		_.debounce(value => {
			setFilter(prevState => (value.length >= 2 ? customers.filter(({ fullName, email, phone, companyName }) => fullName.contains(value) || email.contains(value) || phone.includes(value) || companyName.contains(value)) : customers));
		}, 300),
		[customers]
	);

	const openConfirmModal = (id: string, name) =>
		modals.openConfirmModal({
			title: 'Delete Vehicle',
			children: (
				<Text size='md'>
					You have selected <strong>{name}</strong>
					<br />
					Are you sure you want to delete this customer?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () =>
				dispatch(deleteCustomer(id))
					.unwrap()
					.then(res => notifySuccess('delete-customer-success', 'Customer deleted!', <Check size={20} />))
					.catch(err => notifyError('delete-customer-failure', `There was a problem deleting this account.\n${err.message}`, <X size={20} />)),
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

	useEffect(() => setFilter(customers), [customers]);

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const rows = filteredCustomers.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<span>{element.companyName}</span>
				</td>
				<td colSpan={1}>
					<span>{element.fullName}</span>
				</td>
				<td colSpan={1} className='w-64'>
					<div className='flex flex-col flex-shrink flex-wrap'>
						<span>
							{element.addressLine1} {element.addressLine2}
						</span>
						<span>{element.postcode}</span>
					</div>
				</td>
				<td colSpan={1}>
					<span className='text-base font-normal'>{element.email}</span>
				</td>
				<td colSpan={1}>
					<span className='capitalize'>{sanitize(element.accountType)}</span>
				</td>
				<td colSpan={2}>
					<Group spacing='md' position='left'>
						<ActionIcon
							size='sm'
							onClick={() =>
								router.push({
									pathname: `${PATHS.NEW_ACCOUNT}`,
									query: { customerId: element.customerId }
								})
							}
						>
							<Pencil />
						</ActionIcon>
						<ActionIcon size='sm' color='red' onClick={() => openConfirmModal(element.id, element.companyName)}>
							<Trash />
						</ActionIcon>
					</Group>
				</td>
			</tr>
		);
	});
	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search for name, email or phone' onChange={e => debouncedSearch(e.target.value)} size='md' />
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_ACCOUNT)}>
					<span className='text-base'>New Account</span>
				</button>
			</div>
			<DataGrid
				rows={rows}
				headings={['Account Name', 'POC', 'Address', 'Contact Email', 'Account Type', 'Actions']}
				emptyContent={
					<Empty
						message={
							<span className='text-center text-2xl'>
								You have no customers
								<br />
								Click the 'New Account' button to add a new customer
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
		let customers = await prisma.customer.findMany({
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
		customers = customers.map(customer => ({
			...customer,
			createdAt: moment(customer.createdAt).unix(),
			updatedAt: moment(customer.updatedAt).unix()
		}));
		store.dispatch(setCustomers(customers));
	}
	return {
		props: {
			session
		}
	};
});

export default customers
