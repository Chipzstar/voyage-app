import React, { useCallback, useMemo, useState } from 'react';
import OperatingHoursForm from '../modals/OperatingHoursForm';
import { Loader, Select, Textarea, TextInput } from '@mantine/core';
import moment from 'moment';
import { useForm } from '@mantine/form';
import { useDispatch, useSelector } from 'react-redux';
import { DEFAULT_OPERATING_HOURS, PATHS } from '../utils/constants';
import prisma from '../db';
import { createLocation, setLocations, updateLocation } from '../store/features/locationSlice';
import { useRouter } from 'next/router';
import { getToken } from 'next-auth/jwt';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { fetchLocations, fetchShipper } from '../utils/functions';
import { AppDispatch, wrapper } from '../store';
import { alphanumericId, countries, notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { Check, X } from 'tabler-icons-react';
import {
	Location,
	LocationTimeWindow,
	LocationType,
	OperatingHoursState,
	SelectInputData
} from '@voyage-app/shared-types';
import { setShipper } from '../store/features/profileSlice';

const location = ({ locationId, locationName }) => {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const locations = useSelector(state => state['locations']);
	const [operatingHoursForm, toggleOperatingHoursForm] = useState(false);

	const location = useMemo(() => {
		return locationId ? locations.find((loc: Location) => loc.locationId === locationId) : null;
	}, [locations]);

	const form = useForm<Location>({
		initialValues: {
			id: location?.id ?? undefined,
			shipperId: location?.shipperId ?? undefined,
			locationId: locationId || `LOCATION-ID${alphanumericId(8)}`,
			name: locationName || location?.name || '',
			type: location?.type || LocationType.WAREHOUSE,
			line1: location?.line1 ?? '',
			line2: location?.line2 ?? '',
			city: location?.city ?? '',
			postcode: location?.postcode ?? '',
			region: location?.region ?? '',
			country: location?.country ?? 'GB',
			pickupInstructions: location?.pickupInstructions ?? '',
			deliveryInstructions: location?.deliveryInstructions ?? '',
			operatingHours: location ? [...location.operatingHours] : [...DEFAULT_OPERATING_HOURS]
		}
	});

	const handleSubmit = useCallback(
		values => {
			setLoading(true);
			// if location already exists, perform location UPDATE, otherwise perform location CREATE
			if (location) {
				dispatch(updateLocation(values))
					.unwrap()
					.then(res => {
						console.log('RESULT', res);
						notifySuccess('update-location-success', 'Location updated successfully!', <Check size={20} />);
						setLoading(false);
						setTimeout(() => router.push(`${PATHS.WORKFLOWS}#locations`), 1000);
					})
					.catch(err => {
						notifyError('update-location-failure', `Location could not be updated, ${err.message}`, <X size={20} />);
						setLoading(false);
					});
			} else {
				dispatch(createLocation(values))
					.unwrap()
					.then(res => {
						console.log('RESULT', res);
						notifySuccess('create-location-success', 'Location was created successfully!', <Check size={20} />);
						setLoading(false);
						setTimeout(() => router.push(`${PATHS.WORKFLOWS}#locations`), 1000);
					})
					.catch(err => {
						notifyError('create-location-failure', `We were unable to create this location, ${err.message}`, <X size={20} />);
						setLoading(false);
					});
			}
		},
		[location]
	);

	const saveOperatingHours = useCallback(values => {
		form.setFieldValue('operatingHours', values.operatingHours);
		toggleOperatingHoursForm(false);
	}, []);

	return (
		<div className='min-h-screen p-4'>
			<div className='h-full p-4'>
				<OperatingHoursForm opened={operatingHoursForm} onClose={() => toggleOperatingHoursForm(false)} onSave={saveOperatingHours} operatingHours={location?.operatingHours} />
				<form onSubmit={form.onSubmit(handleSubmit)} className='grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-y-10 lg:gap-x-20'>
					<div id='address-form-container' className='col-span-1 grid grid-cols-1 gap-5 lg:grid-cols-2'>
						<header className='quote-header col-span-2'>Address</header>
						<div className='col-span-2'>
							<TextInput
								required
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='Location Name'
								{...form.getInputProps('name')}
							/>
						</div>
						<div className='col-span-2'>
							<Select
								required
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='Location Type'
								data={[
									{ value: LocationType.WAREHOUSE, label: 'Warehouse' },
									{ value: LocationType.STORE, label: 'Store' },
									{ value: LocationType.LASTMILE_CARRIER, label: 'Final Mile Courier' }
								]}
								{...form.getInputProps('type')}
							/>
						</div>
						<div className='col-span-2'>
							<TextInput
								required
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='Address Line 1'
								{...form.getInputProps('line1')}
							/>
						</div>
						<div className='col-span-2'>
							<TextInput
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='Address Line 2'
								{...form.getInputProps('line2')}
							/>
						</div>
						<div className='col-span-2 lg:col-span-1'>
							<TextInput
								required
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='City'
								{...form.getInputProps('city')}
							/>
						</div>
						<div className='col-span-2 lg:col-span-1'>
							<TextInput
								required
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='Region'
								{...form.getInputProps('region')}
							/>
						</div>
						<div className='col-span-2'>
							<TextInput
								required
								classNames={{
									input: 'py-4'
								}}
								size='md'
								radius={0}
								placeholder='Postal Code'
								{...form.getInputProps('postcode')}
							/>
						</div>
						<div className='col-span-2'>
							<Select
								classNames={{
									input: 'py-4'
								}}
								size='md'
								required
								searchable
								placeholder='Country'
								radius={0}
								data={countries.map(
									(country): SelectInputData => ({
										label: country.name,
										value: country.code
									})
								)}
								{...form.getInputProps('country')}
							/>
						</div>
					</div>
					<div id='driving-form-container' className='col-span-1 grid grid-cols-1 space-y-5'>
						<header className='quote-header'>Driver Instructions</header>
						<p>
							Please note: You are responsible for making appointments at pickup and delivery facilities. Appointment information added here will not be noted. Please add appointment information to fields included during
							shipment creation.
						</p>
						<div>
							<Textarea minRows={3} maxRows={6} size='md' radius={0} placeholder='Pickup Instructions' {...form.getInputProps('pickupInstructions')} />
						</div>
						<div>
							<Textarea minRows={3} maxRows={6} size='md' radius={0} placeholder='Delivery Instructions' {...form.getInputProps('deliveryInstructions')} />
						</div>
					</div>
					<div id='operating-hours' className='col-span-1 space-y-8'>
						<header className='quote-header'>Operating hours</header>
						<div className='relative w-auto border border-gray-300 px-8 py-4'>
							<button type='button' className='text-secondary absolute right-4 top-5 w-12 rounded bg-transparent' onClick={() => toggleOperatingHoursForm(true)}>
								Edit
							</button>
							<div className='flex flex-col space-y-4'>
								<h4 className='text-3xl font-normal'>Facility hours</h4>
								<table className='table-auto border-none'>
									<tbody>
										{form.values.operatingHours.map((item: OperatingHoursState, index) => {
											const openFormat: LocationTimeWindow = {
												h: item.facility.open['h'],
												m: item.facility.open['m']
											};
											const closeFormat: LocationTimeWindow = {
												h: item.facility.close['h'],
												m: item.facility.close['m']
											};
											return (
												<tr key={index}>
													<td>{moment().day(index).format('dddd')}</td>
													{item.facility.isActive ? (
														<td>
															{moment(openFormat).format('HH:mm')}
															&nbsp;-&nbsp;
															{moment(closeFormat).format('HH:mm')}
														</td>
													) : (
														<td>Closed</td>
													)}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div id='submit-container' className='flex col-span-2 space-x-8'>
						<button type='submit' className='voyage-button flex items-center justify-center h-14 w-64 text-lg'>
							<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
							<span>Save</span>
						</button>
						<button type='button' className='voyage-button h-14 w-64 bg-transparent text-lg text-black hover:bg-stone-100' onClick={() => router.back()}>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, query }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	if (session.id) {
		const shipper = await fetchShipper(session.id, token?.shipperId, prisma)
		store.dispatch(setShipper(shipper))
		const locations = await fetchLocations(token?.shipperId, prisma);
		store.dispatch(setLocations(locations));
	}
	return {
		props: {
			locationId: query?.locationId || '',
			locationName: query?.locationName || ''
		} // will be passed to the page component as props
	};
});

export default location;
