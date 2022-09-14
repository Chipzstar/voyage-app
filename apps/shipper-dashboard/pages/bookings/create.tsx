import React, { useCallback, useMemo, useState } from 'react';
import { Loader, LoadingOverlay, MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Calendar, CalendarStats, Check, ChevronDown, ChevronLeft, X } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { LocationType, PACKAGE_TYPE, SCHEDULING_TYPE, SERVICE_TYPE, SHIPMENT_ACTIVITY, SHIPMENT_TYPE } from '@voyage-app/shared-types';
import { Booking } from '../../utils/types';
import { useDispatch, useSelector } from 'react-redux';
import { CustomLoader, DateTimePicker } from '@voyage-app/shared-ui-components';
import { PATHS, PUBLIC_PATHS } from 'apps/shipper-dashboard/utils/constants';
import { createShipment } from '../../store/features/shipmentsSlice';
import moment from 'moment';
import { fetchBookings, fetchLocations, fetchShipper, generateShipment } from '../../utils/functions';
import { createBooking, deleteBooking, setBookings, updateBooking, useBooking } from '../../store/features/bookingsSlice';
import { AppDispatch, wrapper } from '../../store';
import { getToken } from 'next-auth/jwt';
import prisma from '../../db';
import { setLocations, useLocation } from '../../store/features/locationSlice';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { setShipper } from '../../store/features/profileSlice';
import { notifyError, notifySuccess, numericId } from '@voyage-app/shared-utils';

const SUBMIT_TYPES = {
	SAVE_BOOKING: 'SAVE_BOOKING',
	CREATE_SHIPMENT: 'CREATE_SHIPMENT',
}

const create = ({ bookingID }) => {
	const router = useRouter();
	const [loading, setLoading] = useState({ show: false, type: SUBMIT_TYPES.CREATE_SHIPMENT});
	const dispatch = useDispatch<AppDispatch>();
	const locations = useSelector(useLocation);
	const bookings = useSelector(useBooking);
	const [isFTL, setFTL] = useState(false);

	const booking = useMemo(() => bookings.find((booking: Booking) => booking.bookingId === bookingID), [bookings]);

	const form = useForm<Booking>({
		initialValues: {
			id: booking?.id ?? undefined,
			shipperId: booking?.shipperId ?? undefined,
			bookingId: booking?.bookingId ?? `VOY-ID${numericId(8)}`,
			serviceType: booking?.serviceType ?? '',
			shipmentType: booking?.shipmentType ?? '',
			schedulingType: booking?.schedulingType ?? '',
			activitiesRequired: booking?.activitiesRequired ? booking.activitiesRequired : [],
			internalPONumber: booking?.internalPONumber ?? '',
			customerPONumber: booking?.customerPONumber ?? '',
			weight: booking?.weight ?? null,
			quantity: booking?.quantity ?? null,
			height: booking?.height ?? null,
			length: booking?.length ?? null,
			width: booking?.width ?? null,
			packageType: booking?.packageType ?? PACKAGE_TYPE.PALLET,
			pickupDate: booking?.pickupDate ?? null,
			pickupLocation: booking?.pickupLocation ?? '',
			deliveryLocation: booking?.deliveryLocation ?? '',
			description: booking?.description ?? '',
			status: 'Incomplete',
			notes: booking?.notes ?? ''
		},
		validate: values => ({
			pickupLocation: !values.pickupLocation ? 'Please choose a pickup location' : null,
			deliveryLocation: !values.deliveryLocation ? 'Please choose a delivery location' : null,
			pickupDate: !values.pickupDate ? 'Please select a date for pickup' : null,
			schedulingType: !values.schedulingType ? 'Please provide the schedule-type for this shipment' : null,
			shipmentType: !values.shipmentType ? 'Please provide a Shipment Type' : null,
			serviceType: !values.serviceType ? 'Please provide a Service Type' : null
		})
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
	const warehouses = useMemo(() => locations.filter(({ type }) => type === LocationType.WAREHOUSE), [locations]);
	const stores = useMemo(() => locations.filter(({ type }) => type === LocationType.STORE), [locations]);
	const carriers = useMemo(() => locations.filter(({ type }) => type === LocationType.LASTMILE_CARRIER), [locations]);

	const pickupData = useMemo(() => {
		switch (form.values.serviceType) {
			case SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE:
				return warehouses.map(({ id, name }) => ({ value: id, label: name }));
			case SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION:
				return warehouses.map(({ id, name }) => ({ value: id, label: name }));
			case SERVICE_TYPE.DIRECT_TO_CARRIER_INJECTION:
				return warehouses
					.map(({ id, name }) => ({ value: id, label: name }))
					.concat(
						stores.map(({ id, name }) => ({
							value: id,
							label: name
						}))
					);
			default:
				return locations.map(({ id, name }) => ({ value: id, label: name }));
		}
	}, [form.values.serviceType, locations]);
	const deliveryData = useMemo(() => {
		switch (form.values.serviceType) {
			case SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE:
				return warehouses.map(({ id, name }) => ({ value: id, label: name }));
			case SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION:
				return stores.map(({ id, name }) => ({ value: id, label: name }));
			case SERVICE_TYPE.DIRECT_TO_CARRIER_INJECTION:
				return carriers.map(({ id, name }) => ({ value: id, label: name }));
			default:
				return locations.map(({ id, name }) => ({ value: id, label: name }));
		}
	}, [form.values.serviceType, locations]);

	const handleFTL = (active, shipmentType) => {
		setFTL(active);
		form.setFieldValue('shipmentType', shipmentType);
		if (active) {
			form.setFieldValue('weight', 26000);
			form.setFieldValue('packageType', PACKAGE_TYPE.PALLET);
			form.setFieldValue('quantity', 26);
		}
	};

	const handleSubmit = useCallback(
		async values => {
			setLoading(prevState => ({...prevState, show: true}));
			const pickupLocation = locations.find(({ id }) => id === values.pickupLocation);
			const deliveryLocation = locations.find(({ id }) => id === values.deliveryLocation);
			try {
				let shipment = await generateShipment(values, pickupLocation, deliveryLocation);
				shipment = await dispatch(createShipment(shipment)).unwrap();
				console.log('-----------------------------------------------');
				console.log(shipment);
				console.log('-----------------------------------------------');
				notifySuccess('create-shipment-success', 'Your shipment was created successfully!', <Check size={20} />);
				booking && await dispatch(deleteBooking(booking.id)).unwrap()
				setLoading(prevState => ({...prevState, show: false}));
				router.push(PATHS.SHIPMENTS).then(() => console.log('Navigated to shipments page'));
			} catch (err) {
				console.error(err);
				notifyError('create-shipment-error', err.message, <X size={20} />);
				setLoading(prevState => ({...prevState, show: false}));
			}
		},
		[locations, booking]
	);

	return (
		<div className='min-h-screen px-8 pb-4'>
			<LoadingOverlay loader={<CustomLoader text='Creating Shipment...' />} visible={loading.show && loading.type === SUBMIT_TYPES.CREATE_SHIPMENT} overlayBlur={2} />
			<section className='sticky top-0 z-50 flex items-center space-x-4 bg-white pt-4 pb-8' role='button' onClick={() => router.back()}>
				<ChevronLeft size={48} strokeWidth={2} color={'black'} />
				<span className='page-header'>Bookings</span>
			</section>
			<form onSubmit={form.onSubmit(handleSubmit)} className='grid grid-cols-3 gap-20 lg:grid-cols-4'>
				<div id='quote-form-container' className='col-span-3 flex flex-col space-y-5'>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Service Type</header>
						<div className='grid grid-cols-1 gap-y-4 py-4 lg:grid-cols-3 lg:gap-x-6 xl:gap-x-12'>
							<button
								type='button'
								className={`${inputButton} ${form.values.serviceType === SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE && 'bg-secondary text-white'}`}
								onClick={() => form.setFieldValue('serviceType', SERVICE_TYPE.WAREHOUSE_TO_WAREHOUSE)}
							>
								Warehouse to warehouse
							</button>
							<button
								type='button'
								className={`${inputButton} ${form.values.serviceType === SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION && 'bg-secondary text-white'}`}
								onClick={() => form.setFieldValue('serviceType', SERVICE_TYPE.DIRECT_TO_STORE_DISTRIBUTION)}
							>
								Direct to store distribution
							</button>
							<button
								type='button'
								className={`${inputButton} ${form.values.serviceType === SERVICE_TYPE.DIRECT_TO_CARRIER_INJECTION && 'bg-secondary text-white'}`}
								onClick={() => form.setFieldValue('serviceType', SERVICE_TYPE.DIRECT_TO_CARRIER_INJECTION)}
							>
								Direct to carrier injections
							</button>
							{form.errors.serviceType && <span className='text-red-500'>{form.errors.serviceType}</span>}
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Shipment Type</header>
						<div className='grid grid-cols-1 gap-y-4 py-4 lg:grid-cols-3 lg:gap-x-6 xl:gap-x-12'>
							<button type='button' className={`${inputButton} ${form.values.shipmentType === 'FTL' && 'bg-secondary text-white'}`} onClick={() => handleFTL(true, SHIPMENT_TYPE.FULL_TRUCK_LOAD)}>
								FTL
							</button>
							<button type='button' className={`${inputButton} ${form.values.shipmentType === 'LTL' && 'bg-secondary text-white'}`} onClick={() => handleFTL(false, SHIPMENT_TYPE.LESS_THAN_TRUCK_LOAD)}>
								LTL
							</button>
							<button type='button' className={`${inputButton} ${form.values.shipmentType === 'LPS' && 'bg-secondary text-white'}`} onClick={() => handleFTL(false, SHIPMENT_TYPE.LESS_THAN_PALLET_SIZE)}>
								Less than pallet size
							</button>
							{form.errors.shipmentType && <span className='text-red-500'>{form.errors.shipmentType}</span>}
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Load Type</header>
						<div className='grid grid-cols-4 gap-y-4 gap-x-12 border border-gray-300 p-4 pb-12 lg:row-span-3 lg:grid-cols-12'>
							<div className='col-span-4 lg:row-span-1'>
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
							<div className='col-span-4 lg:row-span-1'>
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
							<div className='col-span-4 lg:row-span-1 '>
								<NumberInput
									radius={0}
									min={0}
									max={26000}
									disabled={isFTL}
									required={!isFTL}
									label='Weight'
									placeholder=''
									rightSection={<span className='text-voyage-grey pr-3'>Kg</span>}
									{...form.getInputProps('weight')}
								/>
							</div>
							<div className='col-span-4 lg:col-span-6 lg:row-span-2'>
								<Textarea size='sm' radius={0} label='Load Description' autosize minRows={3} maxRows={6} {...form.getInputProps('description')} />
							</div>
							<div className='col-span-4 grid grid-cols-12 gap-x-6 gap-y-4 lg:col-span-6 lg:row-span-2'>
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
									<NumberInput required={!isFTL} size='sm' radius={0} min={1} max={26} disabled={isFTL} label='Item Quantity' placeholder='Units' {...form.getInputProps('quantity')} />
								</div>
								<div className='col-span-4 lg:col-span-6 lg:row-span-1'>
									<Select
										disabled={isFTL}
										required={!isFTL}
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
					<div className='grid grid-cols-2 gap-6'>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Pickup</header>
							<div className=''>
								<Select
									placeholder='Select Origin'
									radius={0}
									size='md'
									searchable
									creatable
									getCreateLabel={query => `+ Create ${query}`}
									onCreate={query => router.push(`${PATHS.NEW_LOCATION}?locationName=${query}`, ``, { scroll: true })}
									required
									rightSection={<ChevronDown size={14} />}
									rightSectionWidth={30}
									styles={{ rightSection: { pointerEvents: 'none' } }}
									data={pickupData}
									{...form.getInputProps('pickupLocation')}
								/>
							</div>
						</div>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Delivery</header>
							<div className=''>
								<Select
									required
									placeholder='Select Destination'
									radius={0}
									size='md'
									searchable
									creatable
									getCreateLabel={query => `+ Create ${query}`}
									onCreate={query => router.push(`${PATHS.NEW_LOCATION}?locationName=${query}`, ``, { scroll: true })}
									rightSection={<ChevronDown size={14} />}
									rightSectionWidth={30}
									styles={{ rightSection: { pointerEvents: 'none' } }}
									data={deliveryData}
									{...form.getInputProps('deliveryLocation')}
								/>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-6'>
						<header className='quote-header'>Scheduling</header>
						<div className='grid grid-cols-1 gap-y-4 lg:grid-cols-3 lg:gap-x-6 xl:gap-x-12'>
							<button
								type='button'
								className={`${inputButton} ${form.values.schedulingType === SCHEDULING_TYPE.ONE_TIME && 'bg-secondary text-white'}`}
								onClick={() => form.setFieldValue('schedulingType', SCHEDULING_TYPE.ONE_TIME)}
							>
								One-time
							</button>
							<button
								type='button'
								className={`${inputButton} ${form.values.schedulingType === SCHEDULING_TYPE.RECURRING && 'bg-secondary text-white'}`}
								onClick={() => form.setFieldValue('schedulingType', SCHEDULING_TYPE.RECURRING)}
							>
								Recurring
							</button>
							{form.errors.schedulingType && <span className='text-red-500'>{form.errors.schedulingType}</span>}
						</div>
						<div className='flex flex-col'>
							<p className='font-normal'>Select a pickup date, and we’ll calculate a delivery date based on transit time.</p>
							<div className='flex flex-row items-center space-x-6'>
								<DateTimePicker
									radius={0}
									error={form.errors['pickupDate']}
									allowLevelChange={false}
									icon={<Calendar size={16} />}
									size='md'
									placeholder='Pickup Date'
									inputFormat={'DD-MMM-YYYY HH:mm a'}
									value={form.values.pickupDate ? moment.unix(form.values.pickupDate).toDate() : null}
									onChange={(value: Date) => form.setFieldValue('pickupDate', moment(value).unix())}
									classNames={{ root: 'md:w-72' }}
								/>
								{form.values.schedulingType === SCHEDULING_TYPE.RECURRING && (
									<MultiSelect
										radius={0}
										size='md'
										data={[
											{ value: '1', label: 'Monday' },
											{ value: '2', label: 'Tuesday' },
											{ value: '3', label: 'Wednesday' },
											{ value: '4', label: 'Thursday' },
											{ value: '5', label: 'Friday' },
											{ value: '6', label: 'Saturday' },
											{ value: '0', label: 'Sunday' }
										]}
										placeholder='Pick days of the week that apply'
										icon={<CalendarStats />}
									/>
								)}
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-5'>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Activities/Equipment Required</header>
							<div className='grid grid-cols-1 gap-y-4 py-4 lg:grid-cols-4 lg:gap-x-6 xl:gap-x-12'>
								{Object.values(SHIPMENT_ACTIVITY).map((item, index) => (
									<button
										key={index}
										type='button'
										className={`${inputButton} ${form.values.activitiesRequired.includes(item) && 'bg-secondary text-white'}`}
										onClick={() => {
											if (!form.values.activitiesRequired.includes(item)) {
												form.insertListItem('activitiesRequired', item);
											} else {
												const index = form.values.activitiesRequired.indexOf(item);
												form.removeListItem('activitiesRequired', index);
											}
										}}
									>
										<span className='capitalize'>{item.toLowerCase().replace('_', ' ')}</span>
									</button>
								))}
							</div>
						</div>
					</div>
					<div className='grid grid-cols-1 gap-5'>
						<div className='flex flex-col space-y-6'>
							<header className='quote-header'>Notes</header>
							<Textarea radius={0} placeholder='Notes' autosize minRows={3} maxRows={6} {...form.getInputProps('notes')} />
						</div>
					</div>
				</div>
				<div id='button-container' className='flex flex-col flex-wrap justify-center space-y-8'>
					<button type='submit' className='voyage-button flex w-auto items-center justify-center'>
						<span>Book</span>
					</button>
					<button
						type='button'
						className='flex justify-center items-center voyage-button w-auto leading-5'
						onClick={() => {
							setLoading({type: SUBMIT_TYPES.SAVE_BOOKING, show: true});
							booking
								? dispatch(updateBooking(form.values))
										.unwrap()
										.then(() => {
											notifySuccess('update-booking-success', 'Booking updated successfully!', <Check size={20} />);
											setLoading(prevState => ({...prevState, show: false}));
											router.back();
										})
										.catch(err => {
											console.error(err);
											notifyError('save-booking-error', err.message, <X size={20} />);
											setLoading(prevState => ({...prevState, show: false}));
										})
								: dispatch(createBooking(form.values))
										.unwrap()
										.then(() => {
											notifySuccess('save-booking-success', 'Booking saved successfully', <Check size={20} />);
											setLoading(prevState => ({...prevState, show: false}));
											router.back();
										})
										.catch(err => {
											console.error(err);
											notifyError('save-booking-error', err.message, <X size={20} />);
											setLoading(prevState => ({...prevState, show: false}));
										});
						}}
					>
						{loading.show && loading.type === SUBMIT_TYPES.SAVE_BOOKING && <Loader size='sm' className='mr-3' />}
						<span>Save and go to Booking</span>
					</button>
					<button type='button' className='voyage-button w-auto bg-transparent text-black hover:bg-stone-100' onClick={() => router.back()}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, query }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	console.log(token);
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	const shipper = await fetchShipper(session.id, token?.shipperId, prisma);
	store.dispatch(setShipper(shipper));
	const bookings = await fetchBookings(token?.shipperId, prisma);
	store.dispatch(setBookings(bookings));
	const locations = await fetchLocations(token?.shipperId, prisma);
	store.dispatch(setLocations(locations));
	return {
		props: {
			bookingID: query?.bookingId || ''
		} // will be passed to the page component as props
	};
});

export default create;
