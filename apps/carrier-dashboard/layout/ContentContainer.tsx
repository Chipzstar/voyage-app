import React from 'react';
import PropTypes from 'prop-types';

const ContentContainer = ({ children, classNames="pb-4 px-8 min-h-screen" }) => {
	return <div className={classNames}>{children}</div>;
};

ContentContainer.propTypes = {};

export default ContentContainer;
