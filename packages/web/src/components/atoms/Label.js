import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const Label = ({ children, className, ...props }) => (
  <label
    className={className}
    tw="leading-7 text-sm text-gray-500 dark:text-gray-300 font-medium"
    {...props}
  >
    {children}
  </label>
);

Label.defaultProps = {};
Label.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
};

export default Label;
