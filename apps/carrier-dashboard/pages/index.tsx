import { CalendarFilter, DateRange } from '@voyage-app/shared-ui-components';
import React, { useState } from 'react';
import moment from 'moment';
import Map from '../components/Map';
import TruckLoadTimeline from '../components/TruckLoadTimeline';
import PageHeader from '../layout/PageHeader';
import { PUBLIC_PATHS } from '../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions} from './api/auth/[...nextauth]';

export function Index(props) {
	const [dateRange, setRange] = useState([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);
	return (
		<div className='py-4 px-8 h-full overflow-y-auto'>
			<div className='flex justify-between mb-5'>
				<PageHeader title='Truck Board' />
				<CalendarFilter current={dateRange as DateRange} setCurrent={setRange} />
			</div>
			<Map height={250} />
			<TruckLoadTimeline />
		</div>
	);
}

export async function getServerSideProps({ req, res }) {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	console.log('\nHOMEPAGE');
	console.log(session);
	console.log(token);
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	return {
		props: {
			session
		}
	};
}

export default Index;
