import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import React, { useMemo } from 'react'
import CustomWeekView from '../containers/CustomWeekView'
import { Shipment } from '@voyage-app/shared-types';
import { SAMPLE_LOADS, PATHS } from '../utils/constants'
import { useRouter } from 'next/router'

const localizer = momentLocalizer(moment)

const TruckLoadTimeline = props => {
	const router = useRouter();
	const {views, ...otherProps} = useMemo(() => ({
		views: {
			week: CustomWeekView,
		},
		// ... other props
	}), [])
	return (
		<div className='py-3'>
			<Calendar
				components={{
					eventWrapper: value => {
						console.log(value.event)
						return (
							<div role='button' style={{
								backgroundColor: value.event.bgColor,
							}} className='flex flex-col px-1' onClick={() => router.push(`${PATHS.TRIPS}/${value.event.id}`)}>
								<span className='text-xs font-semibold text-secondary'>{value.event.id}</span>
								<span className='text-sm'>{value.event.title}</span>
							</div>
						);
					}
				}}
				localizer={localizer}
				events={SAMPLE_LOADS.map((load: Shipment) => ({
					id: load.shipmentId,
					title: `${load.pickup.facilityName} → ${load.delivery.facilityName}`,
					bgColor: '#ff7f50',
					allDay: false,
					start: moment.unix(load.pickup.window.start).toDate(),
					end: moment.unix(load.pickup.window.end).toDate()
				}))}
				startAccessor='start'
				endAccessor='end'
				views={views}
				selectable
				defaultView={Views.WEEK}
				style={{ height: 500 }}
			/>
		</div>
	);
};

export default TruckLoadTimeline;