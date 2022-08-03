import React, { useCallback } from 'react';
import PageNav from '../../../layout/PageNav';
import { Anchor, NumberInput, Select, TextInput } from '@mantine/core';
import Link from 'next/link';
import { PATHS } from '../../../utils/constants';
import ContentContainer from '../../../layout/ContentContainer';
import { useForm } from '@mantine/form';
import { FuelMeasurementUnit, FuelType, Vehicle, VEHICLE_TYPES } from '../../../utils/types';
import dayjs from 'dayjs';
import { getYears, sanitize } from '@voyage-app/shared-utils';
import { SelectInputData } from '@voyage-app/shared-types';

const create = () => {
	const initialValues: Vehicle = {
		colour: '',
		dimensions: { height: 0, length: 0, width: 0 },
		driverId: '',
		engineNumber: '',
		fuelMeasurementUnit: undefined,
		fuelType: undefined,
		id: '',
		image: '',
		make: '',
		model: '',
		regNumber: '',
		status: undefined,
		vehicleId: '',
		vehicleName: '',
		vehicleType: '',
		vin: '',
		yearOfManufacture: 0
	};

	const form = useForm({
		initialValues
	});

	const handleSubmit = useCallback(values => {
		console.log(values);
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
			<div className='flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
						<div>
							<Select
								label='Vehicle Type'
								radius={0}
								classNames={{
									item: 'capitalize'
								}}
								data={Object.values(VEHICLE_TYPES).map(
									(item): SelectInputData => ({
										value: item,
										label: sanitize(item)
									})
								)}
								size='sm'
								{...form.getInputProps('vehicleType')}
							/>
						</div>
						<div>
							<TextInput label='Registration Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('regNumber')} />
						</div>
						<div>
							<TextInput label='Vehicle Name' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('vehicleName')} />
						</div>
						<div>
							<TextInput label='Engine Number' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('engineNumber')} />
						</div>
						<div className='col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6'>
							<TextInput label='Make' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('make')} />
							<TextInput label='Model' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('model')} />
							<Select label='Year' radius={0} size='sm' min={dayjs().year()} max={dayjs().year()} data={getYears(50)} {...form.getInputProps('yearOfManufacture')} />
						</div>
						<div>
							<TextInput label='Colour' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('engineNumber')} />
						</div>
						<div>
							<Select
								label='Fuel Type'
								radius={0}
								autoCapitalize='on'
								size='sm'
								classNames={{
									item: 'capitalize'
								}}
								data={Object.values(FuelType).map(
									(item): SelectInputData => ({
										value: item,
										label: sanitize(item)
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
										label: sanitize(item)
									})
								)}
								classNames={{
									item: 'capitalize'
								}}
								{...form.getInputProps('fuelMeasurementUnit')}
							/>
						</div>
						<div>
							<TextInput label='Vehicle Image' radius={0} autoCapitalize='on' size='sm' {...form.getInputProps('image')} />
						</div>
						<div className='col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6'>
							<NumberInput label='Vehicle Length' radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions')} />
							<NumberInput label='Vehicle Width' radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions')} />
							<NumberInput label='Max Vehicle Height' radius={0} autoCapitalize='on' size='sm' rightSection={<span className='text-voyage-grey pr-3'>mm</span>} {...form.getInputProps('dimensions')} />
						</div>
					</div>
				</form>
				<div>
					<button className='voyage-button'>Save</button>
				</div>
			</div>
		</ContentContainer>
	);
};

export default create;
