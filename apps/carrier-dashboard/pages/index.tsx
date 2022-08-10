import { CalendarFilter, DateRange } from '@voyage-app/shared-ui-components';
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import Map from '../components/Map';
import TruckLoadTimeline from '../components/TruckLoadTimeline';
import PageHeader from '../layout/PageHeader';
import { PUBLIC_PATHS } from '../utils/constants';
import { unstable_getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions} from './api/auth/[...nextauth]';
import prisma from '../db'
import { setCarrier, useCarrier } from '../store/feature/profileSlice'
import { wrapper } from '../store'
import { useSelector } from 'react-redux'

export function Index(props) {
	const [dateRange, setRange] = useState([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);
	const profile = useSelector(useCarrier);

	useEffect(() => {
		console.log(profile);
	}, [profile]);

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

export const getServerSideProps = wrapper.getServerSideProps(store => async({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	console.log('\nHOMEPAGE');
	console.log(token);
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id){
		const carrier = await prisma.carrier.findFirst({
			where: {
            userId: {
					equals: session.id
				}
			}
		})
		if (carrier) {
			carrier.createdAt = moment(carrier.createdAt).unix();
			carrier.updatedAt = moment(carrier.updatedAt).unix();
			store.dispatch(setCarrier(carrier));
		}
	}
	return {
		props: {
			session
		}
	};
});

export default Index;
