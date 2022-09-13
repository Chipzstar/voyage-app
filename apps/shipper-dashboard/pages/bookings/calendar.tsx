import React, { useMemo } from 'react';
import { ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import CustomWeekView from '../../containers/CustomWeekView';
import { useSelector } from 'react-redux';
import { Shipment, STATUS_COLOUR } from '@voyage-app/shared-types';
import { PATHS } from '../../utils/constants';

const localizer = momentLocalizer(moment);

const calendar = () => {
	const router = useRouter();
	const shipments = useSelector(state => state['shipments']);

	const {views, ...otherProps} = useMemo(() => ({
		views: {
			week: CustomWeekView,
		},
		// ... other props
	}), [])

	const handleEventSelection = e => router.push(`${PATHS.SHIPMENTS}/${e.id}`);
	const handleEventPropGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: event.bgColor,
			opacity: 0.8,
			color: 'black',
			display: 'block'
		};
		return {
			style
		};
	}

	return (
		<div className='pb-4 px-8 min-h-screen'>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white z-50' role='button' onClick={() => router.back()}>
				<ChevronLeft size={48} strokeWidth={2} color={'black'} />
				<span className='page-header'>Bookings</span>
			</section>
			<Calendar
				components={{
					eventWrapper: ({ children }) => {
						const newChildren = { ...children };
						const newChildrenProps = { ...newChildren.props };
						newChildrenProps.className = `${newChildrenProps.className} flex flex-col px-1 rounded-lg shadow-md p-1 border border-1 text-sm z-50`;
						newChildren.props = { ...newChildrenProps };
						return (
							<div>{newChildren}</div>
							/*<div
								role='button'
								style={{
									backgroundColor: value.event.bgColor
								}}
								className='flex flex-col px-1 rounded-lg shadow-md p-1 border border-1'
								onClick={() => router.push(`${PATHS.TRIPS}/${value.event.id}`)}
							>
								<span className='text-xs font-semibold text-secondary'>{value.event.id}</span>
								<span className='text-sm'>{value.event.title}</span>
							</div>*/
						);
					}
				}}
				onSelectEvent={handleEventSelection}
				eventPropGetter={handleEventPropGetter}
				views={views}
				selectable
				defaultView={Views.WEEK}
				localizer={localizer}
				events={shipments.map((shipment: Shipment) => ({
					id: shipment.shipmentId,
					title: `${shipment.pickup.facilityName} → ${shipment.delivery.facilityName}`,
					bgColor: STATUS_COLOUR[shipment.status],
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
