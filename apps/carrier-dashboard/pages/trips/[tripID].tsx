import React, { useEffect, useMemo } from 'react';
import { Timeline, Text, Button, Anchor, Badge } from '@mantine/core';
import { ChevronLeft, ChevronRight, Clock } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import moment from 'moment';
import PageNav from '../../layout/PageNav';
import Link from 'next/link';
import ContentContainer from '../../layout/ContentContainer';
import { useSelector } from 'react-redux';
import { setLoads, useLoads } from '../../store/feature/loadSlice';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { fetchLoads } from '../../utils/functions';
import prisma from '../../db';
import { wrapper } from '../../store';
import { capitalize, sanitize } from '@voyage-app/shared-utils';

const tripDetails = ({ loadId, pageIndex }) => {
	const router = useRouter();
	const loads = useSelector(useLoads);

	const EVENT_DESCRIPTIONS = {
		NEW: `Shipment has been created and awaiting for driver to accept `,
		PENDING: '',
		DISPATCHED: 'Shipment has been accepted by the driver and heading to pickup',
		EN_ROUTE: 'Driver has collected the shipment and is heading to the destination',
		COMPLETED: 'Shipment has been delivered successfully',
		CANCELLED: 'Shipment has been cancelled'
	};

	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Trips', href: PATHS.TRIPS },
		{ title: loadId, href: router.pathname }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	const { pickup, delivery, packageInfo, carrierInfo, customer, trackingHistory } = useMemo(() => {
		return {
			customer: loads[pageIndex].customer,
			pickup: loads[pageIndex].pickup,
			delivery: loads[pageIndex].delivery,
			packageInfo: loads[pageIndex]?.package,
			carrierInfo: loads[pageIndex]?.carrierInfo,
			trackingHistory: loads[pageIndex]?.trackingHistory ?? []
		};
	}, [loads, pageIndex]);

	useEffect(() => console.log(loads[pageIndex]), [loads]);

	return (
		<ContentContainer>
			<PageNav items={items} />
			<div className='px-4 flex flex-col h-full'>
				<header className='flex flex-row items-center justify-between mb-8 py-3'>
					<h2 className='text-2xl uppercase'>{loadId}</h2>
					<div className='flex flex-row justify-between space-x-8'>
						<Button
							disabled={!pageIndex}
							variant='outline'
							color='gray'
							radius={0}
							leftIcon={<ChevronLeft size={24} strokeWidth={1} />}
							className='h-12'
							onClick={() => {
								const prevIndex = pageIndex - 1;
								router.push(`${PATHS.TRIPS}/${loads[prevIndex].loadId}`);
							}}
						>
							<span className='text-lg'>Prev</span>
						</Button>
						<Button
							disabled={pageIndex === loads.length - 1}
							variant='outline'
							color='gray'
							radius={0}
							rightIcon={<ChevronRight size={24} strokeWidth={1} />}
							className='h-12'
							onClick={() => {
								const nextIndex = pageIndex + 1;
								router.push(`${PATHS.TRIPS}/${loads[nextIndex].loadId}`);
							}}
						>
							<span className='text-lg'>Next</span>
						</Button>
					</div>
				</header>
				<main className='grow'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10'>
						<div className='grid grid-cols-1 gap-y-8 place-content-start'>
							<aside className='border border-voyage-grey p-5 flex flex-col space-y-4'>
								<section className='grid grid-cols-1 lg:grid-cols-3 gap-y-6'>
									<div className='space-y-2'>
										<span className='page-subheading'>Pickup</span>
										<div className='flex'>
											<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center'>
												<Text>{moment.unix(pickup.window.start).format('HH:mm a')} - {moment.unix(pickup.window.end).format('HH:mm a')}</Text>
											</Badge>
										</div>
										<Text>{pickup.street}</Text>
										<Text>{pickup.city}</Text>
										<Text>{pickup.postcode}</Text>
									</div>
									<div className='space-y-2'>
										<span className='page-subheading'>Dropoff</span>
										<div className='flex'>
											<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center'>
												<Text>{delivery.window?.start ? moment.unix(delivery.window.start).format('HH:mm a') : 'Estimating...'}</Text>
											</Badge>
										</div>
										<Text>{delivery.street}</Text>
										<Text>{delivery.city}</Text>
										<Text>{delivery.postcode}</Text>
									</div>
									<div className='space-y-2'>
										<span className='page-subheading'>Customer</span>
										<p>{customer?.company}</p>
										<p>{customer?.name}</p>
									</div>
									<div className='space-y-2'>
										<span className='page-subheading'>Driver</span>
										<p>{carrierInfo?.driverName}</p>
										<p>{carrierInfo?.driverPhone}</p>
										<p className='capitalize'>{sanitize(carrierInfo?.vehicleType.toLowerCase())}</p>
									</div>
									<div className='space-y-2'>
										<span className='page-subheading'>Package Details</span>
										<div className='flex'>
											<p>{packageInfo.weight} kg</p>
											<p>&nbsp;/&nbsp;</p>
											<p>
												{packageInfo.dimensions.length} x {packageInfo.dimensions.width} x {packageInfo.dimensions.height} cm
											</p>
										</div>
									</div>
								</section>
							</aside>
							<aside className='border border-voyage-grey p-5'>
								<header className='page-subheading'>Summary</header>
								<div className='pt-8'>
									<Timeline active={trackingHistory.length - 1} bulletSize={18} lineWidth={2}>
										{trackingHistory.map((event, index) => (
											<Timeline.Item key={index} title={capitalize(event.status.toLowerCase())} active={index < trackingHistory.length - 1}>
												<Text color='dimmed' size='sm'>
													{EVENT_DESCRIPTIONS[event.status]}
												</Text>
												<Text size='xs' mt={4}>
													{moment.unix(event.timestamp).from(moment())}
												</Text>
											</Timeline.Item>
										))}
									</Timeline>
								</div>
							</aside>
						</div>
						<div>
							<Map height={215} />
						</div>
					</div>
				</main>
			</div>
		</ContentContainer>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, params }) => {
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
	const loads = await fetchLoads(token?.carrierId, prisma);
	console.log(loads);
	store.dispatch(setLoads(loads));
	let pageIndex = loads.findIndex(item => item.loadId === params.tripID);
	return {
		props: {
			loadId: params.tripID,
			pageIndex
		}
	};
});

export default tripDetails;
