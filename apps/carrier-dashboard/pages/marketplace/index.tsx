import React from 'react';
import { ActionIcon, Anchor, Breadcrumbs } from '@mantine/core'
import Link from 'next/link';
import moment from 'moment/moment';
import { SimpleGrid } from '@mantine/core';
import { SAMPLE_LOADS } from '../../utils/constants';
import { Shipment } from '@voyage-app/shared-types';
import { ArrowRight, Message } from 'tabler-icons-react';

const marketplace = () => {
	const items = [
		{ title: 'Home', href: '/' },
		{ title: 'Marketplace', href: '/marketplace' }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));

	return (
		<div className='pb-4 px-8'>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white z-50' role='button'>
				<Breadcrumbs>{items}</Breadcrumbs>
			</section>
			<div className='space-y-3 mb-5'>
				<header className='page-subheading'>{SAMPLE_LOADS.length} Loads available for you</header>
				<p className="font-medium text-gray-500">{moment().format('dddd, MMM D')}</p>
			</div>
			<SimpleGrid cols={1}>
				{SAMPLE_LOADS.map((shipment: Shipment, index) => (
					<main key={index} className='border border-voyage-grey p-3 space-y-3'>
						<section className='flex space-x-8'>
							<div className='flex flex-col space-y-1'>
								<span className='font-medium'>{shipment.pickup.facilityName}</span>
								<span>{shipment.pickup.location}</span>
								<span className='text-sm'>{moment.unix(shipment.pickup.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.pickup.window.end).format('HH:mm')}</span>
							</div>
							<div className='flex items-center'>
								<ArrowRight size={20} />
							</div>
							<div className='flex flex-col space-y-1'>
								<span className='font-medium'>{shipment.delivery.facilityName}</span>
								<span>{shipment.delivery.location}</span>
								<span className='text-sm'>{moment.unix(shipment.delivery.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.delivery.window.end).format('HH:mm')}</span>
							</div>
						</section>
						<section className='flex justify-between items-center'>
							<div className='flex items-center'>
								<div className='flex items-center space-x-3'>
									<img src='/static/images/flatbed-trailer.svg' alt='' width={50} height={40} />
									<span className='font-medium'>{shipment.carrier.vehicle}</span>
								</div>
								<div>
									<span className='lowercase'>
										{shipment.package.weight} kg of {shipment.package.packageType}
									</span>
								</div>
							</div>
							<div className='flex items-center space-x-3'>
								<span className='font-semibold text-2xl'>{`£${shipment.rate}`}</span>
								<ActionIcon
									size='md'
									variant='filled'
									radius='xl'
									classNames={{
										root: 'bg-gray-400'
									}}
								>
									<Message size={20} />
								</ActionIcon>
							</div>
						</section>
					</main>
				))}
			</SimpleGrid>

			<div className='border'></div>
		</div>
	);
};

export default marketplace;
