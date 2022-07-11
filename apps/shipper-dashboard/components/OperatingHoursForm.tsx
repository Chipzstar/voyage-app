import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Modal, Switch } from '@mantine/core';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { TimeInput } from '@mantine/dates';
import { Clock } from 'tabler-icons-react';

const OperatingHoursForm = ({ opened, onClose }) => {
	const operatingHours = useSelector(state => state['operatingHours']);
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title='Facility Hours'
			closeOnEscape
			closeOnClickOutside
			size='lg'
			classNames={{
				title: 'text-xl font-semibold',
				close: 'h-8 w-8'
			}}
		>
			<div className='flex flex-col p-4 space-y-6'>
				<span className='text-gray-700'>Select the hours during the week when this facility can pickup & receive shipments</span>
				<Switch color='blue' label='Use the same hours for shipping and receiving' />
				<div className='grid grid-cols-8 gap-4	'>
					{operatingHours.map((item, index) => (
						<>
							<div className="flex items-center">
								<Checkbox />
							</div>
							<div className="flex flex-col justify-center col-span-2">
								{dayjs().day(index).format('dddd')}
							</div>
							<div className="col-span-2">
								<TimeInput
									placeholder="Pick time"
									icon={<Clock size={16} />}
									defaultValue={new Date()}
								/>
							</div>
							<div>
								to
							</div>
							<div className="col-span-2">
								<TimeInput
									placeholder="Pick time"
									icon={<Clock size={16} />}
									defaultValue={new Date()}
								/>
							</div>
						</>
					))}
				</div>
			</div>
		</Modal>
	);
};

OperatingHoursForm.propTypes = {
	opened: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

export default OperatingHoursForm;
