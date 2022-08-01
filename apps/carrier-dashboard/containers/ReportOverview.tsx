import React, { useMemo, useState } from 'react';
import { Container, Grid, Card, Group, Stack, Center, Table } from '@mantine/core'
import { CalendarFilter, DateRange } from '@voyage-app/shared-ui-components';
import moment from 'moment/moment';
// import { generateProgrammingLanguageStats } from '@nivo/generators';
import OverviewPieChart from '../charts/OverviewPieChart';
import InvoiceReport from '../charts/InvoiceReport'
import DowntimeReport from '../charts/DowntimeReport'
import DispatcherScoreboard from '../charts/DispatcherScoreboard'

const ReportOverview = () => {
	const [dateRange, setRange] = useState([moment().startOf('day').toDate(), moment().startOf('day').add(1, 'day').toDate()]);
	const data = useMemo(() => {
		/*return generateProgrammingLanguageStats(true, 9).map(({ label, ...data }) => ({
			id: label,
			...data,
		}))*/
		return [
			{
				id: 'assigned',
				label: 'Assigned',
				value: '5',
				color: 'hsl(52, 70%, 50%)'
			},
			{
				id: 'unassigned',
				label: 'Unassigned',
				value: '1',
				color: 'hsl(198, 93.2%, 59.6%)'
			}
		];
	}, []);

	return (
		<Container fluid className="bg-stone-100" py={0}>
			<div className='flex justify-between items-center pt-4 mb-6'>
				<CalendarFilter current={dateRange as DateRange} setCurrent={setRange} amountOfMonths={2} />
			</div>
			<Grid grow gutter='xl'>
				<Grid.Col md={6}>
					<Group className='w-full h-full' noWrap={false}>
						<Card p='lg' radius='xs' shadow='sm' className="h-full">
							<Card.Section p='lg' className="h-full">
								<header className='chart-header'>Trucks</header>
								<Center className="h-full">
									<OverviewPieChart data={data} />
								</Center>
							</Card.Section>
						</Card>
						<Card p='lg' radius='xs' shadow='sm' className='flex flex-wrap justify-center items-center grow h-full'>
							<Card.Section className="w-full">
								<Stack p='md' className="w-full" align="center">
									<div className="text-center w-full space-y-2">
										<h3>Loads</h3>
										<Center>
											<div className="w-full py-1 border border-voyage-grey rounded-sm">1</div>
										</Center>
									</div>
									<div className="text-center w-full space-y-2">
										<h3>Avg Rate</h3>
										<Center>
											<div className="w-full py-1 border border-voyage-grey rounded-sm">£0.00</div>
										</Center>
									</div>
									<div className="text-center w-full space-y-2">
										<h3>Loaded Avg Rate</h3>
										<Center>
											<div className="w-full py-1 border border-voyage-grey rounded-sm">£0.00</div>
										</Center>
									</div>
								</Stack>
							</Card.Section>
						</Card>
					</Group>
				</Grid.Col>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='flex flex-wrap grow h-full'>
						<Card.Section className="w-full" p="lg">
							<header className='chart-header'>Invoiced Loads</header>
							<InvoiceReport/>
						</Card.Section>
					</Card>
				</Grid.Col>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='flex flex-wrap grow h-full'>
						<Card.Section className="w-full" p="lg">
							<header className='chart-header'>Driver Downtime Scoreboard</header>
							<DowntimeReport/>
						</Card.Section>
					</Card>
				</Grid.Col>
				<Grid.Col md={6}>
					<Card p='lg' radius='xs' shadow='sm' className='flex flex-wrap grow h-full'>
						<Card.Section className="w-full" p="lg">
							<header className='chart-header'>Dispatcher Scoreboard</header>
							<DispatcherScoreboard/>
						</Card.Section>
					</Card>
				</Grid.Col>
			</Grid>
		</Container>
	);
};

ReportOverview.propTypes = {};

export default ReportOverview;
