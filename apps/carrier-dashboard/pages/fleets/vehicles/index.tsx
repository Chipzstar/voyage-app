import React, { useCallback, useEffect, useState } from 'react';
import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { Empty } from '@voyage-app/shared-ui-components';
import { Check, Pencil, Search, Trash, X } from 'tabler-icons-react';
import { PATHS, PUBLIC_PATHS } from '../../../utils/constants';
import DataGrid from '../../../components/DataGrid';
import ContentContainer from '../../../layout/ContentContainer';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVehicle, setVehicles, useVehicles } from '../../../store/feature/vehicleSlice';
import { useDrivers } from 'apps/carrier-dashboard/store/feature/driverSlice';
import { useModals } from '@mantine/modals';
import _ from 'lodash';
import '../../../utils/string.extensions';
import { AppDispatch, wrapper } from '../../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '../../../db';
import { getToken } from 'next-auth/jwt';
import { fetchVehicles } from '../../../utils/functions';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';

const vehicles = () => {
	const modals = useModals();
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const vehicles = useSelector(useVehicles);
	const drivers = useSelector(useDrivers);
	const [filteredVehicles, setFilter] = useState([...vehicles]);
	const [activePage, setPage] = useState(1);

	const openConfirmModal = (id: string, name) =>
		modals.openConfirmModal({
			title: 'Delete Vehicle',
			children: (
				<Text size='md'>
					You have selected <strong>{name}</strong>
					<br />
					Are you sure you want to delete this vehicle?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () =>
				dispatch(deleteVehicle(id))
					.unwrap()
					.then(() => notifySuccess('delete-vehicle-success', 'Vehicle deleted', <Check size={20} />))
					.catch(err => notifyError('delete-vehicle-failure', `There was a problem deleting this account.\n${err.message}`, <X size={20} />)),
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
			setFilter(prevState =>
				value.length >= 2 ? vehicles.filter(({ vehicleName, make, model, regNumber }) => vehicleName.contains(value) || model.contains(value) || make.contains(value) || regNumber.includes(value.toUpperCase())) : vehicles
			);
		}, 300),
		[vehicles]
	);

	useEffect(() => setFilter(vehicles), [vehicles]);

	const rows = filteredVehicles.map((element, index) => {
		const foundDriver = drivers.find(driver => driver.driverId === element.currentDriver);
		return (
			<tr key={element.vehicleId}>
				<td colSpan={1}>
					<span>{element.vehicleName}</span>
				</td>
				<td colSpan={1}>
					<span>{element.make}</span>
				</td>
				<td colSpan={1}>
					<span>{element.model}</span>
				</td>
				<td colSpan={1}>
					<span className='capitalize'>{element.status.replace(/-/g, ' ')}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className='capitalize'>{foundDriver ? foundDriver.fullName : '-'}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span className='capitalize'>{element.regNumber}</span>
					</div>
				</td>
				<td colSpan={2}>
					<Group spacing='md' position='left'>
						<ActionIcon
							size='sm'
							onClick={() =>
								router.push({
									pathname: `${PATHS.NEW_VEHICLE}`,
									query: { vehicleId: element.vehicleId }
								})
							}
						>
							<Pencil />
						</ActionIcon>
						<ActionIcon size='sm' color='red' onClick={() => openConfirmModal(element.id, element.vehicleName)}>
							<Trash />
						</ActionIcon>
					</Group>
				</td>
			</tr>
		);
	});

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	return (
		<ContentContainer classNames='py-4 px-8 h-screen flex flex-col'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' radius={0} icon={<Search size={18} />} placeholder='Search for name, model, make or reg no.' onChange={e => debouncedSearch(e.target.value)} size='md' />
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_VEHICLE)}>
					<span className='text-base'>Add vehicle</span>
				</button>
			</div>
			<DataGrid
				activePage={activePage}
				setPage={setPage}
				rows={rows}
				headings={['Vehicle Name', 'Make', 'Model', 'Status', 'Current Driver', 'Reg No.', 'Actions']}
				emptyContent={
					<Empty
						message={
							<span className='text-center text-2xl'>
								You have no vehicles
								<br />
								Click the 'Add Vehicle' button to add one
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
		let vehicles = await fetchVehicles(token?.carrierId, prisma)
		store.dispatch(setVehicles(vehicles));
	}
	return {
		props: {
			session
		}
	};
});

export default vehicles;
