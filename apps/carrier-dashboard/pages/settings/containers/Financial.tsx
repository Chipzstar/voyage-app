import React from 'react';
import { Container, Center, Card, Stack, Button, Group, TextInput } from '@mantine/core';

const Financial = () => {
	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex flex-col h-full'>
				<header className='page-header my-6'>Financial Settings</header>
				<form>
					<Group px={20}>
						<TextInput label='Card Info' placeholder='1234 1234 1234 1234' />
						<Group>
							<TextInput label='Month' placeholder='MM' classNames={{
								root: "w-24"
							}} />
							<TextInput label='Year' placeholder='YY' classNames={{
								root: "w-24"
							}} />
						</Group>
						<TextInput label='CVV' placeholder='' classNames={{
							root: "w-24"
						}} />
					</Group>
					<Stack align="center" py={20}>
						<Button className="bg-secondary hover:bg-secondary-600">
							Save Changes
						</Button>
					</Stack>
				</form>
			</Center>
		</Container>
	);
};

export default Financial;
