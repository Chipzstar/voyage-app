import { CalendarFilter, DateRange } from '@voyage-app/shared-ui-components';
import React, { useState } from 'react';
import moment from 'moment';
import Map from '../components/Map';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function Index(props) {
	const [dateRange, setRange] = useState([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);
	return (
		<div className='py-4 px-8 h-full'>
			<div className='flex justify-between mb-5'>
				<header className="page-header">Truck board</header>
				<CalendarFilter current={dateRange as DateRange} setCurrent={setRange} />
			</div>
			<div>
				<Map height={160} />
			</div>
			{/*<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 h-fit'>
				<div className='border border-voyage-grey p-4'>
					<header className='chart-header'>
						Overall Performance
					</header>
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
			</div>*/}
		</div>
	);
}

export default Index
