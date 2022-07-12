import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LocationType } from '../utils/types';
import NewLocation from './NewLocation';
import { useRouter } from 'next/router';
import { createLocation, updateLocation } from '../store/features/locationSlice';

const Locations = props => {
	const dispatch = useDispatch();
	const router = useRouter();
	const locations = useSelector(state => state['locations']);
	const [locationForm, showLocationForm] = useState({ show: false, id: '', defaultValues: null });

	const warehouses = useMemo(() => locations.filter(({ type }) => type === LocationType.WAREHOUSE), [locations]);
	const stores = useMemo(() => locations.filter(({ type }) => type === LocationType.STORE), [locations]);
	const lastmileCouriers = useMemo(() => locations.filter(({ type }) => type === LocationType.LASTMILE_COURIER), [locations]);

	const handleSubmit = useCallback(values => {
		console.log(values);
		// if location already exists, perform location UPDATE, otherwise perform location CREATE
		locationForm.id ? dispatch(updateLocation(values)) : dispatch(createLocation(values));
		showLocationForm(prevState => ({ ...prevState, show: false, id: '', defaultValues: null }));
	}, [locationForm]);

	return locationForm.show ? (
		<NewLocation
			locationID={locationForm.id}
			location={locationForm.defaultValues}
			onCancel={() =>
				showLocationForm(prevState => ({
					show: false,
					id: '',
					defaultValues: null
				}))
			}
			onSubmit={handleSubmit}
		/>
	) : (
		<div className='py-5 workflows-container'>
			<header className='flex justify-end'>
				<button className='voyage-button w-56' onClick={() => showLocationForm(prevState => ({ ...prevState, show: true }))}>
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
								<button
									className='capitalize voyage-button md:w-24 h-8'
									onClick={() =>
										showLocationForm(prevState => ({
											show: true,
											id: location.id,
											defaultValues: location
										}))
									}
								>
									edit
								</button>
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
								<button
									className='capitalize voyage-button md:w-24 h-8'
									onClick={() =>
										showLocationForm(prevState => ({
											show: true,
											id: location.id,
											defaultValues: location
										}))
									}
								>
									edit
								</button>
							</li>
						))}
					</ul>
				</div>
				<div className='flex flex-col space-y-2'>
					<div className='pb-4 shipment-header'>
						<header>Final Mile Carriers</header>
					</div>
					<ul>
						{lastmileCouriers?.map((location, index) => (
							<li key={index} className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<button
									className='capitalize voyage-button md:w-24 h-8'
									onClick={() =>
										showLocationForm(prevState => ({
											show: true,
											id: location.id,
											defaultValues: location
										}))
									}
								>
									edit
								</button>
							</li>
						))}
					</ul>
				</div>
			</main>
			<div className='flex mt-20 justify-center items-center h-full grow w-100'>
				<button
					className='voyage-button h-12 md:w-48 w-auto'
					onClick={() => {
						dispatch({ type: 'RESET' });
						// @ts-ignore
						router.reload(window.location.pathname);
					}}
				>
					Reset
				</button>
			</div>
		</div>
	);
};

Locations.propTypes = {};

export default Locations;
