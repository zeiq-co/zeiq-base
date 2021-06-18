import 'twin.macro';
import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({ name, label, error, className, ...props }) => (
  <textarea
    id={name}
    name={name}
    className={className}
    tw="block w-full p-3 mt-1 border-0 text-gray-700 bg-gray-200 appearance-none focus:outline-none focus:bg-gray-300 focus:shadow-inner"
    {...props}
  />
);

TextArea.defaultProps = {};
TextArea.propTypes = {
  name: PropTypes.string.isRequired,
};

export default TextArea;
