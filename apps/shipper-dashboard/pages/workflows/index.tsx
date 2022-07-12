import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';
import Locations from '../../containers/Locations';
import { TabContext } from '../../context';

const index = () => {
	const { index, dispatch } = useContext(TabContext)
	useEffect(() => {
		console.log("INDEX", index)
	}, [index])
	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<Tabs active={index} onTabChange={(value) => dispatch({type: 'setIndex', index: value})} grow>
					<Tabs.Tab label='Carrier Preferences' className='text-lg'>
						<CarrierPreferences />
					</Tabs.Tab>
					<Tabs.Tab label='Locations' className='text-lg'>
						<Locations />
					</Tabs.Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default index;
