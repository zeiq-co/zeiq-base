import React from 'react';

// import { ZeiqContext } from '../libs/ZeiqProvider';

const Button = ({ children, isLoading, disabled, ...props }) => {
  // const data = React.useContext(ZeiqContext);
  // console.log('theme', data.theme);

  return (
    <button
      type="button"
      disabled={isLoading || disabled}
      className={`flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg ${
        isLoading ? 'animate-pulse ' : ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
