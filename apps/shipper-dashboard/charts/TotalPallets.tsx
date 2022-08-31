import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { PACKAGE_TYPE, UnixTimestamp } from '../utils/types';
import moment from 'moment';
import { filterByTimeRange } from '../utils/functions';
import { Shipment } from '@voyage-app/shared-types';

const TotalPallets = ({ range, genLabels }) => {
	const shipments = useSelector(state => state['shipments']);
	const filter = useCallback(filterByTimeRange, [range, shipments]);

	const generateDataPoints = useCallback((timestamps) => {
		const filteredShipments = filter(shipments, range);
		return timestamps.map((timestamp: UnixTimestamp) => {
			const startOfDay = moment.unix(timestamp).unix()
			const endOfDay = moment.unix(timestamp).endOf('day').unix()
			// filter by time interval and package type == PALLET
			let palletShipments = filteredShipments.filter(({ createdAt, packageInfo: { packageType } }: Shipment) => packageType === PACKAGE_TYPE.PALLET && moment(createdAt).isAfter(startOfDay) && moment(createdAt).isBefore(endOfDay));
			// calculate total number pallets for the data point
			return palletShipments.reduce((prev, curr: Shipment) => prev + curr.packageInfo.quantity, 0)
		})
	}, [shipments, range]);

	const { data, total } = useMemo(() => {
		const { values, labels } = genLabels(range);
		const dataPoints = generateDataPoints(values)
		const total = dataPoints.reduce((prev, curr) => prev + curr)
		const datasets = [
			{
				label: `# of Pallets ${total}`,
				data: dataPoints,
				hoverBackgroundColor: ['rgba(54, 70, 245, 0.9)'],
				hoverBorderColor: ['rgba(54, 70, 245, 0.9)'],
				borderColor: ['rgba(54, 70, 245, 1)'],
				backgroundColor: ['rgba(54, 70, 245, 1)'],
				borderWidth: 1
			}
		];
		const data = {
			labels,
			datasets
		}
		return { data, total }
	}, [range]);

	return (
		<div className='h-32 flex'>
			<Bar
				data={data}
				options={{
					maintainAspectRatio: false,
					plugins: {
						legend: {
							labels: {
								color: 'black',
								boxWidth: 5,
								usePointStyle: true,
								pointStyle: 'circle'
							},
							position: 'top',
							title: {
								text: `${total}`
							}
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
