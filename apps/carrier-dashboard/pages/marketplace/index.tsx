import React, { useMemo, useState } from 'react';
import { ActionIcon, Anchor, Button, Select, SimpleGrid, Text } from '@mantine/core';
import Link from 'next/link';
import moment from 'moment/moment';
import { SAMPLE_LOADS } from '../../utils/constants';
import { EQUIPMENT_TYPES, SelectInputData} from '@voyage-app/shared-types';
import { ArrowRight, Calendar, Message } from 'tabler-icons-react';
import { capitalize, uniqueArray } from '@voyage-app/shared-utils';
import { DateRangePicker } from '@mantine/dates';
import ContentContainer from '../../layout/ContentContainer'
import PageNav from '../../layout/PageNav'
import { Load } from '../../utils/types'

const marketplace = () => {
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
			<PageNav items={items}/>
			<form className='flex flex-row pb-8 space-x-3'>
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
			<div className='space-y-3 mb-5'>
				<header className='page-subheading'>{SAMPLE_LOADS.length} Loads available for you</header>
				<p className='font-medium text-gray-500'>{moment().format('dddd, MMM D')}</p>
			</div>
			<SimpleGrid cols={1}>
				{SAMPLE_LOADS.map((shipment: Load, index) => (
					<main key={index} className='border border-voyage-grey p-3 space-y-3'>
						<section className='flex space-x-8'>
							<div className='flex flex-col space-y-1 flex-wrap'>
								<span className='font-medium'>John Lewis Warehouse</span>
								<span>{shipment.pickup.street} {shipment.pickup.city}</span>
								<span className='text-sm'>{moment.unix(shipment.pickup.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.pickup.window.end).format('HH:mm')}</span>
							</div>
							<div className='flex items-center'>
								<ArrowRight size={20} />
							</div>
							<div className='flex flex-col space-y-1 flex-wrap'>
								<span className='font-medium'>Packfleet</span>
								<span>{shipment.delivery.street} {shipment.delivery.postcode}</span>
								<span className='text-sm'>{moment.unix(shipment.delivery.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.delivery.window.end).format('HH:mm')}</span>
							</div>
						</section>
						<section className='flex justify-between items-center'>
							<div className='flex items-center'>
								<div className='flex items-center space-x-3'>
									<img src='/static/images/flatbed-trailer.svg' alt='' width={50} height={40} />
									<span className='font-medium'>{shipment.carrier.vehicleType}</span>
								</div>
								<div>
									<span className='lowercase'>
										{shipment.package.weight} kg of {shipment.package.packageType}s
									</span>
								</div>
							</div>
							<div className='flex items-center space-x-3'>
								<span className='font-semibold text-2xl'>{`£${shipment.rate}`}</span>
								<ActionIcon
									size='md'
									variant='filled'
									radius='lg'
									classNames={{
										root: 'bg-gray-400'
									}}
								>
									<Message size={20} />
								</ActionIcon>
								<button className='voyage-button md:w-32 h-10'>Book</button>
							</div>
						</section>
					</main>
				))}
			</SimpleGrid>
		</ContentContainer>
	);
};

export default marketplace;
