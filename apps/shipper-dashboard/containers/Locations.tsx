import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Location, LocationType } from '../utils/types';
import { useRouter } from 'next/router';
import { deleteLocation, useLocation } from '../store/features/locationSlice';
import { useModals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { PATHS } from '../utils/constants';
import PropTypes from 'prop-types';
import { AppDispatch } from '../store';

const LocationItem = ({ name, onDelete, onEdit }) => {
	return (
		<li className='w-128 my-3 flex grid grid-cols-2 place-content-evenly items-center gap-x-8'>
			<span className='text-medium text-xl'>{name}</span>
			<div className='space-x-4'>
				<button className='voyage-button h-8 capitalize md:w-20' onClick={onEdit}>
					edit
				</button>
				<button className='delete-button h-8 capitalize md:w-20' onClick={onDelete}>
					delete
				</button>
			</div>
		</li>
	);
};

const Locations = props => {
	const modals = useModals();
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const locations = useSelector(useLocation);

	const warehouses = useMemo(() => locations.filter(({ type }) => type === LocationType.WAREHOUSE), [locations]);
	const stores = useMemo(() => locations.filter(({ type }) => type === LocationType.STORE), [locations]);
	const carriers = useMemo(() => locations.filter(({ type }) => type === LocationType.LASTMILE_CARRIER), [locations]);

	const openConfirmModal = (id: string, name) =>
		modals.openConfirmModal({
			title: 'Delete Location',
			children: (
				<Text size='md'>
					You have selected <strong>{name}</strong>
					<br />
					Are you sure you want to delete this location?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () =>
				dispatch(deleteLocation(id))
					.unwrap()
					.then(() => alert('Location has been removed!')),
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

	return (
		<div className='workflows-container py-5'>
			<header className='flex justify-end'>
				<button className='voyage-button w-56' onClick={() => router.push(PATHS.NEW_LOCATION)}>
					Create new location
				</button>
			</header>
			<main className='space-y-10'>
				<div className='flex flex-col space-y-2'>
					<div className='shipment-header pb-4'>
						<header>Warehouses</header>
					</div>
					<ul>
						{warehouses?.map((location: Location, index) => (
							<LocationItem key={index} name={location.name} onEdit={() => router.push(`${PATHS.NEW_LOCATION}?locationId=${location.locationId}`)} onDelete={() => openConfirmModal(location.id, location.name)} />
						))}
					</ul>
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='shipment-header pb-4'>
						<header>Stores</header>
					</div>
					<ul>
						{stores?.map((location: Location, index) => (
							<li key={index} className='w-128 my-3 flex grid grid-cols-2 place-content-evenly items-center gap-x-8'>
								<span className='text-medium text-xl'>{location.name}</span>
								<div className='space-x-4'>
									<button className='voyage-button h-8 capitalize md:w-20' onClick={() => router.push(`${PATHS.NEW_LOCATION}?locationId=${location.locationId}`)}>
										edit
									</button>
									<button className='delete-button h-8 capitalize md:w-20' onClick={() => openConfirmModal(location.id, location.name)}>
										delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='shipment-header pb-4'>
						<header>Final Mile Carriers</header>
					</div>
					<ul>
						{carriers?.map((location: Location, index) => (
							<li key={index} className='w-128 my-3 flex grid grid-cols-2 place-content-evenly items-center gap-x-8'>
								<span className='text-medium text-xl'>{location.name}</span>
								<div className='space-x-4'>
									<button className='voyage-button h-8 capitalize md:w-20' onClick={() => router.push(`${PATHS.NEW_LOCATION}?locationId=${location.locationId}`)}>
										edit
									</button>
									<button className='delete-button h-8 capitalize md:w-20' onClick={() => openConfirmModal(location.id, location.name)}>
										delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</main>
		</div>
	);
};

Locations.propTypes = {
	locations: PropTypes.array
};

export default Locations;
