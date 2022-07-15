import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Location, LocationType } from '../utils/types';
import { useRouter } from 'next/router';
import { createLocation, deleteLocation, updateLocation } from '../store/features/locationSlice';
import { useModals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { PATHS } from '../utils/constants';

const Locations = props => {
	const modals = useModals();
	const router = useRouter();
	const dispatch = useDispatch();
	const locations = useSelector(state => state['locations']);
	// state
	const [locationForm, showLocationForm] = useState({ show: false, id: '', defaultValues: null });

	const warehouses = useMemo(() => locations.filter(({ type }) => type === LocationType.WAREHOUSE), [locations]);
	const stores = useMemo(() => locations.filter(({ type }) => type === LocationType.STORE), [locations]);
	const carriers = useMemo(() => locations.filter(({ type }) => type === LocationType.LASTMILE_COURIER), [locations]);

	const handleSubmit = useCallback(
		values => {
			console.log(values);
			// if location already exists, perform location UPDATE, otherwise perform location CREATE
			locationForm.id ? dispatch(updateLocation(values)) : dispatch(createLocation(values));
			showLocationForm(prevState => ({ ...prevState, show: false, id: '', defaultValues: null }));
		},
		[locationForm]
	);

	const openConfirmModal = (id, name) =>
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
			onConfirm: () => dispatch(deleteLocation(id)),
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
		<div className='py-5 workflows-container'>
			<header className='flex justify-end'>
				<button className='voyage-button w-56' onClick={() => router.push(PATHS.NEW_LOCATION)}>
					Create new location
				</button>
			</header>
			<main className='space-y-10'>
				<div className='flex flex-col space-y-2'>
					<div className='pb-4 shipment-header'>
						<header>Warehouses</header>
					</div>
					<ul>
						{warehouses?.map((location, index) => (
							<li key={index} className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<div className='space-x-4'>
									<button
										className='capitalize voyage-button md:w-20 h-8'
										onClick={() => router.push(`${PATHS.NEW_LOCATION}?locationId=${location.id}`)}
									>
										edit
									</button>
									<button className='capitalize delete-button md:w-20 h-8' onClick={() => openConfirmModal(location.id, location.name)}>
										delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='pb-4 shipment-header'>
						<header>Stores</header>
					</div>
					<ul>
						{stores?.map((location, index) => (
							<li key={index} className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<div className='space-x-4'>
									<button
										className='capitalize voyage-button md:w-20 h-8'
										onClick={() => router.push(`${PATHS.NEW_LOCATION}?locationId=${location.id}`)}
									>
										edit
									</button>
									<button className='capitalize delete-button md:w-20 h-8' onClick={() => openConfirmModal(location.id, location.name)}>
										delete
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='pb-4 shipment-header'>
						<header>Final Mile Carriers</header>
					</div>
					<ul>
						{carriers?.map((location: Location, index) => (
							<li key={index} className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<div className='space-x-4'>
									<button className='capitalize voyage-button md:w-20 h-8' onClick={() => router.push(`${PATHS.NEW_LOCATION}?locationId=${location.id}`)}>
										edit
									</button>
									<button className='capitalize delete-button md:w-20 h-8' onClick={() => openConfirmModal(location.id, location.name)}>
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

Locations.propTypes = {};

export default Locations;
