import React from 'react';
import { Alert, Button, Divider, Group, Modal, Space, Text } from '@mantine/core';
import { AlertCircle } from 'tabler-icons-react';
import { useRouter } from 'next/router';
import { PATHS } from '../utils/constants';

const WarningAlert = ({opened, onClose}) => {
	const router = useRouter();
	return (
		<Modal opened={!opened} onClose={onClose} padding={0} centered withCloseButton={false}>
			<Alert
				icon={<AlertCircle size={25} />}
				title='Warning'
				color='red'
				sx={theme => ({
					'.mantine-Alert-title': {
						fontSize: 18
					},
					'.mantine-Alert-icon': {
						marginTop: 5
					}
				})}
			>
				<Text size={16}>You won't be able to book shipments until you add a payment method. Please add one by going to the Billing page or clicking the button below.</Text>
				<Space h="md"/>
				<Group position="right" pb={1}>
					<Button size="sm" variant="outline" color="red" onClick={() => router.push(PATHS.BILLING)}>
						Add a Payment Method
					</Button>
				</Group>
			</Alert>
			
			
		</Modal>
	);
};

export default WarningAlert;
