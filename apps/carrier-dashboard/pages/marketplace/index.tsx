import React, { useCallback, useEffect, useMemo, useState } from 'react';
import prisma from '../../db';
import Link from 'next/link';
import moment from 'moment/moment';
import { PATHS, PUBLIC_PATHS } from '../../utils/constants';
import { SelectInputData, Shipment, SHIPMENT_ACTIVITY, STATUS } from '@voyage-app/shared-types';
import { capitalize, checkWithinTimeRange, fetchShipments, notifyError, notifySuccess, sanitize, uniqueArray } from '@voyage-app/shared-utils';
import { useWindowSize } from '@voyage-app/shared-ui-hooks';
import { ArrowRight, Calendar, Check, Clock, Message, X } from 'tabler-icons-react';
import { ActionIcon, Anchor, Badge, Button, Group, LoadingOverlay, MultiSelect, ScrollArea, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import ContentContainer from '../../layout/ContentContainer';
import PageNav from '../../layout/PageNav';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, wrapper } from '../../store';
import { getMarketplaceShipments, setShipments, updateShipment, useNewShipments } from '../../store/feature/shipmentSlice';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
import { CustomLoader } from '@voyage-app/shared-ui-components';
import Pluralize from 'react-pluralize';
import AssignDriverModal from '../../modals/AssignDriverModal';
import { setDrivers, useDrivers } from '../../store/feature/driverSlice';
import { setMembers, useMembers } from '../../store/feature/memberSlice';
import { fetchDrivers, fetchMembers, fetchCarrier } from '../../utils/functions';
import ReviewModal from '../../modals/ReviewModal';
import { createLoad } from '../../store/feature/loadSlice';
import axios from 'axios';
import _ from 'lodash';
import { Load } from '../../utils/types';
import { setCarrier } from '../../store/feature/profileSlice';
import { useRouter } from 'next/router';
import { useListState } from '@mantine/hooks';

let subscriber;

const items = [
	{ title: 'Home', href: '/' },
	{ title: 'Marketplace', href: '/marketplace' }
].map((item, index) => (
	<Anchor component={Link} href={item.href} key={index}>
		<span className='hover:text-secondary hover:underline'>{item.title}</span>
	</Anchor>
));

interface FilterFormProps {
	pickup: string;
	delivery: string;
	miles: string;
	dateRange: [Date | null, Date | null];
	equipment: SHIPMENT_ACTIVITY[];
}

const marketplace = ({ session }) => {
	const router = useRouter();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const [reviewModal, showReviewModal] = useState(false);
	const [assignmentModal, showAssignmentModal] = useState(false);
	const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
	const drivers = useSelector(useDrivers);
	const members = useSelector(useMembers);
	const shipments = useSelector(useNewShipments);
	const [filtered, handlers] = useListState([...shipments]);
	const { height } = useWindowSize()

	function fetch(filters) {
		dispatch(getMarketplaceShipments())
			.unwrap()
			.then(shipments => {
				handlers.setState(shipments);
				handlers.filter((s: Shipment) => {
					let isValid = true;
					if (filters.pickup && s.pickup.facilityId !== filters.pickup) return false;
					if (filters.delivery && s.delivery.facilityId !== filters.delivery) return false;
					if (Number(filters.miles) && s.mileage > Number(filters.miles)) return false;
					if (filters.dateRange.every((date: Date | null) => date) && !checkWithinTimeRange(filters.dateRange, s.pickup.window.start, s.pickup.window.end)) return false;
					if (filters.equipment.length && !s.activitiesRequired.every(a => filters.equipment.includes(a))) return false;
					return isValid;
				});
			});
	}

	useEffect(() => {
		subscriber = setInterval(fetch, 5000, form.values);
		return () => clearInterval(subscriber);
	}, []);

	const uniquePickupLocations = useMemo(() => {
		const labels: SelectInputData[] = shipments.map((item: Shipment, index) => ({
			value: item.pickup.city,
			label: item.pickup.city
		}));
		return uniqueArray(labels, 'value');
	}, [shipments]);

	const uniqueDeliveryLocations = useMemo(() => {
		const labels: SelectInputData[] = shipments.map((item: Shipment, index) => ({
			value: item.delivery.city,
			label: item.delivery.city
		}));
		return uniqueArray(labels, 'value');
	}, [shipments]);

	const handleSubmit = useCallback(
		async values => {
			try {
				showAssignmentModal(false);
				setLoading(true);
				const newLoad: Partial<Load> = (await axios.post(`/api/shipment/convert/${selectedShipment?.id}`, values)).data;
				await dispatch(createLoad(newLoad)).unwrap();
				notifySuccess('convert-shipment-to-load-success', 'You have successfully booked this load', <Check size={20} />);
				setLoading(false);
				await dispatch(
					updateShipment({
						id: selectedShipment.id,
						status: STATUS.PENDING,
						carrierInfo: newLoad.carrierInfo,
						trackingHistory: [
							...selectedShipment.trackingHistory,
							{
								status: STATUS.PENDING,
								timestamp: moment().unix()
							}
						]
					})
				).unwrap();
				// TODO send email alerts to dev about new loads from marketplace
				handlers.filter(item => item.id !== selectedShipment.id);
				router.push(`${PATHS.TRIPS}/${newLoad.loadId}`).then(() => console.log('Marketplace load booked!'));
			} catch (err) {
				console.error(err);
				notifyError('convert-shipment-to-load-failure', `${err.message}`, <X size={20} />);
				setLoading(false);
			}
		},
		[selectedShipment, shipments]
	);

	const initialValues: FilterFormProps = {
		pickup: '',
		delivery: '',
		miles: String(Number.POSITIVE_INFINITY),
		dateRange: [null, null],
		equipment: []
	};

	const form = useForm<FilterFormProps>({
		initialValues
	});

	const filterShipments = useCallback(
		_.debounce((values: FilterFormProps) => {
			console.log(values);
			handlers.filter((s: Shipment) => {
				let isValid = true;
				if (values.pickup && s.pickup.facilityId !== values.pickup) return false;
				if (values.delivery && s.delivery.facilityId !== values.delivery) return false;
				if (Number(values.miles) && s.mileage > Number(values.miles)) return false;
				if (values.dateRange.every((date: Date | null) => date) && !checkWithinTimeRange(values.dateRange, s.pickup.window.start, s.pickup.window.end)) return false;
				if (values.equipment.length && !s.activitiesRequired.every(a => values.equipment.includes(a))) return false;
				console.log('isValid:', isValid);
				return isValid;
			});
			console.log('destroying filter');
			clearInterval(subscriber);
			console.log('creating new filter');
			subscriber = setInterval(fetch, 5000, values);
		}, 100),
		[filtered]
	);

	const resetForm = () => {
		form.reset();
		handlers.setState(shipments);
		clearInterval(subscriber);
		console.log('creating new filter');
		subscriber = setInterval(fetch, 5000, initialValues);
	};

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
			<form className='flex flex-row justify-between space-x-2 pb-3 w-full' onReset={form.onReset}>
				<div className='flex'>
					<Select size='sm' searchable placeholder='Pickup' data={uniquePickupLocations} {...form.getInputProps('pickup')} />
					<Select size='sm' searchable placeholder='Delivery' data={uniqueDeliveryLocations} {...form.getInputProps('delivery')} />
				</div>
				<Select
					placeholder='Any distance'
					size='sm'
					classNames={{
						root: 'w-32'
					}}
					data={[
						{ label: '10mi', value: '10' },
						{ label: '20mi', value: '20' },
						{ label: '50mi', value: '50' },
						{ label: '100mi', value: '100' },
						{ label: '200mi', value: '200' },
						{ label: '300mi', value: '300' }
					]}
					{...form.getInputProps('miles')}
				/>
				<DateRangePicker
					amountOfMonths={2}
					placeholder='Select dates'
					classNames={{
						root: 'w-56'
					}}
					icon={<Calendar size={16} />}
					{...form.getInputProps('dateRange')}
				/>
				<MultiSelect
					placeholder='All equipments'
					data={Object.values(SHIPMENT_ACTIVITY).map(
						(item): SelectInputData => ({
							value: item,
							label: capitalize(item.replace(/_/g, ' '))
						})
					)}
					clearButtonLabel='Clear selection'
					clearable
					classNames={{
						root: 'w-60'
					}}
					{...form.getInputProps('equipment')}
				/>
				<Group spacing='xs'>
					<Button variant='outline' color='gray' onClick={resetForm}>
						<Text size='sm'>Clear</Text>
					</Button>
					<Button variant='outline' onClick={() => filterShipments(form.values)}>
						<Text size='sm'>Apply</Text>
					</Button>
				</Group>
			</form>
			<div className='my-5 space-y-3'>
				<header className='page-subheading'>
					<Pluralize singular={'Load'} count={filtered.length ?? 0} /> available for you
				</header>
				<p className='font-medium text-gray-500'>{moment().format('dddd, MMM D')}</p>
			</div>
			<ScrollArea.Autosize maxHeight={height - 250}>
				<SimpleGrid cols={1}>
					{filtered.map((shipment: Shipment, index) => (
						<main key={index} className='border-voyage-grey space-y-3 border p-3'>
							<section className='flex space-x-8'>
								<div className='flex flex-col flex-wrap space-y-1'>
									<span className='font-medium'>{shipment.pickup.city}</span>
									<span>
										{shipment.pickup.line1} {shipment.pickup.postcode}
									</span>
									<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center lg:w-40'>
										<Text>
											{moment.unix(shipment.pickup.window.start).format('DD MMM')} {moment.unix(shipment.pickup.window.start).format('HH:mm') + ' - ' + moment.unix(shipment.pickup.window.end).format('HH:mm')}
										</Text>
									</Badge>
								</div>
								<div className='flex flex-col items-center justify-center'>
									<Text size='sm' color='gray' weight={600}>
										{shipment.mileage} mi
									</Text>
									<ArrowRight size={20} />
								</div>
								<div className='flex flex-col flex-wrap space-y-1'>
									<span className='font-medium'>{shipment.delivery.city}</span>
									<span>
										{shipment.delivery.line1} {shipment.delivery.postcode}
									</span>
									{shipment.delivery?.window ? (
										<Badge size='sm' radius='lg' color='blue' leftSection={<Clock size={12} />} className='flex items-center lg:w-40'>
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
							<section className='flex justify-between'>
								<div className='flex items-end space-x-3'>
									<div className='flex items-center space-x-3'>
										<img src='/static/images/flatbed-trailer.svg' alt='' width={50} height={40} />
									</div>
									<span className='lowercase'>
										{shipment.packageInfo.weight} kg of {shipment.packageInfo.packageType}s
									</span>
								</div>
								<div className='flex items-end space-x-3'>
									<span className='text-2xl font-semibold'>{`£${shipment.rate.toFixed(2)}`}</span>
									<ActionIcon color='dark' size='md'>
										<Message size={19} />
									</ActionIcon>
									<Stack spacing="xs" align="center">
										{moment(shipment?.expiresAt).isValid() && <Text size="sm" weight={600} color="red">Expires {moment.unix(shipment?.expiresAt).fromNow()}</Text>}
										<button
											className='voyage-button h-10 md:w-32'
											onClick={() => {
												setSelectedShipment(shipment);
												showReviewModal(true);
											}}
										>
											Book
										</button>
									</Stack>
								</div>
							</section>
						</main>
					))}
				</SimpleGrid>
			</ScrollArea.Autosize>
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
		const carrier = await fetchCarrier(session.id, token?.profileId, prisma);
		const shipments = await fetchShipments(undefined, prisma);
		const drivers = await fetchDrivers(token?.carrierId, prisma);
		const members = await fetchMembers(token?.carrierId, prisma);
		store.dispatch(setCarrier(carrier));
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
