import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState();

  const [role, setRole] = useState(() => {
    const savedRole = localStorage.getItem('quyen');
    return savedRole ? savedRole : null;
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const login = (userData) => {
    setUser(userData);
    setRole(userData.quyen);
    localStorage.setItem('quyen', JSON.stringify(userData.quyen));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('quyen');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        role,
        logout,
        isCollapsed,
        setIsCollapsed,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
