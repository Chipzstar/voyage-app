import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { numericId } from '@voyage-app/shared-utils';
import moment from 'moment/moment';
import { PACKAGE_TYPE, SHIPMENT_ACTIVITY } from '@voyage-app/shared-types';
// import { createShipment } from '../../store/features/shipmentsSlice';
import { Calendar, ChevronDown } from 'tabler-icons-react'
import { Anchor, Breadcrumbs, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@voyage-app/shared-ui-components';
import Link from 'next/link';
import ContentContainer from '../../layout/ContentContainer';
// import { createBooking } from '../../../shipper-dashboard/store/features/bookingsSlice';

const book = props => {
	const router = useRouter();
	const form = useForm({
		initialValues: {
			id: `VOY-ID${numericId(3)}`,
			createdAt: moment().unix(),
			schedulingType: '',
			internalPONumber: '',
			customerPONumber: '',
			weight: 0,
			quantity: 1,
			height: 1,
			length: 1,
			width: 1,
			packageType: '',
			pickupDate: null,
			pickupLocation: '',
			pickupCountry: '',
			deliveryLocation: '',
			deliveryCountry: '',
			description: '',
			vehicleType: '',
			driver: '',
			controller: ''
		}
	});

	const items = [
		{ title: 'Home', href: '/' },
		{ title: 'Trips', href: '/trips' },
		{ title: 'Book', href: '/trips/book' }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	const handleSubmit = useCallback(values => {
		// update the createdAt timestamp
		console.log(values);
	}, []);

	return (
		<ContentContainer>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white z-50' role='button'>
				<Breadcrumbs>{items}</Breadcrumbs>
			</section>
			<form onSubmit={form.onSubmit(handleSubmit)} className='grid grid-cols-3 lg:grid-cols-4 gap-20'>
				<div id='quote-form-container' className='flex flex-col space-y-5 col-span-3'>
					<div className='grid grid-cols-1 gap-6'>
						<header className='form-header'>Load Type</header>
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
								<NumberInput radius={0} min={0} max={26000} label='Weight' placeholder='' rightSection={<span className='text-voyage-grey pr-3'>Kg</span>} {...form.getInputProps('weight')} />
							</div>
							<div className='col-span-4 lg:col-span-6 lg:row-span-2'>
								<Textarea size='sm' radius={0} label='Load Description' autosize minRows={3} maxRows={6} {...form.getInputProps('description')} />
							</div>
							<div className='lg:col-span-6 col-span-4 lg:row-span-2 grid grid-cols-12 gap-x-6 gap-y-4'>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={100} label='Item Length' placeholder='Units' {...form.getInputProps('length')} rightSection={<span className='text-voyage-grey pr-3'>cm</span>} />
								</div>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={100} label='Item Width' placeholder='Units' {...form.getInputProps('width')} rightSection={<span className='text-voyage-grey pr-3'>cm</span>} />
								</div>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={100} label='Item Height' placeholder='Units' rightSection={<span className='text-voyage-grey pr-3'>cm</span>} {...form.getInputProps('height')} />
								</div>
								<div className='col-span-4 lg:col-span-6 lg:row-span-1'>
									<NumberInput size='sm' radius={0} min={1} max={26} label='Item Quantity' placeholder='Units' {...form.getInputProps('quantity')} />
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
										data={[
											{ label: 'Pallets', value: PACKAGE_TYPE.PALLET },
											{ label: 'Crates', value: PACKAGE_TYPE.CRATE },
											{ label: 'Skids', value: PACKAGE_TYPE.SKIDS },
											{ label: 'Containers', value: PACKAGE_TYPE.CONTAINER },
											{ label: 'Boxes', value: PACKAGE_TYPE.BOX }
										]}
										{...form.getInputProps('packageType')}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-5'>
						<div className='flex flex-col space-y-6'>
							<header className='form-header'>Pickup</header>
							<div className=''>
								<TextInput size='md' radius={0} placeholder='Location name or Postal Code' {...form.getInputProps('pickupLocation')} />
							</div>
							<div className=''>
								<TextInput size='md' radius={0} placeholder='Country' {...form.getInputProps('pickupCountry')} />
							</div>
						</div>
						<div className='flex flex-col space-y-6'>
							<header className='form-header'>Delivery</header>
							<div className=''>
								<TextInput size='md' radius={0} placeholder='Location name or Postal Code' {...form.getInputProps('deliveryLocation')} />
							</div>
							<div className=''>
								<TextInput size='md' radius={0} placeholder='Country' {...form.getInputProps('deliveryCountry')} />
							</div>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-6'>
						<div id='col-1'>
							<div className='flex flex-col space-y-4 h-48'>
								<header className='space-y-3 md:h-28'>
									<h1 className='form-header'>Scheduling</h1>
									<p className='font-normal'>Select a pickup date, and we’ll calculate a delivery date based on transit time.</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<DateTimePicker
										allowLevelChange={false}
										radius={0}
										icon={<Calendar size={16}/>}
										size='md'
										placeholder='Pickup Date'
										inputFormat={'DD-MMM-YYYY HH:mm a'}
										value={form.values.pickupDate ? moment.unix(form.values.pickupDate).toDate() : null}
										onChange={(value: Date) => form.setFieldValue('pickupDate', value ? moment(value).unix() : null)}
										classNames={{ root: 'md:w-72' }}
									/>
								</div>
							</div>
						</div>
						<div>
							<div className='flex flex-col space-y-4 h-48'>
								<header className='space-y-3 md:h-28'>
									<h1 className='form-header'>Select Vehicle</h1>
									<p className='font-normal'>Select the type of vehicle required for this load</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<Select
										size='md'
										radius={0}
										placeholder='Select a vehicle'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={[
											{ label: 'No Preference', value: SHIPMENT_ACTIVITY.NO_PREFERENCE },
											{ label: 'Flat Bed Trailer', value: SHIPMENT_ACTIVITY.FLATBED_TRAILER },
											{ label: 'Jumbo Trailer', value: SHIPMENT_ACTIVITY.JUMBO_TRAILER },
											{ label: 'Tail Lift', value: SHIPMENT_ACTIVITY.TAIL_LIFT }
										]}
										{...form.getInputProps('vehicleType')}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-6'>
						<div id='col-1'>
							<div className='flex flex-col space-y-4'>
								<header className='space-y-4'>
									<h1 className='form-header'>Select Driver</h1>
									<p className='font-normal'>Select the driver who should carry out the load</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<Select
										size='md'
										radius={0}
										placeholder='Select driver'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={[
											{ label: 'Chisom', value: '1' },
											{ label: 'Ola', value: '2' },
											{ label: 'Rayan', value: '3' }
										]}
										{...form.getInputProps('driver')}
									/>
								</div>
							</div>
						</div>
						<div>
							<div className='flex flex-col space-y-4'>
								<header className='space-y-4'>
									<h1 className='form-header'>Select Controller</h1>
									<p className='font-normal'>Select a controller from your team to oversee this load</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<Select
										size='md'
										radius={0}
										placeholder='Select controller'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={[
											{ label: 'Chisom', value: '1' },
											{ label: 'Ola', value: '2' },
											{ label: 'Rayan', value: '3' }
										]}
										{...form.getInputProps('controller')}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id='button-container' className='flex flex-col flex-wrap justify-center space-y-8'>
					<button type='submit' className='voyage-button w-auto'>
						Book
					</button>
					<button type='button' className='voyage-button w-auto bg-transparent text-black hover:bg-stone-100' onClick={() => router.back()}>
						Cancel
					</button>
				</div>
			</form>
		</ContentContainer>
	);
};

export default book;
