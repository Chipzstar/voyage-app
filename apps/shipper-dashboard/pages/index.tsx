import React, { useState } from 'react';
import CalendarFilter from '../components/CalendarFilter';
import DashboardPanels from '../components/DashboardPanels';
import Map from '../components/Map';
import moment from 'moment';

export function Index() {
	const [dateRange, setRange] = useState([moment().toDate(), moment().add(1, 'day').toDate()]);

	return (
		<div className='p-4 h-full'>
			<div className='flex items-center justify-between pl-4 py-3'>
				<div className='flex flex-col justify-center'>
					<span className='text-4xl font-medium'>Home</span>
				</div>
				{/*<CalendarPicker opened={calendar} onClose={() => showCalendar(false)} value={active.date} setValue={value => setActive(prevState => ({ date: moment(new Date(value)).format('DD.MM.YYYY') }))} />*/}
				<CalendarFilter current={dateRange} setCurrent={setRange}/>
			</div>
			<DashboardPanels date={dateRange} />
			<div className='my-6'>
				<Map height={595}/>
			</div>
		</div>
	);
}

export default Index;
