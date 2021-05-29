import React from 'react';

const AnchorLink = ({ children, className, ...props }) => (
  <a
    className={`text-base font-medium text-gray-900 hover:text-gray-700 cursor-pointer ${className}`}
    {...props}
  >
    {children}
  </a>
);

export default AnchorLink;
