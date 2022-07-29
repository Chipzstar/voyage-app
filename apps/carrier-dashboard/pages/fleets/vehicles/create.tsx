import React, { useCallback } from 'react'
import PageNav from '../../../layout/PageNav'
import { Anchor, Select, TextInput } from '@mantine/core'
import Link from 'next/link'
import { PATHS } from '../../../utils/constants'
import Container from '../../../layout/Container'
import { useForm } from '@mantine/form'
import { Vehicle } from '../../../utils/types'
import dayjs from 'dayjs';
import { getYears } from '@voyage-app/shared-utils'

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
	}

	const form = useForm({
		initialValues
	})

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
		<Container classNames='px-8 h-screen flex flex-col'>
			<PageNav items={items} />
			<div className='flex flex-col items-center justify-center h-full'>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-10'>
						<div>
							<TextInput label='Vehicle Type' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('vehicleType')} />
						</div>
						<div>
							<TextInput label='Registration Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('regNumber')} />
						</div>
						<div>
							<TextInput type="email" label='Vehicle Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('vehicleName')} />
						</div>
						<div>
							<TextInput type="tel" label='Engine Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('engineNumber')} />
						</div>
						<div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
							<TextInput label='Make' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('make')} />
							<TextInput label='Model' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('model')} />
							<Select
								label="Year"
								radius={0}
								size="md"
								min={dayjs().year()}
								max={dayjs().year()}
								data={getYears(50)}
								{...form.getInputProps('yearOfManufacture')}
							/>
						</div>
						<div>
							<TextInput type="email" label='Vehicle Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('vehicleName')} />
						</div>
						<div>
							<TextInput type="tel" label='Engine Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('engineNumber')} />
						</div>
						<div>
							<TextInput label='Vehicle Type' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('vehicleType')} />
						</div>
						<div>
							<TextInput label='Registration Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('regNumber')} />
						</div>
						<div>
							<TextInput type="email" label='Vehicle Name' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('vehicleName')} />
						</div>
						<div>
							<TextInput type="tel" label='Engine Number' radius={0} autoCapitalize='on' size='md' {...form.getInputProps('engineNumber')} />
						</div>
					</div>
				</form>
				<div>
					<button className='voyage-button'>
						Save
					</button>
				</div>
			</div>
		</Container>
	)
}

export default create
