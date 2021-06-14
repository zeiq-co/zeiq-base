import 'twin.macro';
import React from 'react';

const AnchorLink = ({ children, className, ...props }) => (
  <a
    className={className}
    tw="text-base font-medium text-gray-900 hover:text-gray-700 cursor-pointer"
    {...props}
  >
    {children}
  </a>
);

export default AnchorLink;
