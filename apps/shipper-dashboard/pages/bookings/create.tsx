import React from 'react';
import { TextInput, Textarea, NumberInput, Select } from '@mantine/core';
import { useForm, formList } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';
import { ChevronDown, ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

const create = () => {
	const router = useRouter();

	const form = useForm({
		initialValues: {
			serviceType: '',
			shipmentType: '',
			schedulingType: '',
			activitiesRequired: formList([]),
			internalPONumber: '',
			customerPONumber: '',
			weight: '',
			quantity: 1,
			pickupDate: null,
			pickupLocation: '',
			deliveryLocation: ''
		}
	});

	const inputButton = classNames({
		'h-16': true,
		'px-3': true,
		border: true,
		'border-gray-300': true,
		'hover:bg-secondary': true,
		'hover:text-white': true,
		'font-medium': true
	});

	return (
		<div className='pb-4 px-8 min-h-screen'>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white' role='button' onClick={() => router.back()}>
				<ChevronLeft size={48} strokeWidth={2} color={'black'} />
				<span className='page-header'>Bookings</span>
			</section>
			<form onSubmit={form.onSubmit(values => console.log(values))} className='grid grid-cols-3 lg:grid-cols-4 gap-20'>
				<div id='quote-form-container' className='flex flex-col space-y-5 col-span-3'>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Service Type</header>
						<div className='py-4 grid grid-cols-1 lg:grid-cols-3 gap-y-4 lg:gap-x-6 xl:gap-x-12'>
							<button type='button' className={`${inputButton} ${form.values.serviceType === 'W2W' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('serviceType', 'W2W')}>
								Warehouse to warehouse
							</button>
							<button type='button' className={`${inputButton} ${form.values.serviceType === 'D2S' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('serviceType', 'D2S')}>
								Direct to store distribution
							</button>
							<button type='button' className={`${inputButton} ${form.values.serviceType === 'D2C' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('serviceType', 'D2C')}>
								Direct to carrier injections
							</button>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Shipment Type</header>
						<div className='py-4 grid grid-cols-1 lg:grid-cols-3 gap-y-4 lg:gap-x-6 xl:gap-x-12'>
							<button type='button' className={`${inputButton} ${form.values.shipmentType === 'FTL' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('shipmentType', 'FTL')}>
								FTL
							</button>
							<button type='button' className={`${inputButton} ${form.values.shipmentType === 'LTL' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('shipmentType', 'LTL')}>
								LTL
							</button>
							<button type='button' className={`${inputButton} ${form.values.shipmentType === 'LPS' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('shipmentType', 'LPS')}>
								Less than pallet size
							</button>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Load Type</header>
						<div className='border border-gray-300 p-4 grid grid-cols-4 lg:grid-cols-12 lg:row-span-3 gap-y-4 gap-x-12 pb-12'>
							<div className='lg:row-span-1 col-span-4'>
								<TextInput
									radius={0}
									label={
										<span>
											Internal PO No. <span className='text-voyage-grey'>(optional)</span>
										</span>
									}
									placeholder=''
									{...form.getInputProps('internalPONumber')}
								/>
							</div>
							<div className='lg:row-span-1 col-span-4'>
								<TextInput
									radius={0}
									label={
										<span>
											Customer PO No. <span className='text-voyage-grey'>(optional)</span>
										</span>
									}
									placeholder=''
									{...form.getInputProps('customerPONumber')}
								/>
							</div>
							<div className='lg:row-span-1 col-span-4 '>
								<NumberInput radius={0} required label='Weight' placeholder='' rightSection={<span className='text-voyage-grey pr-3'>Kg</span>} {...form.getInputProps('weight')} />
							</div>
							<div className='col-span-4 lg:col-span-6 lg:row-span-2'>
								<Textarea size='sm' radius={0} label='Load Description' required autosize minRows={3} maxRows={6} />
							</div>
							<div className='lg:col-span-6 col-span-4 lg:row-span-2 grid grid-cols-12 gap-x-6 gap-y-4'>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput
										size='sm'
										defaultValue={1}
										radius={0}
										min={1}
										max={100}
										label='Item Length'
										placeholder='Units'
										{...form.getInputProps('quantity')}
										rightSection={<span className='text-voyage-grey pr-3'>cm</span>}
									/>
								</div>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput
										size='sm'
										defaultValue={1}
										radius={0}
										min={1}
										max={100}
										label='Item Width'
										placeholder='Units'
										{...form.getInputProps('quantity')}
										rightSection={<span className='text-voyage-grey pr-3'>cm</span>}
									/>
								</div>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput
										size='sm'
										defaultValue={1}
										radius={0}
										min={1}
										max={100}
										label='Item Height'
										placeholder='Units'
										{...form.getInputProps('quantity')}
										rightSection={<span className='text-voyage-grey pr-3'>cm</span>}
									/>
								</div>
								<div className='col-span-4 lg:col-span-6 lg:row-span-1'>
									<NumberInput size='sm' defaultValue={1} radius={0} min={1} max={100} label='Item Quantity' placeholder='Units' {...form.getInputProps('quantity')} />
								</div>
								<div className='col-span-4 lg:col-span-6 lg:row-span-1'>
									<Select
										size='sm'
										radius={0}
										label='Item Packaging'
										placeholder='Pick one'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={['Pallets', 'Crates', 'Skids', 'Containers', 'Boxes']}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Pickup</header>
							<div className=''>
								<Select
									placeholder='Select Location'
									radius={0}
									size='md'
									defaultValue='No preference'
									rightSection={<ChevronDown size={14} />}
									rightSectionWidth={30}
									styles={{ rightSection: { pointerEvents: 'none' } }}
									data={['Warehouse 1', 'Warehouse 2', 'Warehouse 3', 'Warehouse 4', 'Warehouse 5']}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Delivery</header>
							<div className=''>
								<Select
									placeholder='Select Destination'
									radius={0}
									size='md'
									defaultValue='No preference'
									rightSection={<ChevronDown size={14} />}
									rightSectionWidth={30}
									styles={{ rightSection: { pointerEvents: 'none' } }}
									data={['Store 1', 'Store 2', 'Store 3', 'Store 4', 'Store 5']}
								/>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Scheduling</header>
						<div className='grid grid-cols-1 lg:grid-cols-3 gap-y-4 lg:gap-x-6 xl:gap-x-12'>
							<button type='button' className={`${inputButton} ${form.values.schedulingType === 'one-time' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('schedulingType', 'one-time')}>
								One-time
							</button>
							<button type='button' className={`${inputButton} ${form.values.schedulingType === 'recurring' && 'bg-secondary text-white'}`} onClick={() => form.setFieldValue('schedulingType', 'recurring')}>
								Recurring
							</button>
						</div>
						<div className='flex flex-col space-y-4'>
							<p className='font-normal'>Select a pickup date, and we’ll calculate a delivery date based on transit time.</p>
							<DatePicker className='w-72' radius={0} size='md' placeholder='Pickup Date' rightSection={<Calendar size={16} />} {...form.getInputProps('pickupDate')} />
						</div>
					</div>
					<div className='grid grid-cols-1 gap-5'>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Activities/Equipment Required</header>
							<div className='py-4 grid grid-cols-1 lg:grid-cols-4 gap-y-4 lg:gap-x-6 xl:gap-x-12'>
								<button
									type='button'
									className={`${inputButton} ${form.values.activitiesRequired.includes('No Preference') && 'bg-secondary text-white'}`}
									onClick={() => {
										if (!form.values.activitiesRequired.includes('No Preference')) {
											form.addListItem('activitiesRequired', 'No Preference');
										} else {
											const index = form.values.activitiesRequired.indexOf('No Preference');
											form.removeListItem('activitiesRequired', index);
										}
									}}
								>
									No Preference
								</button>
								<button
									type='button'
									className={`${inputButton} ${form.values.activitiesRequired.includes('Flatbed Trailer') && 'bg-secondary text-white'}`}
									onClick={() => {
										if (!form.values.activitiesRequired.includes('Flatbed Trailer')) {
											form.addListItem('activitiesRequired', 'Flatbed Trailer');
										} else {
											const index = form.values.activitiesRequired.indexOf('Flatbed Trailer');
											form.removeListItem('activitiesRequired', index);
										}
									}}
								>
									Flatbed Trailer
								</button>
								<button
									type='button'
									className={`${inputButton} ${form.values.activitiesRequired.includes('Luton Van') && 'bg-secondary text-white'}`}
									onClick={() => {
										if (!form.values.activitiesRequired.includes('Luton Van')) {
											form.addListItem('activitiesRequired', 'Luton Van');
										} else {
											const index = form.values.activitiesRequired.indexOf('Luton Van');
											form.removeListItem('activitiesRequired', index);
										}
									}}
								>
									Luton Van
								</button>
								<button
									type='button'
									className={`${inputButton} ${form.values.activitiesRequired.includes('Tail lift') && 'bg-secondary text-white'}`}
									onClick={() => {
										if (!form.values.activitiesRequired.includes('Tail lift')) {
											form.addListItem('activitiesRequired', 'Tail lift');
										} else {
											const index = form.values.activitiesRequired.indexOf('Tail lift');
											form.removeListItem('activitiesRequired', index);
										}
									}}
								>
									Tail lift
								</button>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-5'>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Notes</header>
							<Textarea radius={0} placeholder='Notes' required autosize minRows={3} maxRows={6} />
						</div>
					</div>
				</div>
				<div id='button-container' className='flex flex-col justify-center space-y-8'>
					<button className='voyage-button'>Book</button>
					<button className='voyage-button'>Save and go to Booking</button>
					<button className='voyage-button bg-transparent text-black hover:bg-stone-100'>Cancel</button>
				</div>
			</form>
		</div>
	);
};

export default create;
