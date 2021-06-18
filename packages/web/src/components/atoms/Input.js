import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ name, className, ...props }) => (
  <input
    type="text"
    id={name}
    name={name}
    className={className}
    tw="block w-full p-3 border-0 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
    {...props}
  />
);

Input.propTypes = {
  name: PropTypes.string.isRequired,
};
Input.defaultProps = {};

export default Input;
