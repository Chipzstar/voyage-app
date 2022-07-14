import React from 'react';
import PropTypes from 'prop-types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ShipmentOverview from '../charts/ShipmentOverview';
import TotalPallets from '../charts/TotalPallets';

ChartJS.register(ArcElement, Legend, Tooltip);

const data = {
	labels: ['On Time Pickup (%)', 'On Time Dropoff (%)'],
	datasets: [
		{
			label: '# of Votes',
			data: [12, 19],
			backgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
			borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
			hoverBackgroundColor: ['rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)'],
			hoverBorderColor: ['rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)'],
			borderWidth: 1
		}
	]
};

const DashboardPanels = ({ date }) => {
	return (
		<div className='mx-auto'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='space-y-3'>
						<header className="ml-7">
							<h2 className='text-2xl font-semibold'>Shipment Overview</h2>
						</header>
						<ShipmentOverview interval={'month'} />
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='space-y-3'>
						<header className='ml-7'>
							<h2 className='text-2xl font-semibold'>On Time</h2>
						</header>
						<div className='h-32 flex'>
							<Doughnut
								data={data}
								options={{
									maintainAspectRatio: false,
									plugins: {
										legend: {
											position: 'right'
										}
									}
								}}
							/>
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 border border-voyage-grey'>
					<div className='space-y-3'>
						<header className="ml-7">
							<h2 className='text-2xl font-semibold'>Total Pallets</h2>
						</header>
						<TotalPallets interval={'month'}/>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey space-y-3'>
					<div className='space-y-3'>
						<header className="ml-7">
							<h2 className='text-2xl font-semibold'>Total Number of Bookings</h2>
						</header>
						<div className='h-32 flex items-end'>
							<img src='/static/images/number-of-bookings.svg' alt='' />
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Sustainability</h2>
						</header>
						<div className='h-32 flex items-end'>
							<img src='/static/images/sustainability.svg' alt='' />
						</div>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='ml-7 space-y-3'>
						<header>
							<h2 className='text-2xl font-semibold'>Notifications</h2>
						</header>
						<div className='h-32 flex items-center'>
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
