import React from 'react';
import { Modal } from '@mantine/core';
import { useForm } from '@mantine/form';

const VehicleOptions = ({ opened, onClose, onSave }) => {
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
			title='Facility Hours'
			closeOnEscape
			closeOnClickOutside
			size='lg'
			classNames={{
				title: 'text-2xl font-semibold',
				close: 'h-8 w-8 text-2xl'
			}}
		>
			<form onSubmit={form.onSubmit(values => onSave(values))} className='flex flex-col p-4 space-y-6'></form>
		</Modal>
	);
};

VehicleOptions.propTypes = {
	
};

export default VehicleOptions;
