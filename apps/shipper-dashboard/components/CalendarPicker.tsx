import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Indicator, Modal } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';

const CalendarPicker = ({ opened, onClose, value, setValue }) => {

	useEffect(() => {
		console.log(value)
	}, []);

	return (
		<Modal opened={opened} onClose={onClose} centered size='md' withCloseButton={false} closeOnEscape closeOnClickOutside>
			<div className='flex justify-center items-center'>
				<Calendar
					firstDayOfWeek="sunday"
					value={value}
					onChange={setValue}
					fullWidth
					renderDay={date => {
						console.log(dayjs(date).format("DD.MM.YYYY"))
						const disabled = value !== dayjs(date).format("DD.MM.YYYY")
						const day = date.getDate();
						return (
							<Indicator size={6} color='red' offset={8} disabled={disabled}>
								<div>{day}</div>
							</Indicator>
						);
					}}
				/>
			</div>
		</Modal>
	);
};

CalendarPicker.propTypes = {
	opened: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired
};

export default CalendarPicker;
