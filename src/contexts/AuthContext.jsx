import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const loadedUser = { ...res.data.data, _id: res.data.data._id || res.data.data.id };
          setUser(loadedUser);
          if (loadedUser.preferredLanguage && !localStorage.getItem('language-manual')) {
            changeLanguage(loadedUser.preferredLanguage, { persist: false });
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token, changeLanguage]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: responseUser } = res.data.data;
    const user = { ...responseUser, _id: responseUser._id || responseUser.id };
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    if (user.preferredLanguage && !localStorage.getItem('language-manual')) {
      changeLanguage(user.preferredLanguage, { persist: false });
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user: responseUser } = res.data.data;
    const user = { ...responseUser, _id: responseUser._id || responseUser.id };
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    if (user.preferredLanguage) changeLanguage(user.preferredLanguage, { persist: false });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const updateUser = (data) => {
    setUser({ ...user, ...data, _id: data._id || data.id || user?._id });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
