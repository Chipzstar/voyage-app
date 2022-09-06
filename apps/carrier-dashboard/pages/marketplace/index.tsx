import React, { useCallback, useMemo, useState } from 'react';
import prisma from '../../db';
import Link from 'next/link';
import moment from 'moment/moment';
import { ActionIcon, Anchor, Badge, Button, LoadingOverlay, Select, SimpleGrid, Text } from '@mantine/core';
import { PUBLIC_PATHS } from '../../utils/constants';
import { SelectInputData, Shipment, SHIPMENT_ACTIVITY, STATUS } from '@voyage-app/shared-types';
import { ArrowRight, Calendar, Check, Clock, Message, X } from 'tabler-icons-react';
import { capitalize, fetchShipments, notifyError, notifySuccess, sanitize, uniqueArray } from '@voyage-app/shared-utils';
import { DateRangePicker } from '@mantine/dates';
import ContentContainer from '../../layout/ContentContainer';
import PageNav from '../../layout/PageNav';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, wrapper } from '../../store';
import { setShipments, updateShipment, useShipments } from '../../store/feature/shipmentSlice';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { CustomLoader } from '@voyage-app/shared-ui-components';
import Pluralize from 'react-pluralize';
import AssignDriverModal from '../../modals/AssignDriverModal';
import { setDrivers, useDrivers } from '../../store/feature/driverSlice';
import { setMembers, useMembers } from '../../store/feature/memberSlice';
import { fetchDrivers, fetchMembers } from '../../utils/functions';
import ReviewModal from '../../modals/ReviewModal';
import { createLoad } from '../../store/feature/loadSlice';
import axios from 'axios';

const items = [
	{ title: 'Home', href: '/' },
	{ title: 'Marketplace', href: '/marketplace' }
].map((item, index) => (
	<Anchor component={Link} href={item.href} key={index}>
		<span className='hover:text-secondary hover:underline'>{item.title}</span>
	</Anchor>
));

const marketplace = ({ session }) => {
	const [loading, setLoading] = useState(false);
	const shipments = useSelector(state => state['shipments'].filter((shipment: Shipment) => shipment.status === STATUS.NEW));
	const drivers = useSelector(useDrivers);
	const members = useSelector(useMembers);
	const dispatch = useDispatch<AppDispatch>();
	const [reviewModal, showReviewModal] = useState(false);
	const [assignmentModal, showAssignmentModal] = useState(false);
	const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
	const [selectedShipment, setSelectedShipment] = useState(null);

	const uniquePickupLocations = useMemo(() => {
		const labels: SelectInputData[] = shipments.map((item: Shipment, index) => ({
			value: item.pickup.facilityId,
			label: item.pickup.facilityName
		}));
		return uniqueArray(labels, 'value');
	}, []);

	const uniqueDeliveryLocations = useMemo(() => {
		const labels: SelectInputData[] = shipments.map((item: Shipment, index) => ({
			value: item.delivery.facilityId,
			label: item.delivery.facilityName
		}));
		return uniqueArray(labels, 'value');
	}, []);

	const handleSubmit = useCallback(
		async values => {
			try {
				showAssignmentModal(false);
				setLoading(true);
				console.log(selectedShipment);
				const newLoad = (await axios.post(`/api/shipment/convert/${selectedShipment?.id}`, values)).data;
				await dispatch(createLoad(newLoad)).unwrap();
				notifySuccess('convert-shipment-to-load-success', 'You have successfully booked this load', <Check size={20} />);
				setLoading(false);
				dispatch(
					updateShipment({
						id: selectedShipment.id,
						status: STATUS.PENDING
					})
				)
					.unwrap()
					.then(() => console.log('shipment updated'))
					.catch(err => console.error(err));
			} catch (err) {
				console.error(err);
				notifyError('convert-shipment-to-load-failure', `${err.message}`, <X size={20} />);
				setLoading(false);
			}
		},
		[selectedShipment]
	);

	return (
		<ContentContainer>
			<LoadingOverlay loader={<CustomLoader text='Creating Load...' />} visible={loading} overlayBlur={2} />
			<PageNav items={items} />
			<ReviewModal
				opened={reviewModal}
				onClose={() => showReviewModal(false)}
				onSubmit={() => {
					showReviewModal(false);
					showAssignmentModal(true);
				}}
				loadInfo={selectedShipment}
			/>
			<AssignDriverModal opened={assignmentModal} onClose={() => showAssignmentModal(false)} team={members} drivers={drivers} onSubmit={handleSubmit} />
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
					data={Object.values(SHIPMENT_ACTIVITY).map(
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
				<header className='page-subheading'>
					<Pluralize singular={'Load'} count={shipments.length ?? 1} /> available for you
				</header>
				<p className='font-medium text-gray-500'>{moment().format('dddd, MMM D')}</p>
			</div>
			<SimpleGrid cols={1}>
				{shipments
					.map((shipment: Shipment, index) => (
						<main key={index} className='border-voyage-grey space-y-3 border p-3'>
							<section className='flex space-x-8'>
								<div className='flex flex-col flex-wrap space-y-1'>
									<span className='font-medium'>{shipment.pickup.facilityName}</span>
									<span>{shipment.pickup.location}</span>
									<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center'>
										<Text>
											{moment.unix(shipment.pickup.window.start).format('DD MMM')} {moment.unix(shipment.pickup.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.pickup.window.end).format('HH:mm')}
										</Text>
									</Badge>
								</div>
								<div className='flex items-center'>
									<ArrowRight size={20} />
								</div>
								<div className='flex flex-col flex-wrap space-y-1'>
									<span className='font-medium'>{shipment.delivery.facilityName}</span>
									<span>{shipment.delivery.location}</span>
									{shipment.delivery?.window ? (
										<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center'>
											<Text>{moment.unix(shipment.delivery?.window?.start).format('HH:mm') + ' - ' + moment.unix(shipment.delivery?.window?.end).format('HH:mm')}</Text>
										</Badge>
									) : null}
								</div>
								<div className='flex flex-col flex-wrap space-y-1'>
									<span className='font-medium'>Equipment Required</span>
									<SimpleGrid spacing='xs' cols={2}>
										{shipment.activitiesRequired.map((item, index) => (
											<Badge key={index} size='sm' variant='outline' color='gray'>
												<Text>{capitalize(sanitize(item))}</Text>
											</Badge>
										))}
									</SimpleGrid>
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
									<span className='text-2xl font-semibold'>{`£${shipment.rate.toFixed(2)}`}</span>
									<ActionIcon color='dark' size='md'>
										<Message size={19} />
									</ActionIcon>
									<button
										className='voyage-button h-10 md:w-32'
										onClick={() => {
											setSelectedShipment(shipment);
											showReviewModal(true);
										}}
									>
										Book
									</button>
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
		const shipments = await fetchShipments(undefined, prisma);
		const drivers = await fetchDrivers(token?.carrierId, prisma);
		const members = await fetchMembers(token?.carrierId, prisma);
		store.dispatch(setShipments(shipments));
		store.dispatch(setDrivers(drivers));
		store.dispatch(setMembers(members));
	}
	return {
		props: {
			session
		}
	};
});

export default marketplace;
