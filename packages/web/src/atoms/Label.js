import React from 'react';

const Label = ({ children, className, ...props }) => (
  <label className={`leading-7 text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </label>
);

export default Label;
