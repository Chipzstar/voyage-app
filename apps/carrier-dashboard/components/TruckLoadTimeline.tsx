import { Calendar, momentLocalizer, Views } from 'react-big-calendar'
import moment from 'moment'
import { useMemo } from 'react'
import CustomWeekView from '../containers/CustomWeekView'
import { Shipment } from '../../shipper-dashboard/utils/types'
import { SAMPLE_LOADS } from '../utils/constants'

const localizer = momentLocalizer(moment)

const TruckLoadTimeline = props => {
	const {views, ...otherProps} = useMemo(() => ({
		views: {
			week: CustomWeekView,
		},
		// ... other props
	}), [])
	return (
		<div className="py-3">
			<Calendar
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
				style={{ height: 500 }} />
		</div>
	);
};

export default TruckLoadTimeline;