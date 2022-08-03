import React from 'react';
import { Timeline, Text, Button } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import { PATHS } from '../../utils/constants';
import moment from 'moment';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import prisma from '../../db';
import { useSelector } from 'react-redux';
import { store } from '../../store';
import { setShipments } from '../../store/features/shipmentsSlice';
import { Shipment } from '../../utils/types';

export async function getServerSideProps({ req, res, params }) {
	// @ts-ignore
	const session = await unstable_getServerSession(req, res, authOptions);
	let pageIndex = 0;
	// fetch all shipments for the current user
	let shipments = await prisma.shipment.findMany({
		where: {
			userId: {
				equals: session.id
			}
		},
		orderBy: {
			createdAt: 'desc'
		}
	});
	shipments = shipments.map(shipment => ({
		...shipment,
		createdAt: moment(shipment.createdAt).unix(),
		updatedAt: moment(shipment.updatedAt).unix()
	}));
	// set them in memory
	store.dispatch(setShipments(shipments));
	// find the first shipment with matching shipment ID
	const shipment = await prisma.shipment.findFirst({
		where: {
			userId: {
				equals: session.id
			},
			shipmentId: {
				equals: params.shipmentID
			}
		}
	});
	if (shipment) {
		pageIndex = store.getState().shipments.findIndex(item => item.shipmentId === params.shipmentID);
		console.table({ pageIndex });
	}
	return {
		props: {
			initialState: store.getState(),
			shipmentId: params.shipmentID,
			pageIndex
		} // will be passed to the page component as props
	};
}

const viewShipment = ({ shipmentId, pageIndex, initialState }) => {
	const router = useRouter();
	const shipments: Shipment[] = useSelector(state => state['shipments']);

	return (
		<div className='p-4 h-screen'>
			<div className='px-4 flex flex-col h-full'>
				<section className='flex items-center space-x-4 mb-8' role='button' onClick={() => router.back()}>
					<ChevronLeft size={48} strokeWidth={2} color={'black'} />
					<span className='page-header'>Shipments</span>
				</section>
				<header className='flex flex-row items-center justify-between mb-8 py-3'>
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
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-10'>
						<div className='grid grid-cols-1 gap-y-8 place-content-start'>
							<aside className='border border-voyage-grey p-5 flex flex-col space-y-4'>
								<div className='flex flex-row items-center'>
									<header className='shipment-header'>Provider</header>
								</div>
								<div className='space-y-2'>
									<span className='text-2xl font-medium'>Carrier</span>
									<p className='text-lg'>{shipments[pageIndex]?.carrier?.name}</p>
									<p className='text-lg'>{shipments[pageIndex]?.carrier?.location}</p>
								</div>
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Contact</span>
										<p className='text-lg'>{shipments[pageIndex]?.carrier?.driverName}</p>
										<p className='text-lg'>{shipments[pageIndex]?.carrier?.driverPhone}</p>
									</div>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Driver</span>
										<p className='text-lg'>{shipments[pageIndex]?.carrier?.driverName}</p>
										<p className='text-lg'>{shipments[pageIndex]?.carrier?.driverPhone}</p>
										<p className='text-lg'>{shipments[pageIndex]?.carrier?.vehicle}</p>
									</div>
								</div>
							</aside>
							<aside className='border border-voyage-grey p-5'>
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

export default viewShipment;
