import React, { useMemo } from 'react';
import { Card, createStyles, Group, RingProgress, Stack, Text } from '@mantine/core';
import { Driver, DRIVER_STATUS } from '../utils/types';

const useStyles = createStyles(theme => ({
	card: {
		backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
	},

	label: {
		fontSize: 22,
		fontWeight: 700,
		lineHeight: 1
	},

	lead: {
		fontWeight: 700,
		fontSize: 22,
		lineHeight: 1
	},

	inner: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		[theme.fn.smallerThan(350)]: {
			flexDirection: 'column'
		}
	},

	ring: {
		flex: 1,
		display: 'flex',
		justifyContent: 'flex-end',

		[theme.fn.smallerThan(350)]: {
			justifyContent: 'center',
			marginTop: theme.spacing.md
		}
	}
}));

interface DowntimeReportProps {
	drivers: Driver[]
}

const DowntimeReport = ({ drivers }: DowntimeReportProps) => {
	const { classes, theme } = useStyles();

	const activeDrivers = useMemo(() => {
		return drivers.filter(driver => driver.isActive && driver.status === DRIVER_STATUS.BUSY).length
	}, [drivers])

	return (
		<Card p='xl' radius='md' className={classes.card}>
			<div className={classes.inner}>
				<Stack className='w-full' align='center'>
					<Group mt='lg'>
						<div>
							<Text className={classes.lead}>{drivers.filter(driver => driver.isActive).length}</Text>
							<Text size='xs' color='dimmed'>
								Online Drivers
							</Text>
						</div>
						<div>
							<Text className={classes.lead}>{drivers.filter(driver => driver.isActive && driver.status === DRIVER_STATUS.AVAILABLE).length}</Text>
							<Text size='xs' color='dimmed'>
								Idle Drivers
							</Text>
						</div>
					</Group>
					<Group mt='lg'>
						<div key={0}>
							<Text className={classes.label}>{activeDrivers}</Text>
							<Text size='xs' color='dimmed'>
								Active Drivers
							</Text>
						</div>
						<div key={1}>
							<Text className={classes.label}>{drivers.filter(driver => !driver.isActive || driver.status === DRIVER_STATUS.OFFLINE).length}</Text>
							<Text size='xs' color='dimmed'>
								Offline Drivers
							</Text>
						</div>
					</Group>
				</Stack>
				<div className={classes.ring}>
					<RingProgress
						roundCaps
						thickness={6}
						size={150}
						sections={[{ value: drivers.length === 0 ? 0 : (activeDrivers / drivers.length) * 100, color: theme.primaryColor }]}
						label={
							<div>
								<Text align='center' size='lg' className={classes.label} sx={{ fontSize: 22 }}>
									{drivers.length === 0 ? 0 : ((activeDrivers / drivers.length) * 100).toFixed(0)}%
								</Text>
								<Text align='center' size='xs' color='dimmed'>
									Driver Utilization
								</Text>
							</div>
						}
					/>
				</div>
			</div>
		</Card>
	);
};

export default DowntimeReport
