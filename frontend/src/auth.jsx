import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [farmerLoggedIn, setFarmerLoggedIn] = useState(
    () => localStorage.getItem('agriintel-farmer-session') === 'true'
  );

  const value = useMemo(
    () => ({
      farmerLoggedIn,
      loginFarmer: () => {
        localStorage.setItem('agriintel-farmer-session', 'true');
        setFarmerLoggedIn(true);
      },
    }),
    [farmerLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
