import React from 'react';

const Error = ({ className, children }) => (
  <p className={`mt-0 text-sm text-red-500 ${className}`}>{children}</p>
);

export default Error;
