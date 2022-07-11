import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Modal, Switch } from '@mantine/core';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { TimeInput } from '@mantine/dates';
import { Clock } from 'tabler-icons-react';
import { formList, useForm } from '@mantine/form';
import moment from 'moment';
import { OperatingHoursState } from '../utils/types';

const OperatingHoursForm = ({ opened, onClose, onSave }) => {
	const operatingHours = useSelector(state => state['operatingHours']);

	const form = useForm({
		initialValues: {
			operatingHours: formList(operatingHours)
		}
	});

	const Fields = form.values.operatingHours.map((item: OperatingHoursState, index) => {
		const openTime = moment(item.facility.open).toDate();
		const closeTime = moment(item.facility.close).toDate();
		return (
			<div key={index} className='grid grid-cols-8 gap-4'>
				<div className='flex items-center'>
					<Checkbox/>
				</div>
				<div className='flex flex-col justify-center col-span-2'>{dayjs().day(index).format('dddd')}</div>
				<div className='col-span-2'>
					<TimeInput placeholder='Pick time' icon={<Clock size={16} />} defaultValue={openTime} onChange={date => console.log(date)} />
				</div>
				<div className='flex items-center justify-center'>to</div>
				<div className='col-span-2'>
					<TimeInput placeholder='Pick time' icon={<Clock size={16} />} defaultValue={closeTime} onChange={date => console.log(date)} />
				</div>
			</div>
		);
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
			<form onSubmit={form.onSubmit(values => onSave(values))} className='flex flex-col p-4 space-y-6'>
				<span className='text-gray-700'>Select the hours during the week when this facility can pickup & receive shipments</span>
				<Switch color='blue' label='Use the same hours for shipping and receiving' />
				<div className='grid grid-cols-1 gap-4'>
					{Fields}
				</div>
				<div className='flex justify-center'>
					<button type='submit' className='voyage-button'>
						Save
					</button>
				</div>
			</form>
		</Modal>
	);
};

OperatingHoursForm.propTypes = {
	opened: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onSave: PropTypes.func
};

export default OperatingHoursForm;
