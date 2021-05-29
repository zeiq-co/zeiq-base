import React from 'react';

const TextArea = ({ name, label, error, className, ...props }) => (
  <textarea
    id={name}
    name={name}
    className={`w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out ${className}`}
    {...props}
  />
);

export default TextArea;
