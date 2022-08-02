import React, { useCallback } from 'react';
import { Modal, SimpleGrid, TextInput, Text, Button, Group, Stack, Select, Divider, NumberInput, NativeSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { PACKAGE_TYPE, SelectInputData } from '@voyage-app/shared-types';
import { SAMPLE_DRIVERS } from '../utils/constants';
import { DatePicker } from '@mantine/dates';

const NewFuelTransaction = ({ opened, onClose }) => {
	const form = useForm({
		initialValues: {}
	});

	const handleSubmit = useCallback(() => {}, []);

	const data = [
		{ value: 'eur', label: '🇪🇺 EUR' },
		{ value: 'usd', label: '🇺🇸 USD' },
		{ value: 'cad', label: '🇨🇦 CAD' },
		{ value: 'gbp', label: '🇬🇧 GBP' },
		{ value: 'aud', label: '🇦🇺 AUD' }
	];

	const select = (
		<NativeSelect
			data={data}
			styles={{
				input: {
					fontWeight: 500,
					borderTopLeftRadius: 0,
					borderBottomLeftRadius: 0
				}
			}}
		/>
	);

	return (
		<Modal
			size='lg'
			padding={25}
			opened={opened}
			onClose={onClose}
			title='New Fuel Transaction'
			classNames={{
				title: 'text-2xl font-semibold'
			}}
		>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Text size='md' color='dimmed'>
					Import statements from fuel card providers.
				</Text>
				<SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} py={20}>
					<DatePicker label='Transaction Date' placeholder='Select a date' />
					<TextInput label='Invoice Number' placeholder='' required />
					<Select
						label='Driver'
						placeholder='Select a Driver'
						data={Object.values(SAMPLE_DRIVERS).map(
							(item): SelectInputData => ({
								label: item.firstname + ' ' + item.lastname,
								value: item.driverId
							})
						)}
					/>
					<Select
						classNames={{
							item: 'capitalize'
						}}
						label='Unit'
						placeholder='Unit of the package'
						required
						data={Object.values(PACKAGE_TYPE).map(
							(value): SelectInputData => ({
								label: value.toLowerCase(),
								value
							})
						)}
					/>
					<TextInput label='Transaction Date' placeholder='Your name' />
					<TextInput label='City' placeholder='City / Region / Postcode' required />
					<TextInput label='Product' placeholder='Product' required />
					<TextInput type='number' label='Amount' rightSection={select} rightSectionWidth={92} />
				</SimpleGrid>
				<Divider my='md' />
				<Group position='right' mt='md'>
					<Button variant='outline' type='button' color='gray' onClick={onClose}>
						Cancel
					</Button>
					<Button variant='outline' type='submit' onClick={onClose}>
						Submit
					</Button>
				</Group>
			</form>
		</Modal>
	);
};

NewFuelTransaction.propTypes = {};

export default NewFuelTransaction;
