import React from 'react';
import { Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

const VehicleOptions = ({ opened, onClose, onSave, title }) => {
	const form = useForm({
		initialValues: {
			minNumPallets: 2,
			maxNumPallets: 10,
			maxTransitTime: 8
		}
	});

	return (
		<Modal
			centered
			opened={opened}
			onClose={onClose}
			title={title}
			closeOnEscape
			closeOnClickOutside
			classNames={{
				title: 'text-2xl font-semibold capitalize',
				close: 'h-8 w-8 text-2xl'
			}}
		>
			<form onSubmit={form.onSubmit(values => onSave(values))} className='flex flex-col p-4 space-y-4'>
				<TextInput
					label={"Min Number of Pallets"}
					radius={0}
					className="md:w-72"
					rightSection={<span className='text-voyage-grey pr-3'>Pts</span>}
					{...form.getInputProps("minNumPallets")}
				/>
				<TextInput
					label={"Max Number of Pallets"}
					radius={0}
					className="md:w-72"
					rightSection={<span className='text-voyage-grey pr-3'>Pts</span>}
					{...form.getInputProps("maxNumPallets")}
				/>
				<TextInput
					label={"Max Transit Time"}
					radius={0}
					className="md:w-72"
					rightSection={<span className='text-voyage-grey pr-3'>hrs</span>}
					{...form.getInputProps("maxTransitTime")}
				/>
				<div className='flex justify-center pt-4'>
					<button type="submit" className='voyage-button'>Submit</button>
				</div>
			</form>
		</Modal>
	);
};

VehicleOptions.propTypes = {
	
};

export default VehicleOptions;
