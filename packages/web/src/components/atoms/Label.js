import 'twin.macro';
import React from 'react';

const Label = ({ children, className, ...props }) => (
  <label
    className={className}
    tw="leading-7 text-sm text-gray-500 font-medium"
    {...props}
  >
    {children}
  </label>
);

export default Label;
