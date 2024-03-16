import React, { createContext, useState } from 'react';

export const ThemeContext = createContext<any>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ThemeContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </ThemeContext.Provider>
  );
};
