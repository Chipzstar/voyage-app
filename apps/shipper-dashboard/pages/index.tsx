import { useState } from 'react';
import Layout from '../layout/Layout';
import CalendarFilter from '../components/CalendarFilter';
import DashboardPanels from '../components/DashboardPanels';
import Map from '../components/Map';

export function Index() {
	const [active, setActive] = useState({ date: new Date() });
	return (
		<Layout>
			<div className='p-4'>
				<div className='flex justify-between px-4 pt-3'>
					<div className='flex flex-col justify-center'>
						<span className='dashboard-header mb-3'>
							<span className='text-4xl font-semibold'>Home</span>
						</span>
					</div>
					<CalendarFilter current={active} onSelect={setActive} />
				</div>
				<DashboardPanels id='dashboard' date={active.date} />
				<div className="my-6">
					<Map />
				</div>
			</div>
		</Layout>
	);
}

export default Index;
