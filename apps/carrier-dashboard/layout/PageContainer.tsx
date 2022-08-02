import React from 'react'
import PropTypes from 'prop-types'

const PageContainer = ({ children }) => {
	return (
		<div className='py-5 h-screen'>{children}</div>
	)
}

PageContainer.propTypes = {

}

export default PageContainer
