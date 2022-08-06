import React, { useCallback, useMemo, useState } from 'react'
import PageNav from '../../../layout/PageNav';
import { Anchor, FileInput, NumberInput, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { FuelMeasurementUnit, FuelType, Vehicle, VEHICLE_STATUS, VEHICLE_TYPES } from '../../../utils/types'
import dayjs from 'dayjs';
import { alphanumericId, capitalize, getYears, sanitize } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';
import PageHeader from '../../../layout/PageHeader';
import { showNotification } from '@mantine/notifications';
import { Check, Upload } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import { addVehicle, useVehicles } from '../../../store/feature/vehicleSlice';
import { Loader } from '@mantine/core';
import moment from 'moment/moment'

const create = ({vehicleName, vehicleId}) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const router = useRouter();
	const vehicles = useSelector(useVehicles)

	const vehicle = useMemo(() => {
		return vehicleId ? vehicles.find((item: Vehicle) => item.vehicleId === vehicleId) : null;
	}, [vehicles]);

	const initialValues: Vehicle = {
		id: vehicle?.id ?? '',
		vehicleId: vehicleId ?? `VEH-ID${alphanumericId(8)}`,
		createdAt: vehicle?.createdAt ?? moment().unix(),
		vehicleName: vehicleName || vehicle?.vehicleName || '',
		vehicleType: vehicle?.vehicleType ?? '',
		colour: vehicle?.colour ?? '',
		dimensions: vehicle?.dimensions ?? { height: 0, length: 0, width: 0 },
		driverId: vehicle?.driverId ?? '',
		engineNumber: vehicle?.engineNumber ?? '',
		fuelMeasurementUnit: vehicle?.fuelMeasurementUnit ?? null,
		fuelType: vehicle?.fuelType ?? null,
		image: vehicle?.image ?? '',
		make: vehicle?.make ?? '',
		model: vehicle?.model ?? '',
		regNumber: vehicle?.regNumber ?? '',
		status: vehicle?.status ?? VEHICLE_STATUS.IDLE,
		vin: vehicle?.vin ?? '',
		yearOfManufacture: vehicle?.yearOfManufacture ?? ''
	};

	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		values.regNumber = values.regNumber.toUpperCase();
		setLoading(true);
		console.log(values)
		dispatch(addVehicle(values));
		showNotification({
			id: 'new-vehicle-success',
			disallowClose: true,
			onClose: () => console.log('unmounted'),
			onOpen: () => console.log('mounted'),
			autoClose: 5000,
			title: 'Success',
			message: 'A new vehicle has been added to your account!',
			color: 'green',
			icon: <Check size={20} />,
			loading: false
		});
		setTimeout(() => {
			router.push(PATHS.VEHICLES)
			setLoading(false);
		}, 500);
	}, []);

	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Vehicles', href: PATHS.VEHICLES },
		{ title: 'New Vehicle', href: PATHS.NEW_VEHICLE }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	return (
		<ContentContainer classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='container flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='pb-5'>
						<PageHeader title='New Vehicle' />
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
						<div>
							<Select
								required
								label='Vehicle Type'
								radius={0}
								data={Object.values(VEHICLE_TYPES).map(
									(item): SelectInputData => ({
										value: item,
										label: capitalize(sanitize(item))
									})
								)}
								size='sm'
								{...form.getInputProps('vehicleType')}
							/>
						</div>
						<div>
							<TextInput required label='Registration Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('regNumber')} />
						</div>
						<div>
							<TextInput required label='Vehicle Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('vehicleName')} />
						</div>
						<div>
							<TextInput label='Engine Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('engineNumber')} />
						</div>
						<div className='col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6'>
							<TextInput required label='Make' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('make')} />
							<TextInput required label='Model' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('model')} />
							<Select label='Year' radius={0} size='sm' min={dayjs().year()} max={dayjs().year()} data={getYears(50)} {...form.getInputProps('yearOfManufacture')} />
						</div>
						<div>
							<TextInput label='Colour' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('colour')} />
						</div>
						<div>
							<Select
								required
								label='Fuel Type'
								radius={0}
								autoCapitalize='on'
								size='sm'
								data={Object.values(FuelType).map(
									(item): SelectInputData => ({
										value: item,
										label: capitalize(sanitize(item))
									})
								)}
								{...form.getInputProps('fuelType')}
							/>
						</div>
						<div>
							<Select
								label='Fuel Measurement Unit'
								radius={0}
								autoCapitalize='on'
								size='sm'
								data={Object.values(FuelMeasurementUnit).map(
									(item): SelectInputData => ({
										value: item,
										label: capitalize(sanitize(item))
									})
								)}
								{...form.getInputProps('fuelMeasurementUnit')}
							/>
						</div>
						<div>
							<FileInput
								radius={0}
								size='sm'
								label='Vehicle Image'
								placeholder='Upload image of vehicle'
								accept='image/png,image/jpeg'
								icon={<Upload size={16} />}
								{...form.getInputProps('image')}
							/>
						</div>
						<div className='col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6'>
							<NumberInput label='Vehicle Length' min={0} max={10000} radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions.length')} />
							<NumberInput label='Vehicle Width' min={0} max={10000} radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions.width')} />
							<NumberInput label='Max Vehicle Height' min={0} max={10000} radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions.height')} />
						</div>
					</div>
					<div className="flex justify-end">
						<button type="submit" className='flex items-center justify-center voyage-button'>
							<Loader size="sm" className={`mr-3 ${!loading && "hidden"}`}/>
							<span>Save</span>
						</button>
					</div>
				</form>
			</div>
		</ContentContainer>
	);
};

export async function getServerSideProps(context) {
	const query = context.query;
	return {
		props: {
			vehicleName: query?.vehicleName ?? '',
			vehicleId: query?.vehicleId ?? null,
		}
	}
}

export default create;
