import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CalendarPicker from '../modals/CalendarPicker';

const CalendarFilter = ({ current, showCalendar }) => {
	return (
		<div role="button" className='border border-gray-300 px-5 py-3 flex flex-row items-center space-x-8' onClick={() => showCalendar(true)}>
			<span>{current}</span>
			<img src='/static/images/calendar.svg' alt='' className='h-6 w-6' />
		</div>
	);
};

CalendarFilter.propTypes = {
	current: PropTypes.string.isRequired,
	showCalendar: PropTypes.func.isRequired
};

export default CalendarFilter;
