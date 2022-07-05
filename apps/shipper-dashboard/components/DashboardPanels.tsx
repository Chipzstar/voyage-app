import React from 'react';
import PropTypes from 'prop-types';

const DashboardPanels = ({ date }) => {
	return (
		<div className='mx-auto'>
			<div className='grid grid-cols-1 md:gird-cols-2 lg:grid-cols-3 gap-6'>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Shipment Overview</h2>
						</header>
						<div className="h-32 flex items-end">
							<img src='/static/images/shipment-overview.svg' alt='' />
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Active Quotes</h2>
						</header>
						<div className="h-32 flex items-end">
							<img src='/static/images/active-quotes.svg' alt='' />
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey space-y-3'>
					<header>
						<h2 className='text-2xl font-semibold'>Total Number of Bookings</h2>
					</header>
					<div className="h-32 flex items-end">
						<img src='/static/images/number-of-bookings.svg' alt='' />
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Optimization Overview</h2>
						</header>
						<div className="h-32 flex items-end">
							<img src='/static/images/optimization-overview.svg' alt='' />
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Sustainability</h2>
						</header>
						<div className="h-32 flex items-end">
							<img src='/static/images/sustainability.svg' alt='' />
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Notifications</h2>
						</header>
						<div className="h-32 flex items-center">
							<img src='/static/images/notifications.svg' alt='' />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

DashboardPanels.propTypes = {};

export default DashboardPanels;
