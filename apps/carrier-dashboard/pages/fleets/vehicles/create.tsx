import React, { useCallback, useMemo, useState } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, Loader, NumberInput, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { FuelMeasurementUnit, FuelType, Vehicle, VEHICLE_STATUS } from '../../../utils/types';
import dayjs from 'dayjs';
import { alphanumericId, capitalize, getYears, notifyError, notifySuccess, sanitize } from '@voyage-app/shared-utils';
import { SelectInputData, VEHICLE_TYPES } from '@voyage-app/shared-types';
import PageHeader from '../../../layout/PageHeader';
import { Check, X } from 'tabler-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCarrier, useCarrier } from '../../../store/features/profileSlice';
import { AppDispatch, wrapper } from 'apps/carrier-dashboard/store';
import { useRouter } from 'next/router';
import { createVehicle, setVehicles, updateVehicle, useVehicles } from '../../../store/features/vehicleSlice';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../api/auth/[...nextauth]';
import prisma from '../../../db';
import moment from 'moment';
import { fetchVehicles } from '../../../utils/functions';
import { getToken } from 'next-auth/jwt';

const items = [
	{ title: 'Home', href: PATHS.HOME },
	{ title: 'Vehicles', href: PATHS.VEHICLES },
	{ title: 'New Vehicle', href: PATHS.NEW_VEHICLE }
].map((item, index) => (
	<Anchor component={Link} href={item.href} key={index}>
		<span className='hover:text-secondary hover:underline'>{item.title}</span>
	</Anchor>
));

const create = ({ vehicleName, vehicleId }) => {
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const router = useRouter();
	const vehicles = useSelector(useVehicles);
	const profile = useSelector(useCarrier);

	const vehicle = useMemo(() => {
		return vehicleId ? vehicles.find((item: Vehicle) => item.vehicleId === vehicleId) : null;
	}, [vehicles]);

	const initialValues: Vehicle = {
		id: vehicle?.id ?? undefined,
		carrierId: vehicle?.carrierId ?? profile.id,
		vehicleId: vehicleId ?? `VEH-ID${alphanumericId(8)}`,
		createdAt: undefined,
		vehicleName: vehicleName || vehicle?.vehicleName || '',
		vehicleType: vehicle?.vehicleType ?? null,
		colour: vehicle?.colour ?? '',
		dimensions: vehicle?.dimensions ?? { height: 0, length: 0, width: 0 },
		engineNumber: vehicle?.engineNumber ?? '',
		fuelMeasurementUnit: vehicle?.fuelMeasurementUnit ?? null,
		fuelType: vehicle?.fuelType ?? null,
		make: vehicle?.make ?? '',
		model: vehicle?.model ?? '',
		regNumber: vehicle?.regNumber ?? '',
		status: vehicle?.status ?? VEHICLE_STATUS.IDLE,
		vin: vehicle?.vin ?? '',
		yearOfManufacture: vehicle?.yearOfManufacture ?? '',
		notes: ''
	};

	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		values.regNumber = values.regNumber.toUpperCase();
		setLoading(true);
		vehicle
			? dispatch(updateVehicle(values))
					.unwrap()
					.then(() => {
						notifySuccess('new-vehicle-success', 'A new vehicle has been added to your account!', <Check size={20} />);
						setTimeout(() => {
							router.push(PATHS.VEHICLES);
							setLoading(false);
						}, 500);
					})
					.catch(err => {
						console.error(err);
						notifyError('new-vehicle-failure', `There was a problem creating your new vehicle.\n${err.message}`, <X size={20} />);
						setLoading(false);
					})
			: dispatch(createVehicle(values))
					.unwrap()
					.then((res) => {
						console.log('new vehicle', res);
						notifySuccess('new-vehicle-success', 'A new vehicle has been added to your account!', <Check size={20} />);
						setTimeout(() => {
							router.push(PATHS.VEHICLES);
							setLoading(false);
						}, 500);
					})
					.catch(err => {
						console.error(err);
						notifyError('new-vehicle-failure', `There was a problem creating your new vehicle.\n${err.message}`, <X size={20} />);
						setLoading(false);
					});
	}, []);

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
							<TextInput label='Vin Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('vin')} />
						</div>

						<div>
							<TextInput required label='Make' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('make')} />
						</div>
						<div>
							<TextInput required label='Model' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('model')} />
						</div>
						<div>
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
								required
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
						{/*<div>
							<FileInput radius={0} size='sm' label='Vehicle Image' placeholder='Upload image of vehicle' accept='image/png,image/jpeg' icon={<Upload size={16} />} {...form.getInputProps('image')} />
						</div>*/}
						<div className='md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6'>
							<NumberInput label='Vehicle Length' min={0} max={10000} radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions.length')} />
							<NumberInput label='Vehicle Width' min={0} max={10000} radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions.width')} />
							<NumberInput
								label='Max Vehicle Height'
								min={0}
								max={10000}
								radius={0}
								autoCapitalize='on'
								size='sm'
								rightSection={<span className='text-voyage-grey pr-3'>mm</span>}
								{...form.getInputProps('dimensions.height')}
							/>
						</div>
					</div>
					<div className='flex justify-end'>
						<button type='submit' className='flex items-center justify-center voyage-button'>
							<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
							<span>Save</span>
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
		let vehicles = await fetchVehicles(token?.carrierId, prisma);
		store.dispatch(setVehicles(vehicles));
	}
	return {
		props: {
			vehicleName: query?.vehicleName ?? '',
			vehicleId: query?.vehicleId ?? null
		}
	};
});

export default create
