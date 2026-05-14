import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(true);
  const toggle = () => setDark(prev => !prev);

  const theme = {
    dark,
    bg:        dark ? '#0f1117' : '#f1f5f9',
    surface:   dark ? '#1a1f2e' : '#ffffff',
    border:    dark ? '#2a3347' : '#e2e8f0',
    text:      dark ? '#f1f5f9' : '#1e293b',
    subtext:   dark ? '#64748b' : '#94a3b8',
    navBg:     dark ? '#1a1f2e' : '#ffffff',
    inputBg:   dark ? '#0f1117' : '#f8fafc',
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div style={{ background: theme.bg, minHeight: '100vh', color: theme.text, transition: 'all 0.3s' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);