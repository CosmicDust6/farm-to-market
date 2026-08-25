import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { getCurrentUser, getToken, setToken, setCurrentUser, api } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [tokenState, setTokenState] = useState(() => getToken());
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    if (tokenState && !user) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          setCurrentUser(userData);
        })
        .catch(() => {
          setToken(null);
          setCurrentUser(null);
          setTokenState(null);
          setUser(null);
        });
    }
  }, [tokenState, user]);

  const value = useMemo(() => {
    const farmerLoggedIn = user?.role === 'farmer' || (!user && localStorage.getItem('agriintel-farmer-session') === 'true');
    const buyerLoggedIn = user?.role === 'buyer';
    const adminLoggedIn = user?.role === 'admin';

    return {
      user,
      token: tokenState,
      farmerLoggedIn,
      buyerLoggedIn,
      adminLoggedIn,
      loginUser: (userData, authToken) => {
        setToken(authToken);
        setCurrentUser(userData);
        setTokenState(authToken);
        setUser(userData);
        if (userData?.role === 'farmer') {
          localStorage.setItem('agriintel-farmer-session', 'true');
        }
      },
      loginFarmer: (userData, authToken) => {
        localStorage.setItem('agriintel-farmer-session', 'true');
        if (authToken) setToken(authToken);
        if (userData) {
          setCurrentUser(userData);
          setUser(userData);
        }
      },
      logout: () => {
        api.logout();
        localStorage.removeItem('agriintel-farmer-session');
        setTokenState(null);
        setUser(null);
      },
    };
  }, [user, tokenState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}

