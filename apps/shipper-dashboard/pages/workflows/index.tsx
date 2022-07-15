import React, { useContext, useEffect, useState } from 'react';
import { Tabs } from '@mantine/core';
import CarrierPreferences from '../../containers/CarrierPreferences';
import Locations from '../../containers/Locations';
import { TabContext } from '../../context';
import { useRouter } from 'next/router';
import { PATHS } from '../../utils/constants';

const index = () => {
	const router = useRouter();
	const { index, dispatch } = useContext(TabContext)

	return (
		<div className='p-4 h-screen'>
			<div className='px-4 h-full'>
				<Tabs active={index} onTabChange={(value) => {
					router.push(PATHS.WORKFLOWS, `#${value}`, {shallow: true})
					dispatch({type: 'setIndex', index: value})
				}} grow>
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
