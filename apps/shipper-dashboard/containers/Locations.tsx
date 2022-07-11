import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { Textarea, TextInput } from '@mantine/core';
import OperatingHoursForm from '../components/OperatingHoursForm';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { OperatingHoursState, TimeWindow } from '../utils/types';

const Locations = props => {
	const dispatch = useDispatch();
	const operatingHours = useSelector(state => state['operatingHours']);
	const [locationForm, showLocationForm] = useState(false);
	const [operatingHoursForm, toggleOperatingHoursForm] = useState(false);

	const form = useForm({
		initialValues: {
			locationName: '',
			locationType: '',
			addressLine1: '',
			addressLine2: '',
			city: '',
			postalCode: '',
			region: '',
			country: '',
			pickupInstructions: '',
			deliveryInstructions: '',
			operatingHours
		}
	});

	// @ts-ignore
	// @ts-ignore
	return locationForm ? (
		<div className='py-5 workflows-container'>
			<OperatingHoursForm opened={operatingHoursForm} onClose={() => toggleOperatingHoursForm(false)} />
			<form onSubmit={form.onSubmit(values => console.log(values))} className='grid grid-cols-1 lg:grid-cols-2 gap-y-10 lg:gap-20'>
				<div id='address-form-container' className='grid grid-cols-1 lg:grid-cols-2 gap-5 col-span-1'>
					<header className='quote-header col-span-2'>Address</header>
					<div className='col-span-2'>
						<TextInput
							classNames={{
								input: 'py-4'
							}}
							size='md'
							radius={0}
							placeholder='Location Name'
							{...form.getInputProps('locationName')}
						/>
					</div>
					<div className='col-span-2'>
						<TextInput
							classNames={{
								input: 'py-4'
							}}
							size='md'
							radius={0}
							placeholder='Location Type'
							{...form.getInputProps('locationType')}
						/>
					</div>
					<div className='col-span-2'>
						<TextInput
							classNames={{
								input: 'py-4'
							}}
							size='md'
							radius={0}
							placeholder='Address Line 1'
							{...form.getInputProps('addressLine1')}
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
							{...form.getInputProps('addressLine2')}
						/>
					</div>
					<div className='col-span-2 lg:col-span-1'>
						<TextInput
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
							classNames={{
								input: 'py-4'
							}}
							size='md'
							radius={0}
							placeholder='Country'
							{...form.getInputProps('country')}
						/>
					</div>
				</div>
				<div id='driving-form-container' className='grid grid-cols-1 col-span-1 space-y-5'>
					<header className='quote-header'>Driver Instructions</header>
					<p>
						Please note: You are responsible for making appointments at pickup and delivery facilities. Appointment information added here will not be noted. Please add appointment information to fields included during shipment
						creation.
					</p>
					<div>
						<Textarea minRows={3} maxRows={6} size='md' radius={0} placeholder='Pickup Instructions' {...form.getInputProps('pickupInstructions')} />
					</div>
					<div>
						<Textarea minRows={3} maxRows={6} size='md' radius={0} placeholder='Delivery Instructions' {...form.getInputProps('deliveryInstructions')} />
					</div>
				</div>
				<div id='operating-hours' className='col-span-2 space-y-8'>
					<header className='quote-header'>Operating hours</header>
					<div className='relative grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 px-8 py-4 border border-gray-300'>
						<button
							className='text-secondary rounded w-12 absolute right-4 top-5 bg-transparent'
							onClick={() => {
								toggleOperatingHoursForm(true);
								/*dispatch(
									updateHours({
										index: 0,
										value: {
											shipping: {
												isActive: false,
												open: 10,
												close: 14
											},
											receiving: {
												isActive: false,
												open: 10,
												close: 14
											},
											facility: {
												isActive: false,
												open: 10,
												close: 14
											}
										}
									})
								);*/
							}}
						>
							Edit
						</button>
						<div className='flex flex-col space-y-4'>
							<h4 className='text-3xl font-normal'>Shipping hours</h4>
							<table className='table-auto border-none'>
								<tbody>
									{operatingHours.map((item: OperatingHoursState, index) => {
										const openFormat: TimeWindow = {
											h: item.shipping.open['h'],
											m: item.shipping.open['m']
										}
										const closeFormat: TimeWindow = {
											h: item.shipping.close['h'],
											m: item.shipping.close['m']
										}
										return (
											<tr key={index}>
												<td>{moment().day(index).format('dddd')}</td>
												<td>
													{moment(openFormat).format('HH:mm')}
													&nbsp;-&nbsp;
													{moment(closeFormat).format('HH:mm')}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<div className='flex flex-col space-y-4'>
							<h4 className='text-3xl font-normal'>Receiving hours</h4>
							<table className='table-auto border-none'>
								<tbody>
									{operatingHours.map((item: OperatingHoursState, index) => {
										const openFormat: TimeWindow = {
											h: item.receiving.open['h'],
											m: item.receiving.open['m']
										};
										const closeFormat: TimeWindow = {
											h: item.receiving.close['h'],
											m: item.receiving.close['m']
										};
										return (
											<tr key={index}>
												<td>{moment().day(index).format('dddd')}</td>
												<td>
													{moment(openFormat).format('HH:mm')}
													&nbsp;-&nbsp;
													{moment(closeFormat).format('HH:mm')}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<div className='flex flex-col space-y-4'>
							<h4 className='text-3xl font-normal'>Facility hours</h4>
							<table className='table-auto border-none'>
								<tbody>
									{operatingHours.map((item: OperatingHoursState, index) => {
										const openFormat: TimeWindow = {
											h: item.facility.open['h'],
											m: item.facility.open['m']
										};
										const closeFormat: TimeWindow = {
											h: item.facility.close['h'],
											m: item.facility.close['m']
										};
										return (
											<tr key={index}>
												<td>{moment().day(index).format('dddd')}</td>
												<td>
													{moment(openFormat).format('HH:mm')}
													&nbsp;-&nbsp;
													{moment(closeFormat).format('HH:mm')}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div id='submit-container' className='col-span-2 space-x-8'>
					<button className='voyage-button w-64 h-14 text-lg' onClick={() => showLocationForm(false)}>
						Save
					</button>
					<button className='voyage-button w-64 h-14 text-lg bg-transparent text-black hover:bg-stone-100' onClick={() => showLocationForm(false)}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	) : (
		<div className='py-5 workflows-container'>
			<header className='flex justify-end'>
				<button className='voyage-button w-56' onClick={() => showLocationForm(true)}>
					Create new location
				</button>
			</header>
			<div className='grid grid-cols-1 gap-6'>
				<h3 className='shipment-header'>You have no locations saved</h3>
			</div>
		</div>
	);
};

Locations.propTypes = {};

export default Locations;
