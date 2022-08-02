import React from 'react';
import PropTypes from 'prop-types';
import { Container, Card, Center, Stack, TextInput, Group, Button, NumberInput } from '@mantine/core';

const Organisation = props => {
	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex flex-col h-full'>
				<header className='page-header my-6'>Organisation Settings</header>
				<form>
					<Stack className='w-full'>
						<div>
							<NumberInput defaultValue={0} label='Load Number Start' />
						</div>
						<Group>
							<TextInput label='Phone Number' />
							<TextInput label='Email Address' />
						</Group>
						<div>
							<TextInput label='DOT Number' />
						</div>
					</Stack>

					<Group my={10} py={10}>
						<Button
							type='submit'
							classNames={{
								root: 'bg-secondary hover:bg-secondary-600'
							}}
						>
							Save Changes
						</Button>
					</Group>
				</form>
			</Center>
		</Container>
	);
};

Organisation.propTypes = {};

export default Organisation;
