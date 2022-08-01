import React, { useEffect } from 'react';
import PropTypes from 'prop-types'
import { Pie } from '@nivo/pie'

const OverviewPieChart = ({ data, containerStyle="" }) => {

	const commonProps = {
		width: 300,
		height: 200,
		titleOffsetX: -80,
		margin: {
			top: 20,
         right: 0,
			bottom: 20,
         left: 0,
		},
		data,
		spacing: 80,
		animate: false,
		activeOuterRadiusOffset: 8
	};
	
	useEffect(() => {
		console.log(data)
	}, [data])


	return (
		<div className={containerStyle}>
			<Pie
				{...commonProps}
				innerRadius={0.75}
				enableArcLabels={false}
				arcLinkLabel={d => `${d.id} (${d.formattedValue})`}
				activeInnerRadiusOffset={commonProps.activeOuterRadiusOffset}
				layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends']}
				fill={[
					{
						match: {
							id: "ruby",
						},
						id: "dots",
					},
					{
						match: {
							id: "c",
						},
						id: "dots",
					},
				]}
				legends={[
					{
						anchor: "bottom",
						direction: "row",
						justify: false,
						translateX: 0,
						translateY: 56,
						itemsSpacing: 0,
						itemWidth: 100,
						itemHeight: 18,
						itemTextColor: "#999",
						itemDirection: "left-to-right",
						itemOpacity: 1,
						symbolSize: 18,
						symbolShape: "circle",
						effects: [
							{
								on: "hover",
								style: {
									itemTextColor: "#000",
								},
							},
						],
					},
				]}
			/>
		</div>
	);
};

OverviewPieChart.propTypes = {
	
}

export default OverviewPieChart
