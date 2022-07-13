import React, { useMemo } from 'react';
import { ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { SAMPLE_EVENTS } from 'apps/shipper-dashboard/utils/constants';
import CustomWeekView from '../../containers/CustomWeekView';

const localizer = momentLocalizer(moment);

const calendar = () => {
	const router = useRouter();

	const {views, ...otherProps} = useMemo(() => ({
		views: {
			week: CustomWeekView,
		},
		// ... other props
	}), [])

	return (
		<div className='pb-4 px-8 min-h-screen'>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white' role='button' onClick={() => router.back()}>
				<ChevronLeft size={48} strokeWidth={2} color={'black'} />
				<span className='page-header'>Bookings</span>
			</section>
			<Calendar views={views} defaultView={Views.WEEK} localizer={localizer} events={SAMPLE_EVENTS} startAccessor='startDate' endAccessor='endDate' showMultiDayTimes />
		</div>
	);
};

export default calendar;
