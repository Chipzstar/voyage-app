import React, { useMemo, useState } from 'react';
import prisma from '../../db';
import Link from 'next/link';
import moment from 'moment/moment';
import { ActionIcon, Anchor, Button, Select, SimpleGrid, Text } from '@mantine/core';
import { SAMPLE_LOADS, PUBLIC_PATHS } from '../../utils/constants';
import { EQUIPMENT_TYPES, SelectInputData, Shipment } from '@voyage-app/shared-types';
import { ArrowRight, Calendar, Message } from 'tabler-icons-react';
import { capitalize, uniqueArray } from '@voyage-app/shared-utils';
import { DateRangePicker } from '@mantine/dates';
import ContentContainer from '../../layout/ContentContainer';
import PageNav from '../../layout/PageNav';
import { useSelector } from 'react-redux';
import { wrapper } from '../../store';
import { useShipments, setShipments } from '../../store/feature/shipmentSlice';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../../../shipper-dashboard/pages/api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { fetchShipments } from '@voyage-app/shared-utils';

const marketplace = () => {
	const shipments = useSelector(useShipments);
	const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
	const items = [
		{ title: 'Home', href: '/' },
		{ title: 'Marketplace', href: '/marketplace' }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	const uniquePickupLocations = useMemo(() => {
		const labels: SelectInputData[] = SAMPLE_LOADS.map((item, index) => ({
			value: item.pickup.street,
			label: item.pickup.street
		}));
		return uniqueArray(labels, 'value');
	}, []);

	const uniqueDeliveryLocations = useMemo(() => {
		const labels: SelectInputData[] = SAMPLE_LOADS.map((item, index) => ({
			value: item.delivery.street,
			label: item.delivery.street
		}));
		return uniqueArray(labels, 'value');
	}, []);

	return (
		<ContentContainer>
			<PageNav items={items} />
			<form className='flex flex-row space-x-3 pb-8'>
				<div className='flex'>
					<Select size='sm' searchable placeholder='Pickup' data={uniquePickupLocations} />
					<Select size='sm' searchable placeholder='Delivery' data={uniqueDeliveryLocations} />
				</div>
				<Select
					defaultValue={'100mi'}
					classNames={{
						root: 'w-32'
					}}
					size='sm'
					data={['10mi', '20mi', '50mi', '100mi', '200mi', '300mi']}
				/>
				<DateRangePicker
					placeholder='Select dates'
					classNames={{
						root: 'grow'
					}}
					icon={<Calendar size={16} />}
					value={value}
					onChange={setValue}
				/>
				<Select
					placeholder='All equipments'
					data={Object.values(EQUIPMENT_TYPES).map(
						(item): SelectInputData => ({
							value: item,
							label: capitalize(item.replace(/_/g, ' '))
						})
					)}
				/>
				<Button variant='outline'>
					<Text size='sm'>Clear</Text>
				</Button>
			</form>
			<div className='mb-5 space-y-3'>
				<header className='page-subheading'>{SAMPLE_LOADS.length} Loads available for you</header>
				<p className='font-medium text-gray-500'>{moment().format('dddd, MMM D')}</p>
			</div>
			<SimpleGrid cols={1}>
				{shipments.map((shipment: Shipment, index) => (
					<main key={index} className='border-voyage-grey space-y-3 border p-3'>
						<section className='flex space-x-8'>
							<div className='flex flex-col flex-wrap space-y-1'>
								<span className='font-medium'>John Lewis Warehouse</span>
								<span>{shipment.pickup.location}</span>
								<span className='text-sm'>
									{moment.unix(shipment.pickup.window.start).format('DD MMM')} {moment.unix(shipment.pickup.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.pickup.window.end).format('HH:mm')}
								</span>
							</div>
							<div className='flex items-center'>
								<ArrowRight size={20} />
							</div>
							<div className='flex flex-col flex-wrap space-y-1'>
								<span className='font-medium'>Packfleet</span>
								<span>{shipment.delivery.location}</span>
								{shipment.delivery?.window ? <span className='text-sm'>{moment.unix(shipment.delivery?.window?.start).format('HH:mm') + ' - ' + moment.unix(shipment.delivery?.window?.end).format('HH:mm')}</span> : null}
							</div>
						</section>
						<section className='flex items-center justify-between'>
							<div className='flex items-center'>
								<div className='flex items-center space-x-3'>
									<img src='/static/images/flatbed-trailer.svg' alt='' width={50} height={40} />
									<span className='font-medium'>{shipment.carrierInfo.vehicleType}</span>
								</div>
								<div>
									<span className='lowercase'>
										{shipment.packageInfo.weight} kg of {shipment.packageInfo.packageType}s
									</span>
								</div>
							</div>
							<div className='flex items-center space-x-3'>
								<span className='text-2xl font-semibold'>{`£${shipment.rate}`}</span>
								<ActionIcon color='dark' size='md'>
									<Message size={19} />
								</ActionIcon>
								<button className='voyage-button h-10 md:w-32'>Book</button>
							</div>
						</section>
					</main>
				))}
			</SimpleGrid>
		</ContentContainer>
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
	if (session.id) {
		const shipments = await fetchShipments(token?.shipperId, prisma);
		store.dispatch(setShipments(shipments));
	}
	return {
		props: {}
	};
});

export default marketplace;
