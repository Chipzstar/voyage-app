import React, { useCallback, useMemo } from 'react';
import { ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import CustomWeekView from '../../containers/CustomWeekView';
import { useSelector } from 'react-redux';
import { Shipment } from '../../utils/types';
import { PATHS } from '../../utils/constants';

const localizer = momentLocalizer(moment);

const calendar = () => {
	const router = useRouter();
	const shipments = useSelector(state => state['shipments']);

	const handleSelectEvent = useCallback(
		(event) => {
			router.push(`${PATHS.SHIPMENTS}/${event.id}`)
		},
		[]
	);

	const {views, ...otherProps} = useMemo(() => ({
		views: {
			week: CustomWeekView,
		},
		// ... other props
	}), [])

	return (
		<div className='pb-4 px-8 min-h-screen'>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white z-50' role='button' onClick={() => router.back()}>
				<ChevronLeft size={48} strokeWidth={2} color={'black'} />
				<span className='page-header'>Bookings</span>
			</section>
			<Calendar
				components={{
					eventWrapper: (value) => (
						<div role="button" className="flex flex-col bg-secondary-100 rounded-lg px-1 border border-2 border-gray-400" onClick={() =>router.push(`${PATHS.SHIPMENTS}/${value.event.id}`)}>
							<span className="text-xs font-semibold text-secondary">{value.event.id}</span>
							<span className="text-sm">{value.event.title}</span>
						</div>
					)
				}}
				views={views}
				selectable
				defaultView={Views.WEEK}
				localizer={localizer}
				events={shipments.map((shipment: Shipment) => ({
					id: shipment.id,
					title: `${shipment.pickup.facilityName} → ${shipment.delivery.facilityName}`,
					bgColor: '#ff7f50',
					allDay: false,
					start: moment.unix(shipment.pickup.window.start).toDate(),
					end: moment.unix(shipment.pickup.window.end).toDate()
				}))}
				startAccessor='start'
				endAccessor='end'
				showMultiDayTimes
			/>
		</div>
	);
};

export default calendar;
