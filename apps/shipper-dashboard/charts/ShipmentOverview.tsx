import React, { useCallback, useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { STATUS } from '../utils/types';

const ShipmentOverview = ({ interval }) => {
	const shipments = useSelector(state => state['shipments']);

	const getOverviewDetails = useCallback(() => {
		const numCompleted = shipments.filter(({ status }) => status === STATUS.COMPLETED).length;
		const numPending = shipments.filter(({ status }) => [STATUS.NEW, STATUS.PENDING].includes(status)).length;
		return [numCompleted, numPending];
	}, [interval, shipments]);

	const data = useMemo(() => {
		const labels = ['Completed', 'Pending'];
		const datasets = [
			{
				label: '# of Votes',
				data: getOverviewDetails(),
				hoverBackgroundColor: ['rgba(101, 188, 85, 1)', 'rgba(255, 105, 57, 1)'],
				hoverBorderColor: ['rgba(101, 188, 85, 1)', 'rgba(255, 105, 57, 1)'],
				borderColor: ['#43CB2B', '#FF6939'],
				backgroundColor: ['#43CB2B', '#FF6939'],
				borderWidth: 1
			}
		];
		return {
			labels,
			datasets
		};
	}, [interval]);

	return (
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
	);
};

ShipmentOverview.propTypes = {

};

export default ShipmentOverview;
