import React, { useCallback } from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip, BarElement, LinearScale, CategoryScale } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ShipmentOverview from '../charts/ShipmentOverview';
import TotalPallets from '../charts/TotalPallets';
import TotalNumberBookings from '../charts/TotalNumberBookings';
import moment from 'moment';
import { DateRange } from '../utils/types';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const data = {
	labels: ['On Time Pickup\t\t\t\t\t(16%)', 'On Time Dropoff\t\t\t\t(19%)'],
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

const DashboardPanels = ({ dateRange }) => {

	const generateLabels = useCallback((range: [Date, Date]) => {
		let startDate = moment(range[0])
		let numDays = moment(range[1]).diff(moment(range[0]), "days")
		const labels = new Array(numDays).fill(0).map((item, index) => startDate.clone().add(index, "d").format("Do MMM"))
		const values = new Array(numDays).fill(0).map((item, index) => startDate.clone().add(index, "d").unix())
		return { labels, values }
	}, []);

	return (
		<div className='mx-auto'>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey'>
					<div className='space-y-3'>
						<header className="ml-7">
							<h2 className='text-2xl font-semibold'>Shipment Overview</h2>
						</header>
						<ShipmentOverview interval={dateRange} />
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
									cutout: 50,
									maintainAspectRatio: false,
									plugins: {
										legend: {
											fullSize: true,
											align: 'start',
											labels: {
												color: 'black',
												boxWidth: 5,
												usePointStyle: true,
												pointStyle: 'circle'
											},
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
						<TotalPallets range={dateRange} genLabels={generateLabels}/>
					</div>
				</div>
				<div className='flex flex-col justify-center p-4 div border border-voyage-grey space-y-3'>
					<div className='space-y-3'>
						<header className="ml-7">
							<h2 className='text-2xl font-semibold'>Total Number of Bookings</h2>
						</header>
						<TotalNumberBookings range={dateRange} genLabels={generateLabels}/>
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
