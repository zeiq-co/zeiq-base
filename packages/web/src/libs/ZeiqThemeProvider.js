import React from 'react';

export const ThemeContext = React.createContext();

const ZeiqThemeProvider = ({ children, value }) => {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ZeiqThemeProvider;
