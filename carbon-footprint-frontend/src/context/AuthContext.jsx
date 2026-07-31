import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const login = (jwtResponse) => {
    const userData = {
      id: jwtResponse.id,
      username: jwtResponse.username,
      email: jwtResponse.email,
      firstName: jwtResponse.firstName,
      lastName: jwtResponse.lastName,
      roles: jwtResponse.roles,
      firstLogin: jwtResponse.firstLogin,
    };
    setUser(userData);
    setToken(jwtResponse.token);
    localStorage.setItem('token', jwtResponse.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newObj = { ...prev, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(newObj));
      return newObj;
    });
  };

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN');
  const isUser = () => user?.roles?.includes('ROLE_USER');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        setLoading,
        login,
        logout,
        updateUser,
        isAdmin,
        isUser,
        toast,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : toast.type === 'info'
                ? 'bg-blue-950/90 border-blue-500/50 text-blue-200'
                : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
            }`}
          >
            <span className="font-semibold text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
