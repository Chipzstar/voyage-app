import { Card, Center, Container, createStyles, Grid, Group, RingProgress, Stack, Text } from '@mantine/core';
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
import { fetchDrivers, fetchLoads, fetchMembers, fetchProfile, fetchVehicles } from '../../utils/functions';
import prisma from '../../db';
import { setCarrier } from '../../store/feature/profileSlice';
import { setVehicles, useVehicles } from '../../store/feature/vehicleSlice';
import { setLoads, useLoads } from '../../store/feature/loadSlice';
import { DateRange } from '@voyage-app/shared-types';
import { VEHICLE_STATUS } from '../../utils/types';
import { setMembers, useControllers } from '../../store/feature/memberSlice';

const useStyles = createStyles(theme => ({
	inner: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.fn.smallerThan(350)]: {
			flexDirection: 'column'
		}
	},
	label: {
		fontSize: 22,
		fontWeight: 700,
		lineHeight: 1
	},
	ring: {
		display: 'flex',
		flex: 1,
		justifyContent: 'center',

		[theme.fn.smallerThan(350)]: {
			justifyContent: 'center',
			marginTop: theme.spacing.md
		}
	}
}));

const reporting = () => {
	const { classes, theme } = useStyles();
	const [dateRange, setRange] = useState<DateRange>([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);
	const drivers = useSelector(useDrivers);
	const loads = useSelector(useLoads);
	const vehicles = useSelector(useVehicles);
	const controllers = useSelector(useControllers);

	const truckData = useMemo(() => {
		const numAssigned = vehicles.filter(v => v.status === VEHICLE_STATUS.ON_THE_ROAD).length;
		const numUnassigned = vehicles.length - numAssigned;
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

	const activeVehicles = useMemo(() => {
		return vehicles.filter(v => v.currentDriver || v.status === VEHICLE_STATUS.ON_THE_ROAD).length;
	}, [vehicles]);

	return (
		<Container fluid className='h-screen bg-stone-100' py={0}>
			<div className='mb-6 flex items-center justify-between pt-4'>
				<CalendarFilter current={dateRange} setCurrent={setRange} amountOfMonths={2} />
			</div>
			<Grid grow gutter='xl'>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='h-full'>
						<header className='chart-header'>Trucks</header>
						<div className={classes.inner}>
							<Stack p='md' >
								<Center className='h-full'>
									<OverviewPieChart data={truckData} />
								</Center>
							</Stack>
							<div className={classes.ring}>
								<RingProgress
									roundCaps
									thickness={6}
									size={150}
									sections={[
										{
											value: (activeVehicles / vehicles.length) * 100,
											color: theme.primaryColor
										}
									]}
									label={
										<div>
											<Text align='center' size='lg' className={classes.label} sx={{ fontSize: 22 }}>
												{((activeVehicles / vehicles.length) * 100).toFixed(0)}%
											</Text>
											<Text align='center' size='xs' color='dimmed'>
												Vehicle Utilization
											</Text>
										</div>
									}
								/>
							</div>
						</div>
					</Card>
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
							<DispatcherScoreboard loads={loads} controllers={controllers} dateRange={dateRange} />
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
		let vehicles = await fetchVehicles(token?.carrierId, prisma);
		let members = await fetchMembers(token?.carrierId, prisma);
		store.dispatch(setCarrier(carrier));
		store.dispatch(setDrivers(drivers));
		store.dispatch(setLoads(loads));
		store.dispatch(setVehicles(vehicles));
		store.dispatch(setMembers(members));
	}
	return {
		props: {
			session
		}
	};
});

export default reporting;
