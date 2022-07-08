import React, { useState } from 'react';
import CalendarFilter from '../components/CalendarFilter';
import DashboardPanels from '../components/DashboardPanels';
import Map from '../components/Map';
import dayjs from 'dayjs';
import CalendarPicker from '../components/CalendarPicker';

export function Index() {
	const [active, setActive] = useState({ date: dayjs().format('DD.MM.YYYY') });
	const [calendar, showCalendar] = useState(false);

	return (
		<div className='p-4 h-full'>
			<div className='flex items-center justify-between px-4 py-3'>
				<div className='flex flex-col justify-center'>
					<span className='text-4xl font-medium'>Home</span>
				</div>
				<CalendarPicker opened={calendar} onClose={() => showCalendar(false)} value={active.date} setValue={value => setActive(prevState => ({ date: dayjs(new Date(value)).format('DD.MM.YYYY') }))} />
				<CalendarFilter current={active.date} showCalendar={showCalendar} />
			</div>
			<DashboardPanels date={active.date} />
			<div className='my-6'>
				<Map height={595}/>
			</div>
		</div>
	);
}

export default Index;
