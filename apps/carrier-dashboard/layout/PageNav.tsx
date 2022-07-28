import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumbs } from '@mantine/core'

const PageNav = ({ items }) => {
	return (
		<header className='flex sticky top-0 items-center space-x-4 pt-4 pb-8 bg-white z-50' role='button'>
			<Breadcrumbs>{items}</Breadcrumbs>
		</header>
	);
};

PageNav.propTypes = {
	
}

export default PageNav
