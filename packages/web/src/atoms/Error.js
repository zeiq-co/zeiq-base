import 'twin.macro';
import React from 'react';

const Error = ({ className, children }) => (
  <p className={className} tw="mt-0 text-sm text-red-500">
    {children}
  </p>
);

export default Error;
