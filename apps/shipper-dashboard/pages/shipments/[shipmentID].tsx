import React from 'react';
import { Timeline, Text, Button } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import moment from 'moment';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '../../db';
import { useSelector } from 'react-redux';
import { store } from '../../store';
import { setShipments, useShipments } from '../../store/features/shipmentsSlice';
import { fetchShipments } from '@voyage-app/shared-utils';
import { getToken } from 'next-auth/jwt';
import { Shipment } from '@voyage-app/shared-types';
import { fetchShipper } from '../../utils/functions';
import { setShipper } from '../../store/features/profileSlice';

const viewShipment = ({ shipmentId, pageIndex }) => {
	const router = useRouter();
	const shipments = useSelector(useShipments);

	return (
		<div className='h-screen p-4'>
			<div className='flex h-full flex-col px-4'>
				<section className='mb-8 flex items-center space-x-4' role='button' onClick={() => router.back()}>
					<ChevronLeft size={48} strokeWidth={2} color={'black'} />
					<span className='page-header'>Shipments</span>
				</section>
				<header className='mb-8 flex flex-row items-center justify-between py-3'>
					<h2 className='text-2xl uppercase'>{shipmentId}</h2>
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
								router.push(`${PATHS.SHIPMENTS}/${shipments[prevIndex].shipmentId}`);
							}}
						>
							<span className='text-lg'>Prev</span>
						</Button>
						<Button
							disabled={pageIndex === shipments.length - 1}
							variant='outline'
							color='gray'
							radius={0}
							rightIcon={<ChevronRight size={24} strokeWidth={1} />}
							className='h-12'
							onClick={() => {
								const nextIndex = pageIndex + 1;
								router.push(`${PATHS.SHIPMENTS}/${shipments[nextIndex].shipmentId}`);
							}}
						>
							<span className='text-lg'>Next</span>
						</Button>
					</div>
				</header>
				<main className='grow'>
					<div className='grid grid-cols-1 gap-x-10 lg:grid-cols-2'>
						<div className='grid grid-cols-1 place-content-start gap-y-8'>
							<aside className='border-voyage-grey flex flex-col space-y-4 border p-5'>
								<div className='flex flex-row items-center'>
									<header className='shipment-header'>Provider</header>
								</div>
								<div className='space-y-2'>
									<span className='text-2xl font-medium'>Carrier</span>
									<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.name}</p>
									<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.location}</p>
								</div>
								<div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Contact</span>
										<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.driverName}</p>
										<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.driverPhone}</p>
									</div>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Driver</span>
										<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.driverName}</p>
										<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.driverPhone}</p>
										<p className='text-lg'>{shipments[pageIndex]?.carrierInfo?.vehicleId}</p>
									</div>
								</div>
							</aside>
							<aside className='border-voyage-grey border p-5'>
								<header className='shipment-header'>Summary</header>
								<div className='pt-8'>
									<Timeline active={1} bulletSize={24} lineWidth={2}>
										{[].map((event, index) => (
											<Timeline.Item key={index} title={event.status} active={index === 0}>
												<Text color='dimmed' size='sm'>
													{event.description}
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
		</div>
	);
};

export async function getServerSideProps({ req, res, params }) {
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
	let pageIndex = 0;
	// fetch all shipments for the current user
	if (session.id || token?.shipperId) {
		const shipper = await fetchShipper(session.id, token?.shipperId, prisma)
		store.dispatch(setShipper(shipper))
		const shipments = await fetchShipments(token?.shipperId, prisma);
		store.dispatch(setShipments(shipments));
		pageIndex = store.getState().shipments.findIndex(item => item.shipmentId === params.shipmentID);
		console.table({ pageIndex });
	}
	return {
		props: {
			session,
			shipmentId: params.shipmentID,
			pageIndex
		} // will be passed to the page component as props
	};
}

export default viewShipment;
