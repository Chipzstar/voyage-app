import React from 'react'
import PropTypes from 'prop-types'

const PageHeader = ({ title }) => {
	return <header className="page-header">{title}</header>;
};

PageHeader.propTypes = {
	title: PropTypes.string.isRequired
}

export default PageHeader
