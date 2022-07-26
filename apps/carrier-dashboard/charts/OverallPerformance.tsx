import React from 'react';
import PropTypes from 'prop-types';
import { Radar } from 'react-chartjs-2';

export const data = {
	labels: ['On Time Trips', 'Loads Accepted', 'Final Quotations', 'Average Driver Ratings', 'Fleet Utilization'],
	datasets: [
		{
			label: 'Overall Performance',
			data: [92.3, 73, 89, 80, 64],
			backgroundColor: 'rgba(255, 99, 132, 0.2)',
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 0,
		},
	],
};

const OverallPerformance = props => {
	return (
		<Radar data={data} options={{
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'left'
				}
			}
		}}/>
	);
};

OverallPerformance.propTypes = {

};

export default OverallPerformance;
