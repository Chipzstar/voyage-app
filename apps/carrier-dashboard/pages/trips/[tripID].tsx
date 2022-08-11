import React from 'react';
import { Timeline, Text, Button, Anchor } from '@mantine/core'
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import Map from '../../components/Map';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants'
import moment from 'moment';
import PageNav from '../../layout/PageNav'
import Link from 'next/link'
import ContentContainer from '../../layout/ContentContainer'
import { useSelector } from 'react-redux'
import { setLoads, useLoads } from '../../store/feature/loadSlice'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]'
import { getToken } from 'next-auth/jwt'
import { fetchLoads } from '../../utils/functions'
import prisma from '../../db'
import { store } from '../../store'

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
	const loads = await fetchLoads(token?.carrierId, prisma)
	store.dispatch(setLoads(loads))
	let pageIndex = loads.findIndex(item => item.loadId === params.tripID);
	return {
		props: {
			loadId: params.tripID,
			pageIndex
		} // will be passed to the page component as props
	};
}

const tripDetails = ({ loadId, pageIndex }) => {
	const router = useRouter();
	const loads = useSelector(useLoads)
	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Trips', href: PATHS.TRIPS },
		{ title: loadId, href: router.pathname }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

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
								<div className='flex flex-row items-center'>
									<header className='shipment-header'>Provider</header>
								</div>
								<div className='space-y-2'>
									<span className='text-2xl font-medium'>Carrier</span>
									<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.name}</p>
									<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.location}</p>
								</div>
								<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Contact</span>
										<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.driverName}</p>
										<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.driverPhone}</p>
									</div>
									<div className='space-y-2'>
										<span className='text-2xl font-medium'>Driver</span>
										<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.driverName}</p>
										<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.driverPhone}</p>
										<p className='text-lg'>{loads[pageIndex]?.carrierInfo?.vehicleType}</p>
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
		</ContentContainer>
	);
};

export default tripDetails;
