import React, { useCallback } from 'react';
import { Tabs } from '@mantine/core';
import { ActivationStatus, TabInfo } from '../utils/types';

interface TabBarProps {
	tabLabels: TabInfo[]
	activeTab: ActivationStatus,
	setActiveTab: (activeTab: ActivationStatus) => void;
	currentStatus: ActivationStatus,
	children: JSX.Element
}

const TabBar = ({ tabLabels, activeTab, setActiveTab, currentStatus, children }: TabBarProps) => {

	const handleTabChange = useCallback(
		tab => {
			if (currentStatus !== ActivationStatus.COMPLETE) {
				const currTabDetails = tabLabels.find(({ value }) => currentStatus === value)
				const tabDetails = tabLabels.find(({ value }) => tab === value)
				if (tabDetails && tabDetails.order <= currTabDetails.order ) {
					setActiveTab(tab);
				} else {
					setActiveTab(currentStatus)
				}
			} else {
				setActiveTab(tab);
			}
		},
		[currentStatus]
	);

	return (
		<Tabs value={activeTab} onTabChange={(value) => handleTabChange(value)}>
			<Tabs.List grow>
				{tabLabels.map((tab, index) => (
					<Tabs.Tab key={index} value={tab.value}>{tab.label}</Tabs.Tab>
				))}
			</Tabs.List>
			{children}
		</Tabs>
	);
};

TabBar.propTypes = {};

export default TabBar;
