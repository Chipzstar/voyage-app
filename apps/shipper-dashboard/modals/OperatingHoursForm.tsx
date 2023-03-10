import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Modal } from '@mantine/core';
import dayjs from 'dayjs';
import { TimeInput } from '@mantine/dates';
import { Clock } from 'tabler-icons-react';
import { useForm } from '@mantine/form';
import moment from 'moment';
import { DEFAULT_OPERATING_HOURS } from '../utils/constants';
import { OperatingHoursState } from '@voyage-app/shared-types';

const OperatingHoursForm = ({ opened, onClose, onSave, operatingHours = null }) => {
	const form = useForm({
		initialValues: {
			operatingHours: operatingHours ? [...operatingHours] : [...DEFAULT_OPERATING_HOURS]
		}
	});

	const Fields = form.values.operatingHours.map((item: OperatingHoursState, index) => {
		const openTime = moment(item.facility.open);
		const closeTime = moment(item.facility.close);
		return (
			<div key={index} className='grid grid-cols-8 gap-4'>
				<div className='flex items-center'>
					<Checkbox checked={item.facility.isActive} {...form.getInputProps(`operatingHours.${index}.facility.isActive`, { type: 'checkbox' })} />
				</div>
				<div className='col-span-2 flex flex-col justify-center'>{dayjs().day(index).format('dddd')}</div>
				<div className='col-span-2'>
					<TimeInput
						placeholder='Pick time'
						icon={<Clock size={16} />}
						defaultValue={openTime.toDate()}
						onChange={date =>
							form.setFieldValue(`operatingHours.${index}`, {
								...item,
								facility: {
									...item.facility,
									open: {
										h: date.getHours(),
										m: date.getMinutes()
									}
								}
							})
						}
					/>
				</div>
				<div className='flex items-center justify-center'>to</div>
				<div className='col-span-2'>
					<TimeInput
						placeholder='Pick time'
						icon={<Clock size={16} />}
						defaultValue={closeTime.toDate()}
						onChange={date =>
							form.setFieldValue(`operatingHours.${index}`, {
								...item,
								facility: {
									...item.facility,
									close: {
										h: date.getHours(),
										m: date.getMinutes()
									}
								}
							})
						}
					/>
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
			<form onSubmit={form.onSubmit(values => onSave(values))} className='flex flex-col space-y-6 p-4'>
				<span className='text-gray-700'>Select the hours during the week when this facility can pickup & receive shipments</span>
				<div className='grid grid-cols-1 gap-4'>{Fields}</div>
				<div className='flex justify-center pt-4'>
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
