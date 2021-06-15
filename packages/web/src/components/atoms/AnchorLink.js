import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const AnchorLink = ({ children, className, ...props }) => (
  <a
    className={className}
    tw="text-base font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
    {...props}
  >
    {children}
  </a>
);

AnchorLink.defaultProps = {};
AnchorLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

export default AnchorLink;
