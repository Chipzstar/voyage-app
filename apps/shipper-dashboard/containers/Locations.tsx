import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocationType } from '../utils/types';
import NewLocation from './NewLocation';

const Locations = props => {
	const locations = useSelector(state => state['locations']);
	const [locationForm, showLocationForm] = useState({ show: false, defaultValues: null });

	const warehouses = useMemo(() => locations.filter(({ type }) => type === LocationType.WAREHOUSE), [locations]);
	const stores = useMemo(() => locations.filter(({ type }) => type === LocationType.STORE), [locations]);
	const lastmileCouriers = useMemo(() => locations.filter(({ type }) => type === LocationType.LASTMILE_COURIER), [locations]);

	return locationForm.show ? (
		<NewLocation
			location={locationForm.defaultValues}
			onCancel={() =>
				showLocationForm(prevState => ({
					show: false,
					defaultValues: null
				}))
			}
			onSave={() =>
				showLocationForm(prevState => ({
					show: false,
					defaultValues: null
				}))
			}
		/>
	) : (
		<div className='py-5 workflows-container'>
			<header className='flex justify-end'>
				<button className='voyage-button w-56' onClick={() => showLocationForm(prevState => ({ show: true, defaultValues: null }))}>
					Create new location
				</button>
			</header>
			<main className='space-y-10'>
				<div className='flex flex-col space-y-2'>
					<div className='pb-4 shipment-header'>
						<header>Warehouses</header>
					</div>
					<ul>
						{warehouses?.map((location) => (
							<li className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<button
									className='capitalize voyage-button md:w-24 h-8'
									onClick={() =>
										showLocationForm(prevState => ({
											show: true,
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
						{stores?.map((location) => (
							<li className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<button
									className='capitalize voyage-button md:w-24 h-8'
									onClick={() =>
										showLocationForm(prevState => ({
											show: true,
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
						{lastmileCouriers?.map(location => (
							<li className='grid grid-cols-2 gap-x-8 w-128 my-3 place-content-evenly flex items-center'>
								<span className='text-medium text-xl'>{location.name}</span>
								<button
									className='capitalize voyage-button md:w-24 h-8'
									onClick={() =>
										showLocationForm(prevState => ({
											show: true,
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
		</div>
	);
};

Locations.propTypes = {};

export default Locations;
