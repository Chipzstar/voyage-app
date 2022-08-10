import React, { useCallback, useEffect, useMemo } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Select, Textarea, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { Driver, DRIVER_STATUS } from '../../../utils/types'
import { DatePicker } from '@mantine/dates';
import { Calendar, Check, X } from 'tabler-icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { createDriver, useDrivers } from '../../../store/feature/driverSlice'
import { showNotification } from '@mantine/notifications';
import Router, { useRouter } from 'next/router';
import { alphanumericId } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { useVehicles } from '../../../store/feature/vehicleSlice'
import moment from 'moment';
import { AppDispatch, wrapper } from '../../../store'
import { setCarrier, useCarrier } from '../../../store/feature/profileSlice'
import prisma from '../../../db'
import { authOptions } from '../../api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth'

const create = ({driverId}) => {
	const dispatch = useDispatch<AppDispatch>();
	const drivers = useSelector(useDrivers)
	const vehicles = useSelector(useVehicles)
	const profile = useSelector(useCarrier)
	const router = useRouter();

	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Drivers', href: PATHS.DRIVERS },
		{ title: 'New Driver', href: PATHS.NEW_DRIVER }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	useEffect(() => console.log(profile), [profile])

	const driver = useMemo(() => {
		return driverId ? drivers.find((item: Driver) => item.driverId === driverId) : null;
	}, [drivers]);

	const initialValues: Driver = {
		id: driver?.id ?? undefined,
		carrierId: driver?.carrierId ?? profile.id,
		driverId: driverId ?? `DRIVER-ID${alphanumericId(8)}`,
		vehicleId: driver?.vehicleId ?? '',
		createdAt: driver?.createdAt ?? undefined,
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
		initialValues
	});

	const handleSubmit = useCallback(values => {
		values.defaultPhone = values.primaryPhone
		values.firstName = values.fullName.split(" ")[0]
		values.lastname = values.fullName.includes(' ') ? values.fullName.split(' ').at(-1) : '';
		dispatch(createDriver(values))
			.unwrap()
			.then((res) => {
				console.log("RESULT:", res)
				showNotification({
					id: 'new-driver-success',
					disallowClose: true,
					onClose: () => console.log('unmounted'),
					onOpen: () => console.log('mounted'),
					autoClose: 5000,
					title: 'Success',
					message: 'You have a new driver!',
					color: 'green',
					icon: <Check size={20} />,
					loading: false
				});
				setTimeout(() => router.push(PATHS.DRIVERS), 500);
			})
			.catch(err => {
				console.error(err)
				showNotification({
					id: 'new-driver-failure',
					disallowClose: true,
					onClose: () => console.log('unmounted'),
					onOpen: () => console.log('mounted'),
					autoClose: 3000,
					title: "Error",
					message: `There was a problem creating your new driver. \n${err.message}`,
					color: 'red',
					icon: <X size={20}/>,
					loading: false,
				});
			});
	}, []);
	return (
		<ContentContainer classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-5'>
						<div>
							<TextInput required label='Full Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('fullName')} />
						</div>
						<div>
							<DatePicker
								label='Date of Birth'
								rightSection={
									<div className='h-full w-full flex items-center justify-center bg-voyage-background border border-voyage-grey'>
										<Calendar size={18} />
									</div>
								}
								rightSectionWidth={40}
								radius={0}
								autoCapitalize='on'
								size='sm'
								value={form.values.dob ? moment.unix(form.values.dob).toDate() : undefined}
								onChange={(date) => form.setFieldValue('dob', moment(date).unix())}
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
									<div className='h-full w-full flex items-center justify-center bg-voyage-background border border-voyage-grey'>
										<Calendar size={18} />
									</div>
								}
								rightSectionWidth={40}
								radius={0}
								autoCapitalize='on'
								size='sm'
								value={form.values.hireDate ? moment.unix(form.values.hireDate).toDate() : undefined}
								onChange={(date) => form.setFieldValue('hireDate', moment(date).unix())}
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
							<TextInput autoComplete="address-line1" required label='Address' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine1')} />
						</div>
						<div>
							<TextInput autoComplete="address-line2" label='Address 2' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('addressLine2')} />
						</div>
						<div className='md:col-span-2 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6'>
							<TextInput autoComplete="address-level2" required label='City' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('city')} />
							<TextInput autoComplete="address-level3" label='Region / County' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('region')} />
							<TextInput autoComplete="postal-code" required label='Postal Code' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('postcode')} />
						</div>
						<div className='md:col-span-2'>
							<Textarea label='Notes' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('notes')} />
						</div>
					</div>
					<div className='flex justify-end'>
						<button type="submit" className='voyage-button'>Save</button>
					</div>
				</form>
			</div>
		</ContentContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, query }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	if (session.id) {
		const carrier = await prisma.carrier.findFirst({
			where: {
				userId: {
					equals: session.id
				}
			}
		});
		if (carrier) {
			carrier.createdAt = moment(carrier.createdAt).unix();
			carrier.updatedAt = moment(carrier.updatedAt).unix();
			store.dispatch(setCarrier(carrier));
		}
	}
	return {
		props: {
			driverId: query?.driverId ?? null
		}
	};
});

export default create;
