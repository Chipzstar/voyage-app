import React from 'react';
import { ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { SAMPLE_EVENTS } from 'apps/shipper-dashboard/utils';

const localizer = momentLocalizer(moment);

const calendar = () => {
	const router = useRouter();
	return (
		<div className='pb-4 px-8 min-h-screen'>
			<section className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white' role='button' onClick={() => router.back()}>
				<ChevronLeft size={48} strokeWidth={2} color={'black'} />
				<span className='page-header'>Bookings</span>
			</section>
			<Calendar localizer={localizer} events={SAMPLE_EVENTS} startAccessor='startDate' endAccessor='endDate'  />
		</div>
	);
};

export default calendar;
