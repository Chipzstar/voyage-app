import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import React, { useMemo } from 'react'
import CustomWeekView from '../containers/CustomWeekView'
import {  PATHS } from '../utils/constants'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { useLoads } from '../store/feature/loadSlice'
import { Load } from '../utils/types'

const localizer = momentLocalizer(moment)

const TruckLoadTimeline = props => {
	const router = useRouter();
	const loads = useSelector(useLoads)
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
					eventWrapper: value => (
						<div
							role='button'
							style={{
								backgroundColor: value.event.bgColor
							}}
							className='flex flex-col px-1 rounded-lg shadow-md p-1 border border-1'
							onClick={() => router.push(`${PATHS.TRIPS}/${value.event.id}`)}
						>
							<span className='text-xs font-semibold text-secondary'>{value.event.id}</span>
							<span className='text-sm'>{value.event.title}</span>
						</div>
					)
				}}
				localizer={localizer}
				events={loads.map((load: Load) => ({
					id: load.loadId,
					title: `${moment.unix(load.pickup.window.start).format('HH:mm')} - ${moment.unix(load.pickup.window.end).format('HH:mm')}\n${load.pickup.postcode} → ${load.delivery.postcode}`,
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