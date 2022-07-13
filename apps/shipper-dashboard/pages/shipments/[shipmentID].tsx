import React from 'react';
import { Timeline, Text, Button } from '@mantine/core';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import { PATHS, SAMPLE_HISTORY } from '../../utils/constants';
import { SAMPLE_SHIPMENTS } from '../../utils/constants';
import moment from 'moment';

export async function getServerSideProps(context) {
	const index = SAMPLE_SHIPMENTS.findIndex(shipment => shipment.shipmentID === context.params.shipmentID);
	return {
		props: {
			shipmentID: context.params.shipmentID,
			pageIndex: index
		} // will be passed to the page component as props
	};
}

const viewShipment = props => {
	const router = useRouter();
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 flex flex-col h-full'>
				<section className='flex items-center space-x-4 mb-8' role='button' onClick={() => router.back()}>
					<ChevronLeft size={48} strokeWidth={2} color={'black'} />
					<span className='page-header'>Shipments</span>
				</section>
				<header className='flex flex-row items-center justify-between mb-8 py-3'>
					<h2 className='text-2xl uppercase'>{props.shipmentID}</h2>
					<div className='flex flex-row justify-between space-x-8'>
						<Button
							disabled={!props.pageIndex}
							variant='outline'
							color='gray'
							radius={0}
							leftIcon={<ChevronLeft size={24} strokeWidth={1} />}
							className='h-12'
							onClick={() => {
								const prevIndex = props.pageIndex - 1;
								router.push(`${PATHS.SHIPMENTS}/${SAMPLE_SHIPMENTS[prevIndex].shipmentID}`);
							}}
						>
							<span className='text-lg'>Prev</span>
						</Button>
						<Button
							disabled={props.pageIndex === SAMPLE_SHIPMENTS.length - 1}
							variant='outline'
							color='gray'
							radius={0}
							rightIcon={<ChevronRight size={24} strokeWidth={1} />}
							className='h-12'
							onClick={() => {
								const nextIndex = props.pageIndex + 1;
								router.push(`${PATHS.SHIPMENTS}/${SAMPLE_SHIPMENTS[nextIndex].shipmentID}`);
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
									<p className='text-lg'>HBCS Logistics LTD</p>
									<p className='text-lg'>Manchester, England</p>
								</div>
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>PIC</span>
										<p className='text-lg'>James Currier</p>
										<p className='text-lg'>+44 5687665433</p>
									</div>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Driver</span>
										<p className='text-lg'>Tony Soprano</p>
										<p className='text-lg'>Ford Trailer Truck</p>
										<p className='text-lg'>NX12 5TY</p>
										<p className='text-lg'>+44 5687215433</p>
									</div>
								</div>
							</aside>
							<aside className='border border-voyage-grey p-5'>
								<header className='shipment-header'>Summary</header>
								{/*<div className='px-8 pt-8'>
									<ul className='-pb-11'>
										{SAMPLE_HISTORY.map(event => (
											<li>
												<div className='relative pb-8'>
													<span className='absolute top-2 left-2 -ml-px h-full w-0.5 bg-secondary' aria-hidden='true'></span>
													<div className='relative flex space-x-3'>
														<div>
															<span className='flex h-4 w-4 items-center rounded-full bg-secondary '></span>
														</div>
														<div className='flex flex-col text-md text-gray-800'>
															<div className='text-xl font-medium'>{event.status}</div>
															<div>{event.description}</div>
														</div>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>*/}
								<div className='pt-8'>
									<Timeline active={1} bulletSize={24} lineWidth={2}>
										{SAMPLE_HISTORY.map((event, index) => (
											<Timeline.Item title={event.status} active={index === SAMPLE_HISTORY.length - 1}>
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
