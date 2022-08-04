import React, { useCallback } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Select, Textarea, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { Driver, DRIVER_STATUS } from '../../../utils/types'
import { DatePicker } from '@mantine/dates';
import { Calendar, Check } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux'
import { addDriver } from '../../../store/feature/driverSlice';
import { showNotification } from '@mantine/notifications';
import Router, { useRouter } from 'next/router';
import { alphanumericId } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import { useVehicles } from '../../../store/feature/vehicleSlice'
import moment from 'moment';

const create = () => {
	const dispatch = useDispatch();
	const vehicles = useSelector(useVehicles)
	const router = useRouter();
	const initialValues: Driver = {
		id: '',
		driverId: `DRIVER-ID${alphanumericId(8)}`,
		vehicleId: '',
		createdAt: moment().unix(),
		addressLine1: '',
		addressLine2: '',
		city: '',
		region: '',
		companyName: '',
		defaultPhone: '',
		dob: 0,
		email: '',
		fullName: '',
		firstname: '',
		fleetId: '',
		hireDate: 0,
		isActive: false,
		lastname: '',
		notes: '',
		postcode: '',
		primaryPhone: '',
		secondaryPhone: '',
		status: DRIVER_STATUS.UNVERIFIED
	};
	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		values.defaultPhone = values.primaryPhone
		values.firstname = values.fullName.split(" ")[0]
		values.lastname = values.fullName.split(" ")[-1]
		dispatch(addDriver(values));
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
	}, []);

	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Drivers', href: PATHS.DRIVERS },
		{ title: 'New Driver', href: PATHS.NEW_DRIVER }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));
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
								{...form.getInputProps('dob')}
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
								{...form.getInputProps('hireDate')}
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

export default create;
