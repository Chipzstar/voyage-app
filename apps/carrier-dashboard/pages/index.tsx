import { CalendarFilter, DateRange } from '@voyage-app/shared-ui-components';
import React, { useState } from 'react';
import moment from 'moment';
import OverallPerformance from '../charts/OverallPerformance';
import {
	Chart as ChartJS,
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';

ChartJS.register(
	RadialLinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend
);

export function Index() {
	const [dateRange, setRange] = useState([
		moment().startOf('day').toDate(),
		moment().startOf('day').add(1, 'day').toDate()]
	);
	return (
		<div className='py-4 px-8 page-container'>
			<div className='flex justify-end mb-5'>
				<CalendarFilter current={dateRange as DateRange} setCurrent={setRange} />
			</div>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit'>
				<div className='border border-voyage-grey p-4'>
					<header className='chart-header'>
						Overall Performance
					</header>
					<div className='flex grow'>
						<OverallPerformance />
					</div>
				</div>
				<div className='border border-voyage-grey p-4 flex'>
					<header className='chart-header'>
						Business
					</header>
					<div></div>
				</div>
				<div className='border border-voyage-grey p-4 flex'>
					<header className='chart-header'>
						Trips Overview
					</header>
					<div></div>
				</div>
				<div className='border border-voyage-grey p-4 flex'>
					<header className='chart-header'>
						Available Loads
					</header>
					<div></div>
				</div>
			</div>
		</div>
	);
}

export default Index;
