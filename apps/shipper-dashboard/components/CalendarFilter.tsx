import React  from 'react';
import PropTypes from 'prop-types';
import { DateRangePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';

const CalendarFilter = ({ current, setCurrent }) => {
	return (
		<DateRangePicker
			size="md"
			radius={0}
			inputFormat="DD.MM.YYYY"
			placeholder="Pick dates range"
			value={current}
			rightSection={<Calendar size={18} color="grey"/>}
			onChange={(value) => setCurrent(value)}
		/>
	);
};

CalendarFilter.propTypes = {
	current: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
	setCurrent: PropTypes.func.isRequired,
};

export default CalendarFilter;
