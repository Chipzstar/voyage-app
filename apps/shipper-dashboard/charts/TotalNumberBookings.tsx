import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { filterByTimeRange } from '../utils/functions';
import { useSelector } from 'react-redux';
import { DateRange, Shipment } from '../utils/types';
import moment from 'moment';

type InputProps = {
	range: DateRange,
	genLabels: Function
}

const TotalNumberBookings = ({ range, genLabels }: InputProps) => {
	const shipments = useSelector(state => state['shipments']);

	const filter = useCallback(filterByTimeRange, [range, shipments]);

	const generateDataPoints = useCallback((timestamps) => {
		const filteredShipments = filter(shipments, range);
		return timestamps.map(timestamp => {
			const startOfDay = moment.unix(timestamp).unix()
			const endOfDay = moment.unix(timestamp).endOf('day').unix()
			return filteredShipments.filter(({ createdAt }: Shipment) => moment(createdAt).isAfter(startOfDay) && moment(createdAt).isBefore(endOfDay)).length
		})
	}, [shipments, range]);

	const data = useMemo(() => {
		let { values, labels } = genLabels(range);
		let dataPoints = generateDataPoints(values)
		const total = dataPoints.reduce((prev, curr) => prev + curr)
		let datasets = [
			{
				label: `# of Bookings ${total}`,
				data: dataPoints,
				borderColor: ['#43CB2B'],
				backgroundColor: ['#43CB2B']
			}
		];
		return {
			labels,
			datasets
		};
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
							position: 'right'
						}
					}
				}}
			/>
		</div>
	);
};

TotalNumberBookings.propTypes = {
	range: PropTypes.array
};

export default TotalNumberBookings;
