import React from 'react';

export const ZeiqContext = React.createContext();

const ZeiqProvider = ({ children, value }) => {
  return <ZeiqContext.Provider value={value}>{children}</ZeiqContext.Provider>;
};

export default ZeiqProvider;
