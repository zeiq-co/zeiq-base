import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const Error = ({ className, children }) => (
  <p className={className} tw="mt-0 text-sm text-red-500">
    {children}
  </p>
);

Error.defaultProps = {};
Error.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

export default Error;
