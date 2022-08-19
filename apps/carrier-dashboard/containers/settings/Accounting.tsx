import React from 'react'
import PropTypes from 'prop-types'
import { Center, Container } from '@mantine/core';

const Accounting = props => {
	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex flex-col h-full'>
				<header className='page-header my-6'>Accounting Settings</header>
			</Center>
		</Container>
	)
}

Accounting.propTypes = {

}

export default Accounting
