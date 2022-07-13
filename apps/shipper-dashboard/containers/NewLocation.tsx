import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import OperatingHoursForm from '../modals/OperatingHoursForm';
import { Select, Textarea, TextInput } from '@mantine/core';
import { LocationType, OperatingHoursState, TimeWindow } from '../utils/types';
import moment from 'moment';
import { formList, useForm } from '@mantine/form';
import { useDispatch } from 'react-redux';
import { DEFAULT_OPERATING_HOURS } from '../utils/constants';
import { nanoid } from 'nanoid';

const NewLocation = ({ onCancel, onSubmit, locationID="", location=null }) => {
	const [operatingHoursForm, toggleOperatingHoursForm] = useState(false);
	const dispatch = useDispatch();

	const form = useForm({
		initialValues: {
			id: locationID || `location_${nanoid(16)}`,
			name: location?.name,
			type: location ? location.type : LocationType.WAREHOUSE,
			addressLine1: location?.addressLine1,
			addressLine2: location?.addressLine2,
			city: location?.city,
			postcode: location?.postcode,
			region: location?.region,
			country: location?.country,
			pickupInstructions: location?.pickupInstructions,
			deliveryInstructions: location?.deliveryInstructions,
			operatingHours: location ? formList([...location.operatingHours]) : formList([...DEFAULT_OPERATING_HOURS])
		}
	});

	const handleSubmit = useCallback((values) => {
		form.setFieldValue('operatingHours', values.operatingHours)
		toggleOperatingHoursForm(false)
	}, []);

	return (
		<div className='py-5 workflows-container'>
			<OperatingHoursForm opened={operatingHoursForm} onClose={() => toggleOperatingHoursForm(false)} onSave={handleSubmit} operatingHours={location?.operatingHours}/>
			<form onSubmit={form.onSubmit(onSubmit)} className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-y-10 lg:gap-x-20'>
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
							{...form.getInputProps('name')}
						/>
					</div>
					<div className='col-span-2'>
						<Select
							classNames={{
								input: 'py-4'
							}}
							size='md'
							radius={0}
							placeholder='Location Type'
							data={[
								{ value: LocationType.WAREHOUSE, label: 'Warehouse' },
								{ value: LocationType.STORE, label: 'Store' },
								{ value: LocationType.LASTMILE_COURIER, label: 'Final Mile Courier' }
							]}
							{...form.getInputProps('type')}
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
							placeholder='Postal Code'
							{...form.getInputProps('postcode')}
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
				<div id='operating-hours' className='col-span-1 space-y-8'>
					<header className='quote-header'>Operating hours</header>
					<div className='relative px-8 py-4 border border-gray-300 w-auto'>
						<button type="button" className='text-secondary rounded w-12 absolute right-4 top-5 bg-transparent' onClick={() => toggleOperatingHoursForm(true)}>
							Edit
						</button>
						<div className='flex flex-col space-y-4'>
							<h4 className='text-3xl font-normal'>Facility hours</h4>
							<table className='table-auto border-none'>
								<tbody>
									{form.values.operatingHours.map((item: OperatingHoursState, index) => {
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
												{item.facility.isActive ? <td>
													{moment(openFormat).format('HH:mm')}
													&nbsp;-&nbsp;
													{moment(closeFormat).format('HH:mm')}
												</td> : <td>Closed</td>}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div id='submit-container' className='col-span-2 space-x-8'>
					<button type="submit" className='voyage-button w-64 h-14 text-lg'>
						Save
					</button>
					<button type="button" className='voyage-button w-64 h-14 text-lg bg-transparent text-black hover:bg-stone-100' onClick={onCancel}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

NewLocation.propTypes = {
	location: PropTypes.any,
	locationID: PropTypes.string,
	onCancel: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired
};

export default NewLocation;
