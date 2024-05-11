"use client"
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Triangle } from 'react-loader-spinner';


interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<{ authenticated: boolean | null; username: string | null; role: string | null }>({
  authenticated: null,
  username: null,
  role: null
});


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{ authenticated: boolean | null; username: string | null; role: string | null }>({
    authenticated: null,
    username: null,
    role: null
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await axios.get(process.env.NEXT_PUBLIC_API_URL+'/api/auth/check', { withCredentials: true });
        if (response.data.code === 200) {
          setAuthState({ authenticated: true, username: response.data.data.username , role: response.data.data.role});
        } else {
          setAuthState({ authenticated: false, username: null, role: null });
          redirectToLogin();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setAuthState({ authenticated: false, username: null, role: null });
        redirectToLogin();
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };
  
    checkAuthentication();
  }, []);
  

  const redirectToLogin = () => {
    window.location.href = '/auth';
  };

  return (
    <AuthContext.Provider value={authState}>
      {loading ? (
        <div style={{ backgroundColor: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Triangle color="#358BF6" height={50} width={50} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
  
};