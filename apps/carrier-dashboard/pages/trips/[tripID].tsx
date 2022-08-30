import React, { useMemo } from 'react';
import { Anchor, Badge, Button, Text, Timeline } from '@mantine/core';
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
import Pluralize from 'react-pluralize';
import { Load, MapType } from '../../utils/types';
import { mapboxClient } from '../../utils/clients';

const tripDetails = ({ loadId, pageIndex, geoJSON }) => {
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

	const load: Load = useMemo(() => {
		return loads[pageIndex]
	}, [loads, pageIndex]);

	return (
		<ContentContainer>
			<PageNav items={items} />
			<div className='px-4 flex flex-col h-full'>
				<section className='flex flex-row items-center justify-between mb-8 py-3'>
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
				</section>
				<main className='grow'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10'>
						<div className='grid grid-cols-1 gap-y-8 place-content-start'>
							<aside className='border border-voyage-grey p-5 flex flex-col space-y-4'>
								<section className='grid grid-cols-1 lg:grid-cols-3 gap-y-6'>
									<div className='flex flex-col space-y-2'>
										<span className='page-subheading'>Pickup</span>
										<div className='flex'>
											<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center'>
												<Text>
													{moment.unix(load.pickup.window.start).format('HH:mm a')} - {moment.unix(load.pickup.window.end).format('HH:mm a')}
												</Text>
											</Badge>
										</div>
										<Text>{load.pickup.street}</Text>
										<Text>{load.pickup.city}</Text>
										<Text transform='uppercase'>{load.pickup.postcode}</Text>
									</div>
									<div className='flex flex-col space-y-2'>
										<span className='page-subheading'>Dropoff</span>
										<div className='flex'>
											<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center'>
												<Text>{load.delivery.window?.start ? moment.unix(load.delivery.window.start).format('HH:mm a') : 'Estimating...'}</Text>
											</Badge>
										</div>
										<Text>{load.delivery.street}</Text>
										<Text>{load.delivery.city}</Text>
										<Text transform='uppercase'>{load.delivery.postcode}</Text>
									</div>
									<div className='flex flex-col space-y-2'>
										<span className='page-subheading'>Customer</span>
										<p>{load.customer?.company}</p>
										<p>{load.customer?.name}</p>
									</div>
									<div className='flex flex-col space-y-2'>
										<span className='page-subheading'>Driver</span>
										<p>{load.carrierInfo?.driverName}</p>
										<p>{load.carrierInfo?.driverPhone}</p>
										<p className='capitalize'>{sanitize(load.carrierInfo?.vehicleType.toLowerCase())}</p>
									</div>
									<div className='flex flex-col space-y-2'>
										<span className='page-subheading'>Package</span>
										<p>
											<Pluralize singular={load.packageInfo?.packageType.toLowerCase()} count={load.packageInfo?.quantity ?? 1} />
										</p>
										<p>
											{load.packageInfo?.weight} kg
										</p>
										<p>{load.packageInfo?.dimensions.length} x {load.packageInfo?.dimensions.width} x {load.packageInfo?.dimensions.height} cm</p>
										<p>
											{load.packageInfo?.description}
										</p>
									</div>
									<div className="flex flex-col space-y-2">
										<span className='page-subheading'>Rate</span>
										<span className="text-xl">£{load.rate.toFixed(2)}</span>
									</div>
								</section>
							</aside>
							<aside className='border border-voyage-grey p-5'>
								<header className='page-subheading'>Summary</header>
								<div className='pt-8'>
									<Timeline active={load.trackingHistory.length - 1} bulletSize={18} lineWidth={2}>
										{load.trackingHistory.map((event, index) => (
											<Timeline.Item key={index} title={capitalize(event.status.toLowerCase())} active={index < load.trackingHistory.length - 1}>
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
							<Map
								height={215}
								customers={[loads[pageIndex]]}
								type={MapType.ORDER}
								geoJSON={geoJSON}
								tripId={loadId}
							/>
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
	store.dispatch(setLoads(loads));
	let pageIndex = loads.findIndex((item: Load) => item.loadId === params.tripID);
	// fetch mapbox route directions between pickup and dropoff
	let geoJSON = {
		type: 'geojson',
		data: {
			type: 'Feature',
			properties: {},
			geometry: {
				type: 'LineString',
				coordinates: []
			}
		}
	};

	if (pageIndex !== -1) {
		const bounds = [loads[pageIndex].pickup.location.coordinates, loads[pageIndex].delivery.location.coordinates];
		const profile = 'mapbox/driving-traffic';
		let coordinates = bounds.join(';');
		const request = await mapboxClient.createRequest({
			method: 'GET',
			path: `/directions/v5/${profile}/${coordinates}?geometries=geojson`
		});
		const response = await request.send();
		geoJSON.data.geometry = response.body.routes[0].geometry;
	}
	return {
		props: {
			loadId: params.tripID,
			pageIndex,
			geoJSON
		}
	};
});

export default tripDetails;
