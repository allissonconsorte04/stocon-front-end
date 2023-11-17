import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RenderMenu, RenderRoutes } from './RenderRoutes';

import api from '../services/api';
import { LOCAL_STORAGE_USER_AUTH_KEY } from '../constants/storageKeys';

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    isAuthenticated: false,
    token: null,
  });

  const login = (userName: string, password: string) => {
    api
      .post('login', {
        email: userName,
        password: password,
      })
      .then((response) => {
        console.log('response => ', response)
        const { auth_token } = response.data;

        if (auth_token) {
          console.log('entrou aqui')
          localStorage.setItem(
            LOCAL_STORAGE_USER_AUTH_KEY,
            JSON.stringify({
              name: userName,
              isAuthenticated: true,
              token: auth_token,
            })
          );
        }
        setUser({ email: userName, isAuthenticated: true, token: auth_token });
        navigate('/produtos');
      })
      .catch((error) => {
        console.log('Erro no login: ', error);
      });
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_AUTH_KEY);
    setUser({ ...user, isAuthenticated: false });
  };

  useEffect(() => {
    const storageUser = localStorage.getItem(LOCAL_STORAGE_USER_AUTH_KEY);
    const userAuth = JSON.parse(storageUser);
    if (userAuth) {
      setUser({
        email: userAuth?.name,
        isAuthenticated: true,
        token: userAuth?.token,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <>
        <RenderMenu />
        <RenderRoutes />
      </>
    </AuthContext.Provider>
  );
};

/* 
https://www.youtube.com/watch?v=q94v5AhgrW4

https://github.com/KodieCode/react-private-routes-authentication/blob/main/src/components/pages/Login.js */
