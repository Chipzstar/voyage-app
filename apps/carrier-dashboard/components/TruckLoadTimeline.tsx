import { Calendar, Views } from 'react-big-calendar'
import moment from 'moment-timezone'
import React, { useMemo } from 'react'
import CustomWeekView from '../containers/CustomWeekView'
import { localizer, PATHS } from '../utils/constants'
import { useRouter } from 'next/router'
import { Load } from '../utils/types'
import { STATUS_COLOUR } from '@voyage-app/shared-types';

/*const WeekEvent = (value) => {
	console.log(value)
	return (
		<div className='flex flex-col px-1 rounded-lg shadow-md p-1'>
			<div className='text-xs font-semibold text-secondary'>{value.event.id}</div>
			<div className='text-sm'>{value.title}</div>
		</div>
	);
};*/

const TruckLoadTimeline = ({ loads }) => {
	const router = useRouter();
	const { views, ...otherProps } = useMemo(
		() => ({
			views: {
				week: CustomWeekView
			}
			// ... other props
		}),
		[]
	);

	const handleEventSelection = e => router.push(`${PATHS.TRIPS}/${e.id}`);
	const handleEventPropGetter = (event, start, end, isSelected) => {
		console.log(event.start);
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
		<div className='py-3'>
			<Calendar
				components={{
					eventWrapper: ({ event, children }) => {
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
				localizer={localizer}
				events={loads.map((load: Load) => ({
					id: load.loadId,
					title: `${load.loadId}\n${load.pickup.postcode} → ${load.delivery.postcode}`,
					bgColor: STATUS_COLOUR[load.status],
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