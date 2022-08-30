import React from 'react';
import { Button, Divider, Group, Modal, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { PATHS } from '../utils/constants';

const AccountActivation = ({ opened, onClose }) => {
	const router = useRouter();
	return (
		<Modal
			opened={opened}
			onClose={onClose}
			title='Welcome to Voyage!'
			classNames={{
				title: 'page-subheading'
			}}
			centered
		>
			<div className='flex flex-col justify-center space-y-3 p-6'>
				<Text weight='600' className='4xl'>
					Account Activated
				</Text>
				<Text color='dimmed'>You now have full access to our dashboard. To get started why not book your first load!</Text>
			</div>
			<Divider my='xs' />
			<Group position='right'>
				<Button
					size='lg'
					classNames={{
						root: `bg-secondary 'hover:bg-secondary-600`
					}}
					onClick={() => {
						router.push(PATHS.HOME)
						onClose()
					}}
				>
					Go to dashboard
				</Button>
			</Group>
		</Modal>
	);
};

export default AccountActivation;
