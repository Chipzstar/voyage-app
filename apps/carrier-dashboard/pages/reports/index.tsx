import { Card, Center, Container, Grid, Group, Stack } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { CalendarFilter } from '@voyage-app/shared-ui-components';
import OverviewPieChart from '../../charts/OverviewPieChart';
import InvoiceReport from '../../charts/InvoiceReport';
import DowntimeReport from '../../charts/DowntimeReport';
import DispatcherScoreboard from '../../charts/DispatcherScoreboard';
import { useSelector } from 'react-redux';
import { setDrivers, useDrivers } from '../../store/feature/driverSlice';
import { wrapper } from '../../store';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { PUBLIC_PATHS } from '../../utils/constants';
import { fetchCustomers, fetchDrivers, fetchLoads, fetchProfile, fetchVehicles } from '../../utils/functions';
import { setCarrier } from '../../store/feature/profileSlice';
import { setVehicles, useVehicles } from '../../store/feature/vehicleSlice';
import { setLoads, useLoads } from '../../store/feature/loadSlice';
import { DateRange } from '@voyage-app/shared-types';
import { checkWithinTimeRange } from '@voyage-app/shared-utils';
import prisma from '../../db';
import { VEHICLE_STATUS } from '../../utils/types';
import { setCustomers, useCustomers } from 'apps/carrier-dashboard/store/feature/customerSlice';

const reporting = () => {
	const [dateRange, setRange] = useState<DateRange>([
		moment().startOf('day').toDate(),
		moment().startOf('day').add(1, 'day').toDate()
	]);
	const drivers = useSelector(useDrivers);
	const loads = useSelector(useLoads);
	const vehicles = useSelector(useVehicles);
	const customers = useSelector(useCustomers);

	const truckData = useMemo(() => {
		const numAssigned = vehicles.filter(v => v.status === VEHICLE_STATUS.ON_THE_ROAD).length
		const numUnassigned = vehicles.length - numAssigned
		
		return [
			{
				id: 'assigned',
				label: 'Assigned',
				value: numAssigned,
				color: 'hsl(52, 70%, 50%)'
			},
			{
				id: 'unassigned',
				label: 'Unassigned',
				value: numUnassigned,
				color: 'hsl(198, 93.2%, 59.6%)'
			}
		];
	}, [vehicles]);

	const numLoads = useMemo(() => loads.filter(load => checkWithinTimeRange(dateRange, load.pickup.window.start, load.pickup.window.end)).length, [loads, dateRange]);
	
	const avgRate = useMemo(
		() =>
			loads.reduce((prev, curr) => {
				if (checkWithinTimeRange(dateRange, curr.pickup.window.start, curr.pickup.window.end)) {
					return prev + curr.rate;
				}
				return prev;
			}, 0),
		[loads, dateRange]
	);

	return (
		<Container fluid className='h-screen bg-stone-100' py={0}>
			<div className='mb-6 flex items-center justify-between pt-4'>
				<CalendarFilter current={dateRange} setCurrent={setRange} amountOfMonths={2} />
			</div>
			<Grid grow gutter='xl'>
				<Grid.Col md={6}>
					<Group className='h-full w-full' noWrap={false}>
						<Card p='lg' radius='xs' shadow='sm' className='h-full'>
							<Card.Section p='lg' className='h-full'>
								<header className='chart-header'>Trucks</header>
								<Center className='h-full'>
									<OverviewPieChart data={truckData} />
								</Center>
							</Card.Section>
						</Card>
						<Card p='lg' radius='xs' shadow='sm' className='flex h-full grow flex-wrap items-center justify-center'>
							<Card.Section className='w-full'>
								<Stack p='md' className='w-full' align='center'>
									<div className='w-full space-y-2 text-center'>
										<h3>Loads</h3>
										<Center>
											<div className='border-voyage-grey w-full rounded-sm border py-1'>{numLoads}</div>
										</Center>
									</div>
									<div className='w-full space-y-2 text-center'>
										<h3>Avg Rate</h3>
										<Center>
											<div className='border-voyage-grey w-full rounded-sm border py-1'>£{avgRate.toFixed(2)}</div>
										</Center>
									</div>
									<div className='w-full space-y-2 text-center'>
										<h3>Loaded Avg Rate</h3>
										<Center>
											<div className='border-voyage-grey w-full rounded-sm border py-1'>£0.00</div>
										</Center>
									</div>
								</Stack>
							</Card.Section>
						</Card>
					</Group>
				</Grid.Col>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='flex h-full grow flex-wrap'>
						<Card.Section className='w-full' p='lg'>
							<header className='chart-header'>Invoiced Loads</header>
							<InvoiceReport loads={loads} />
						</Card.Section>
					</Card>
				</Grid.Col>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='flex h-full grow flex-wrap'>
						<Card.Section className='w-full' p='lg'>
							<header className='chart-header'>Driver Downtime Scoreboard</header>
							<DowntimeReport drivers={drivers} />
						</Card.Section>
					</Card>
				</Grid.Col>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='flex h-full grow flex-wrap'>
						<Card.Section className='w-full' p='lg'>
							<header className='chart-header'>Dispatcher Scoreboard</header>
							<DispatcherScoreboard loads={loads} customers={customers} dateRange={dateRange} />
						</Card.Section>
					</Card>
				</Grid.Col>
			</Grid>
		</Container>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res }) => {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	const token = await getToken({ req });
	if (!session) {
		return {
			redirect: {
				destination: PUBLIC_PATHS.LOGIN,
				permanent: false
			}
		};
	}
	if (session.id || token?.carrierId) {
		let carrier = await fetchProfile(session.id, token?.carrierId, prisma);
		let drivers = await fetchDrivers(token?.carrierId, prisma);
		let loads = await fetchLoads(token?.carrierId, prisma);
		let vehicles = await fetchVehicles(token?.carrierId, prisma)
		let customers = await fetchCustomers(token?.carrierId, prisma)
		store.dispatch(setCarrier(carrier));
		store.dispatch(setDrivers(drivers));
		store.dispatch(setLoads(loads));
		store.dispatch(setVehicles(vehicles));
		store.dispatch(setCustomers(customers))
	}
	return {
		props: {
			session
		}
	};
});

export default reporting;
