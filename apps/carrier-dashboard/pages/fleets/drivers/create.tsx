import React, { useCallback, useMemo } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Select, Textarea, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS, PUBLIC_PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { Driver, DRIVER_STATUS } from '../../../utils/types';
import { DatePicker } from '@mantine/dates';
import { Calendar, Check, X } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { createDriver, setDrivers, updateDriver, useDrivers } from '../../../store/feature/driverSlice';
import Router, { useRouter } from 'next/router';
import { alphanumericId, notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { setVehicles, useVehicles } from '../../../store/feature/vehicleSlice';
import moment from 'moment';
import { AppDispatch, wrapper } from '../../../store';
import { setCarrier, useCarrier } from '../../../store/feature/profileSlice';
import prisma from '../../../db';
import { authOptions } from '../../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { fetchDrivers, fetchProfile, fetchVehicles } from '../../../utils/functions';

const items = [
	{ title: 'Home', href: PATHS.HOME },
	{ title: 'Drivers', href: PATHS.DRIVERS },
	{ title: 'New Driver', href: PATHS.NEW_DRIVER }
].map((item, index) => (
	<Anchor component={Link} href={item.href} key={index}>
		<span className='hover:text-secondary hover:underline'>{item.title}</span>
	</Anchor>
));

const create = ({ driverId }) => {
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const drivers = useSelector(useDrivers);
	const vehicles = useSelector(useVehicles);
	const profile = useSelector(useCarrier);
	const driver = useMemo(() => {
		return driverId ? drivers.find((item: Driver) => item.driverId === driverId) : null;
	}, [drivers]);

	const initialValues: Driver = {
		id: driver?.id ?? undefined,
		carrierId: driver?.carrierId ?? profile?.id,
		driverId: driverId ?? `DRIVER-ID${alphanumericId(8)}`,
		vehicleId: driver?.vehicleId ?? '',
		createdAt: undefined,
		addressLine1: driver?.addressLine1 ?? '',
		addressLine2: driver?.addressLine2 ?? '',
		city: driver?.city ?? '',
		region: driver?.region ?? '',
		companyName: driver?.companyName ?? '',
		defaultPhone: driver?.defaultPhone ?? '',
		dob: driver?.dob ?? null,
		email: driver?.email ?? '',
		fullName: driver?.fullName ?? '',
		firstName: driver?.firstName ?? '',
		fleetId: driver?.fleetId ?? '',
		hireDate: driver?.hireDate ?? null,
		isActive: driver?.isActive ?? false,
		lastName: driver?.lastName ?? '',
		notes: driver?.notes ?? '',
		postcode: driver?.postcode ?? '',
		primaryPhone: driver?.primaryPhone ?? '',
		secondaryPhone: driver?.secondaryPhone ?? '',
		status: driver?.status ?? DRIVER_STATUS.UNVERIFIED
	};

	const form = useForm({
		initialValues,
		validate: values => ({
			vehicleId: !values.vehicleId ? 'Please select a vehicle for this driver' : null
		})
	});

	const handleSubmit = useCallback(values => {
		values.defaultPhone = values.primaryPhone;
		values.firstName = values.fullName.split(' ')[0];
		values.lastName = values.fullName.includes(' ') ? values.fullName.split(' ').at(-1) : '';
		driver
			? dispatch(updateDriver(values))
					.unwrap()
					.then(res => {
						notifySuccess('update-driver-success', `Driver ${values.driverId} has been updated`, <Check size={20} />);
						setTimeout(() => router.push(PATHS.DRIVERS), 500);
					})
					.catch(err => notifyError('update-driver-failure', `There was a problem updating this driver. \n${err.message}`, <X size={20} />))
			: dispatch(createDriver(values))
					.unwrap()
					.then(res => {
						console.log('new driver', res);
						notifySuccess('new-driver-success', 'You have a new driver!', <Check size={20} />);
						setTimeout(() => router.push(PATHS.DRIVERS), 500);
					})
					.catch(err => notifyError('new-driver-failure', `There was a problem creating your new driver. \n${err.message}`, <X size={20} />));
	}, []);

	return (
		<ContentContainer classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='flex h-full flex-col items-center justify-center'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='mb-5 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2'>
						<div>
							<TextInput required label='Full Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('fullName')} />
						</div>
						<div>
							<DatePicker
								label='Date of Birth'
								rightSection={
									<div className='bg-voyage-background border-voyage-grey flex h-full w-full items-center justify-center border'>
										<Calendar size={18} />
									</div>
								}
								rightSectionWidth={40}
								radius={0}
								autoCapitalize='on'
								size='sm'
								value={form.values.dob ? moment.unix(form.values.dob).toDate() : undefined}
								onChange={date => form.setFieldValue('dob', moment(date).unix())}
							/>
						</div>
						<div>
							<TextInput label='Company Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('companyName')} />
						</div>
						<div>
							<TextInput type='email' required label='Email' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('email')} />
						</div>
						<div>
							<TextInput type='tel' required label='Phone Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('primaryPhone')} />
						</div>
						<div>
							<TextInput type='tel' label='Secondary Phone Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('secondaryPhone')} />
						</div>
						<div>
							<DatePicker
								label='Hire Date'
								rightSection={
									<div className='bg-voyage-background border-voyage-grey flex h-full w-full items-center justify-center border'>
										<Calendar size={18} />
									</div>
								}
								rightSectionWidth={40}
								radius={0}
								autoCapitalize='on'
								size='sm'
								value={form.values.hireDate ? moment.unix(form.values.hireDate).toDate() : undefined}
								onChange={date => form.setFieldValue('hireDate', moment(date).unix())}
							/>
						</div>
						<div>
							<Select
								onCreate={query =>
									Router.push(
										{
											pathname: `${PATHS.NEW_VEHICLE}`,
											query: { vehicleName: query }
										},
										'',
										{ scroll: true }
									)
								}
								getCreateLabel={query => `+ Create ${query}`}
								creatable
								searchable
								required
								radius={0}
								size='sm'
								label='Vehicle'
								placeholder='Select a vehicle'
								data={vehicles.map(
									(vehicle): SelectInputData => ({
										label: vehicle.vehicleName,
										value: vehicle.vehicleId
									})
								)}
								{...form.getInputProps('vehicleId')}
							/>
						</div>
						<div>
							<TextInput autoComplete='address-line1' required label='Address' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine1')} />
						</div>
						<div>
							<TextInput autoComplete='address-line2' label='Address 2' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine2')} />
						</div>
						<div className='grid grid-cols-1 gap-x-8 gap-y-6 md:col-span-2 lg:grid-cols-3'>
							<TextInput autoComplete='address-level2' required label='City' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('city')} />
							<TextInput autoComplete='address-level3' label='Region / County' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('region')} />
							<TextInput autoComplete='postal-code' required label='Postal Code' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('postcode')} />
						</div>
						<div className='md:col-span-2'>
							<Textarea label='Notes' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('notes')} />
						</div>
					</div>
					<div className='flex justify-end'>
						<button type='submit' className='voyage-button'>
							Save
						</button>
					</div>
				</form>
			</div>
		</ContentContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, query }) => {
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
		store.dispatch(setCarrier(carrier));
		let drivers = await fetchDrivers(token?.carrierId, prisma);
		store.dispatch(setDrivers(drivers));
		let vehicles = await fetchVehicles(token?.carrierId, prisma);
		store.dispatch(setVehicles(vehicles));
	}
	return {
		props: {
			driverId: query?.driverId ?? null,
			session
		}
	};
});

export default create;
