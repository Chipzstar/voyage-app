import React from 'react'
import PropTypes from 'prop-types'

const PageContainer = ({ children, classNames="py-5 h-screen" }) => {
	return (
		<div className={classNames}>{children}</div>
	)
}

PageContainer.propTypes = {

}

export default PageContainer
