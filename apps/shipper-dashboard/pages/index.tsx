import React, {useState} from 'react';
import CalendarFilter from '../components/CalendarFilter';
import DashboardPanels from '../components/DashboardPanels';
import Map from '../components/Map';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import {useSession} from "next-auth/react";

export function Index() {
	const dispatch = useDispatch();
	const { data:session, status} = useSession();
	const [dateRange, setRange] = useState([
		moment().startOf('day').toDate(),
		moment().startOf('day').add(1, 'day').toDate()]
	);

	console.log(session, status)
	return (
		<div className='p-4 h-full'>
			<div className='flex items-center justify-between pl-4 py-3'>
				<div className='flex flex-col justify-center'>
					<span className='text-4xl font-medium'>Home</span>
				</div>
				<CalendarFilter current={dateRange} setCurrent={setRange} />
			</div>
			<DashboardPanels dateRange={dateRange} />
			<div className='my-6'>
				<Map height={595} />
			</div>
		</div>
	);
}

export default Index
