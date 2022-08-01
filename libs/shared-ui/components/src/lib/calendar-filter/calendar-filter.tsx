import { Calendar } from 'tabler-icons-react';
import { DateRangePicker } from '@mantine/dates';
import React from 'react';

export type DateRange = [Date | null, Date | null];

/* eslint-disable-next-line */
export interface CalendarFilterProps {
	current: DateRange;
	setCurrent: (date: DateRange | null) => void;
	amountOfMonths?: number;
}

export function CalendarFilter({ current, setCurrent, amountOfMonths=1 }: CalendarFilterProps) {
	return (
		<DateRangePicker
			amountOfMonths={amountOfMonths}
			size='md'
			radius={0}
			inputFormat='DD.MM.YYYY'
			placeholder='Pick dates range'
			value={current}
			rightSection={<Calendar size={18} color='grey' />}
			onChange={value => (value[1] instanceof Date ? setCurrent(value) : null)}
		/>
	);
}

export default CalendarFilter;
