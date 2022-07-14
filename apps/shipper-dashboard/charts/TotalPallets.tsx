import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { PACKAGE_TYPE, Shipment } from '../utils/types';

const TotalPallets = ({ interval }) => {
	const shipments = useSelector(state => state['shipments']);

	const numPallets = useMemo(() => {
		return shipments
			.filter((shipment: Shipment) => shipment.package.packageType === PACKAGE_TYPE.PALLET)
			.reduce((prev, curr: Shipment) => prev + curr.package.quantity, 0)
	}, [shipments, interval]);

	const data = useMemo(() => {
		const labels = ['Number of Pallets'];
		const datasets = [
			{
				label: '# of Pallets',
				data: [numPallets],
				hoverBackgroundColor: ['rgba(54, 70, 245, 0.9)'],
				hoverBorderColor: ['rgba(54, 70, 245, 0.9)'],
				borderColor: ['rgba(54, 70, 245, 1)'],
				backgroundColor: ['rgba(54, 70, 245, 1)'],
				borderWidth: 1
			}
		];
		return {
			labels,
			datasets
		};
	},  [interval])

	return (
		<div className='h-32 flex'>
			<Doughnut
				data={data}
				options={{
					maintainAspectRatio: false,
					plugins: {
						legend: {
							 display: false
						}
					}
				}}
			/>
		</div>
	);
};

TotalPallets.propTypes = {

};

export default TotalPallets;
