import React from 'react';
import { Button, Divider, Group, Modal } from '@mantine/core';
import { Shipment } from '@voyage-app/shared-types';
import moment from 'moment';
import { capitalize, sanitize } from '@voyage-app/shared-utils';

interface ReviewModalProps {
	opened: boolean;
	onClose: () => void;
	loadInfo: Shipment;
	onSubmit: (values) => void;
}

const ReviewModal = ({ opened, onClose, loadInfo, onSubmit }: ReviewModalProps) => {
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			centered
			size='xl'
			title='Job details'
			classNames={{
				title: 'font-semibold text-xl'
			}}
		>
			<div className='overflow-hidden bg-white shadow sm:rounded-lg'>
				<div className='border-t border-gray-200'>
					<dl>
						<div className='flex bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500 '>Shipper</dt>
							<div className='flex flex-col space-y-1 sm:col-span-2'>
								<dd className='mt-1 text-sm text-gray-900  sm:mt-0'>{loadInfo?.shipperInfo.name}</dd>
								<dd className='mt-1 text-sm text-gray-900  sm:mt-0'>{loadInfo?.shipperInfo.email}</dd>
								<dd className='mt-1 text-sm text-gray-900  sm:mt-0'>{loadInfo?.shipperInfo.company}</dd>
							</div>
						</div>
						<div className='bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Origin</dt>
							<div className='flex flex-col space-y-1 sm:col-span-2'>
								<dd className='mt-1 text-sm text-gray-900 sm:mt-0'>{loadInfo?.pickup.fullAddress}</dd>
							</div>
						</div>
						<div className='bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Destination</dt>
							<div className='flex flex-col space-y-1 sm:col-span-2'>
								<dd className='mt-1 text-sm text-gray-900 sm:mt-0'>{loadInfo?.delivery.fullAddress}</dd>
							</div>
						</div>
						<div className='bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Pickup Window</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
								{moment.unix(loadInfo?.pickup.window.start).format('DD MMM')} {moment.unix(loadInfo?.pickup.window.start).format('HH:mm')} - {moment.unix(loadInfo?.pickup.window.end).format('HH:mm')}
							</dd>
						</div>
						<div className='bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Schedule</dt>
							<dd className='mt-1 text-sm capitalize text-gray-900 sm:col-span-2 sm:mt-0'>{sanitize(loadInfo?.schedulingType ?? '')}</dd>
						</div>
						<div className='bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Equipment Required</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>{loadInfo?.activitiesRequired.map(item => capitalize(sanitize(item))).join(",")}</dd>
						</div>
						<div className='bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Rate</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>£{loadInfo?.rate.toFixed(2)}</dd>
						</div>
						<div className='bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Package Info</dt>
							<div className='flex flex-col space-y-1 sm:col-span-2'>
								<dd className='mt-1 text-sm text-gray-900 sm:mt-0'>Weight: {loadInfo?.packageInfo.weight} kg</dd>
								<dd className='mt-1 w-full text-sm  text-gray-900 sm:mt-0'>
									Dimensions: {loadInfo?.packageInfo.dimensions.length} x {loadInfo?.packageInfo.dimensions.width} x {loadInfo?.packageInfo.dimensions.height} cm
								</dd>
								<dd className='mt-1 text-sm text-gray-900  sm:mt-0'>Package Type: {loadInfo?.packageInfo.packageType}</dd>
								<dd className='mt-1 text-sm text-gray-900  sm:mt-0'>Quantity: {loadInfo?.packageInfo.quantity}</dd>
							</div>
						</div>
					</dl>
				</div>
			</div>
			<Divider my='lg' />
			<Group position='right'>
				<Button variant='subtle' type='button' color='gray' onClick={onClose}>
					<span>Cancel</span>
				</Button>
				<Button
					type='button'
					onClick={onSubmit}
					classNames={{
						root: `bg-secondary hover:bg-secondary-600`
					}}
				>
					<span>Continue</span>
				</Button>
			</Group>
		</Modal>
	);
};

export default ReviewModal;
