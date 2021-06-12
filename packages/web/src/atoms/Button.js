import React from 'react';
import PropTypes from 'prop-types';

// import { ZeiqContext } from '../libs/ZeiqProvider';

const Button = ({ children, isLoading, disabled, className, ...props }) => {
  // const data = React.useContext(ZeiqContext);
  // console.log('theme', data.theme);

  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      className={`flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg ${className} ${
        isLoading ? 'animate-pulse ' : ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  primary: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  primary: false,
  size: 'medium',
  onClick: undefined,
};

export default Button;
