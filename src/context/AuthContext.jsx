import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Mock users
const USERS = [
  { id: 1, username: 'admin',    password: 'admin123',  role: 'Admin',    name: 'Test Admin' },
  { id: 2, username: 'operator', password: 'op123',     role: 'Operator', name: 'Test Operator' },
  { id: 3, username: 'viewer',   password: 'view123',   role: 'Viewer',   name: 'Test Viewer' },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) { setUser(found); return true; }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);