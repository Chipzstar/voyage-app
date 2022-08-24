import React  from 'react';
import { createStyles, Card, RingProgress, Group, Text, Stack } from '@mantine/core';

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

const DowntimeReport = props => {
	const { classes, theme } = useStyles();

	return (
		<Card p='xl' radius='md' className={classes.card}>
			<div className={classes.inner}>
				<Stack className="w-full" align="center">
					<Group mt='lg'>
						<div>
							<Text className={classes.lead}>
								3
							</Text>
							<Text size='xs' color='dimmed'>
								Online Drivers
							</Text>
						</div>
						<div>
							<Text className={classes.lead}>
								2
							</Text>
							<Text size='xs' color='dimmed'>
								Idle Drivers
							</Text>
						</div>
					</Group>
					<Group mt='lg'>
						<div key={0}>
							<Text className={classes.label}>1</Text>
							<Text size='xs' color='dimmed'>
								Active Drivers
							</Text>
						</div>
						<div key={1}>
							<Text className={classes.label}>1</Text>
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
						sections={[{ value: (2 / 4) * 100, color: theme.primaryColor }]}
						label={
							<div>
								<Text align='center' size='lg' className={classes.label} sx={{ fontSize: 22 }}>
									{((2 / 4) * 100).toFixed(0)}%
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
