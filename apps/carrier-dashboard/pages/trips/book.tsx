import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router'
import { useForm } from '@mantine/form'
import moment from 'moment/moment'
import { PACKAGE_TYPE, SelectInputData } from '@voyage-app/shared-types'
import { Calendar, Check, ChevronDown, X } from 'tabler-icons-react';
import { Anchor, Breadcrumbs, Loader, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { DateTimePicker } from '@voyage-app/shared-ui-components'
import Link from 'next/link'
import ContentContainer from '../../layout/ContentContainer'
import { useDispatch, useSelector } from 'react-redux'
import { NewBooking, TeamRole, VEHICLE_TYPES } from '../../utils/types'
import {
	fetchCustomers,
	fetchDrivers,
	fetchMembers, fetchProfile,
	generateLoad,
	notifyError,
	notifySuccess,
} from '../../utils/functions'
import { setDrivers, useDrivers } from '../../store/feature/driverSlice';
import { setMembers, useMembers } from '../../store/feature/memberSlice'
import { setCustomers, useCustomers } from '../../store/feature/customerSlice';
import { capitalize, sanitize } from '@voyage-app/shared-utils'
import { createLoad } from '../../store/feature/loadSlice'
import { PATHS, PUBLIC_PATHS } from 'apps/carrier-dashboard/utils/constants'
import { setCarrier, useCarrier } from '../../store/feature/profileSlice'
import { AppDispatch, wrapper } from '../../store'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'
import prisma from '../../db'

const items = [
	{ title: 'Home', href: '/' },
	{ title: 'Trips', href: '/trips' },
	{ title: 'Book', href: '/trips/book' }
].map((item, index) => (
	<Anchor component={Link} href={item.href} key={index}>
		<span className='hover:text-secondary hover:underline'>{item.title}</span>
	</Anchor>
));

const book = props => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const drivers = useSelector(useDrivers)
	const team = useSelector(useMembers)
	const customers = useSelector(useCustomers)
	const profile = useSelector(useCarrier)

	const initialValues: NewBooking = {
		createdAt: undefined,
		carrierId: profile?.id,
		customerId: '',
		driverId: '',
		controllerId: '',
		vehicleType: VEHICLE_TYPES.DRY_VAN,
		pickupLocation: {
			street: '',
			city: '',
			region: '',
			postcode: '',
			country: 'UK',
			note: '',
		},
		deliveryLocation: {
			street: '',
			city: '',
         region: '',
			postcode: '',
			country: 'UK',
			note: ''
		},
		pickupDate: null,
		description: '',
		internalPONumber: '',
		customerPONumber: '',
		height: 0,
		length: 0,
		width: 0,
		weight: 0,
		quantity: 0,
		packageType: PACKAGE_TYPE.PALLET
	}

	const form = useForm({
		initialValues,
		validate: values => ({
			driverId: !values.driverId ? "Please select a Driver for this load" : null,
			controllerId: !values.controllerId ? "Please select a Controller for this load" : null,
			customerId: !values.customerId ? "Please select a Customer for this load" : null
		})
	});

	const handleSubmit = useCallback(values => {
		console.log("INPUT:", values)
		setLoading(true);
		values.createdAt = moment().unix();
		const load = generateLoad(profile, values, drivers, team, customers);
		console.log("OUTPUT:", load);
		dispatch(createLoad(load))
			.unwrap()
			.then(() => {
				notifySuccess('new-load-success', "You've booked a new load", <Check size={20} />);
				setTimeout(() => {
					router.push(PATHS.TRIPS);
					setLoading(false);
				}, 500);
			})
			.catch(err => {
				notifyError('new-load-failure', `There was an error creating your load. ${err.message}`, <X size={20} />)
				setLoading(false);
			});
	}, []);

	return (
		<ContentContainer>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white z-50' role='button'>
				<Breadcrumbs>{items}</Breadcrumbs>
			</section>
			<form onSubmit={form.onSubmit(handleSubmit)} className='grid grid-cols-3 lg:grid-cols-4 gap-20'>
				<div id='book-form-container' className='flex flex-col space-y-5 col-span-3'>
					<div id="load-type" className='grid grid-cols-1 gap-6'>
						<header className='form-header'>Load Type</header>
						<div className='border border-gray-300 p-4 grid grid-cols-4 lg:grid-cols-12 lg:row-span-3 gap-y-4 gap-x-12 pb-8'>
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
								<NumberInput required radius={0} min={0} max={26000} label='Weight' placeholder='' rightSection={<span className='text-voyage-grey pr-3'>Kg</span>} {...form.getInputProps('weight')} />
							</div>
							<div className='col-span-4 lg:col-span-6 lg:row-span-2'>
								<Textarea size='sm' radius={0} label='Load Description' autosize minRows={3} maxRows={6} {...form.getInputProps('description')} />
							</div>
							<div className='lg:col-span-6 col-span-4 lg:row-span-2 grid grid-cols-12 gap-x-6 gap-y-4'>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={10000} label='Item Length' placeholder='Units' {...form.getInputProps('length')} rightSection={<span className='text-voyage-grey pr-3'>cm</span>} />
								</div>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={10000} label='Item Width' placeholder='Units' {...form.getInputProps('width')} rightSection={<span className='text-voyage-grey pr-3'>cm</span>} />
								</div>
								<div className='col-span-4 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={10000} label='Item Height' placeholder='Units' rightSection={<span className='text-voyage-grey pr-3'>cm</span>} {...form.getInputProps('height')} />
								</div>
								<div className='col-span-4 lg:col-span-6 lg:row-span-1'>
									<NumberInput required size='sm' radius={0} min={1} max={26} label='Item Quantity' placeholder='Units' {...form.getInputProps('quantity')} />
								</div>
								<div className='col-span-4 lg:col-span-6 lg:row-span-1'>
									<Select
										required
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
					<div id="locations" className='grid grid-cols-2 gap-5'>
						<div className='flex flex-col space-y-6'>
							<header className='form-header'>Pickup</header>
							<div className=''>
								<TextInput id="pickup-street" required radius={0} placeholder='Street Address' {...form.getInputProps('pickupLocation.street')} />
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-6'>
								<TextInput id="pickup-city" required radius={0} placeholder='Town / City' {...form.getInputProps('pickupLocation.city')} />
								<TextInput id="pickup-region" radius={0} placeholder='Region' {...form.getInputProps('pickupLocation.region')} />
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-6'>
								<TextInput id="pickup-postcode" required radius={0} placeholder='Postal Code' {...form.getInputProps('pickupLocation.postcode')} />
								<TextInput id="pickup-country" readOnly radius={0} placeholder='Country' {...form.getInputProps('pickupLocation.country')} />
							</div>
							<div className=''>
								<Textarea radius={0} placeholder="Note" {...form.getInputProps('deliveryLocation.note')} />
							</div>
						</div>
						<div className='flex flex-col space-y-6'>
							<header className='form-header'>Delivery</header>
							<div className=''>
								<TextInput required size='sm' radius={0} placeholder='Street Address' {...form.getInputProps('deliveryLocation.street')} />
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-6'>
								<TextInput required size='sm' radius={0} placeholder='Town / City' {...form.getInputProps('deliveryLocation.city')} />
								<TextInput size='sm' radius={0} placeholder='Region' {...form.getInputProps('deliveryLocation.region')} />
							</div>
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-6'>
								<TextInput required size='sm' radius={0} placeholder='Postal Code' {...form.getInputProps('deliveryLocation.postcode')} />
								<TextInput readOnly size='sm' radius={0} placeholder='Country' {...form.getInputProps('deliveryLocation.country')} />
							</div>
							<div className=''>
								<Textarea radius={0} placeholder="Note" {...form.getInputProps('deliveryLocation.note')}/>
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
										required
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
						<div id="col-1">
							<div className='flex flex-col space-y-4 h-48'>
								<header className='space-y-3'>
									<h1 className='form-header'>Select Account</h1>
									<p className='font-normal'>Select which customer to create the load for</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<Select
										required
										size='md'
										radius={0}
										placeholder='Select customer'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={customers.map((customer): SelectInputData => ({
											value: customer.customerId,
											label: capitalize(sanitize(customer.companyName))
										}))}
										{...form.getInputProps('customerId')}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='grid grid-cols-2 gap-6'>
						<div>
							<div className='flex flex-col space-y-4'>
								<header className='space-y-4'>
									<h1 className='form-header'>Select Vehicle</h1>
									<p className='font-normal'>Select the type of vehicle required for this load</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<Select
										required
										size='md'
										radius={0}
										placeholder='Select vehicle'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={Object.values(VEHICLE_TYPES).map((vehicle): SelectInputData => ({
											value: vehicle,
											label: capitalize(sanitize(vehicle))
										}))}
										{...form.getInputProps('vehicleType')}
									/>
								</div>
							</div>
						</div>
						<div id='col-1'>
							<div className='flex flex-col space-y-4'>
								<header className='space-y-4'>
									<h1 className='form-header'>Select Driver</h1>
									<p className='font-normal'>Select the driver who should carry out the load</p>
								</header>
								<div className='flex flex-row items-center space-x-6'>
									<Select
										requred
										size='md'
										radius={0}
										placeholder='Select driver'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={drivers.map((driver): SelectInputData => ({
											label: driver.fullName,
											value: driver.driverId
										}))}
										{...form.getInputProps('driverId')}
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
										required
										size='md'
										radius={0}
										placeholder='Select controller'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={team.filter(item => item.role === TeamRole.CONTROLLER).map((member): SelectInputData => ({
											label: member.firstName + ' ' + member.lastName,
											value: member.memberId
										}))}
										{...form.getInputProps('controllerId')}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div id='button-container' className='flex flex-col flex-wrap justify-center space-y-8'>
					<button type='submit' className='voyage-button w-auto'>
						<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
						<span>Book</span>
					</button>
					<button type='button' className='voyage-button w-auto bg-transparent text-black hover:bg-stone-100' onClick={() => router.back()}>
						Cancel
					</button>
				</div>
			</form>
		</ContentContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id) {
		let carrier = await fetchProfile(session.id, token?.carrierId, prisma)
		let members = await fetchMembers(session.id, token?.carrierId, prisma)
		let drivers = await fetchDrivers(session.id, token?.carrierId, prisma)
		let customers = await fetchCustomers(session.id, token?.carrierId, prisma)
		store.dispatch(setMembers(members));
		store.dispatch(setDrivers(drivers));
		store.dispatch(setCustomers(customers));
		store.dispatch(setCarrier(carrier));
	}
	return {
		props: {
			session
		}
	};
});

export default book;
