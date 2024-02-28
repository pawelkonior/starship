import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

import axios from '../../helpers/axiosInstance.js';
import API from '../../data/constants/api_routes.js';
import { authContext } from '../../contexts/AuthContext.jsx';

function getToken() {
  const storedTokens = localStorage.getItem('authTokens');
  if (storedTokens) {
    return JSON.parse(storedTokens);
  } else {
    return null;
  }
}

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(getToken);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const setAuthTokens = useCallback(
    (tokens) => {
      setTokens(tokens);
      localStorage.setItem('authTokens', JSON.stringify(tokens));
    },
    [setTokens],
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('messages');
    setAuthTokens(null);
    setUser(null);
    navigate('/');
  }, [setUser, navigate, setAuthTokens]);

  const updateUser = useCallback(
    async ({ force = false }) => {
      setIsLoading(true);
      if (!user || force) {
        try {
          if (tokens) {
            const res = await axios.get(
              API.users.user(jwtDecode(tokens?.access).user_id),
            );
            if (res.status === 200) {
              setUser(res.data);
            }
          }
        } catch (error) {
          logoutUser();
        }
      }
      setIsLoading(false);
    },
    [user, setIsLoading, setUser, logoutUser, tokens],
  );

  useEffect(() => {
    setIsLoading(false);
    if (tokens) {
      updateUser({ force: false });
    }
  }, [updateUser, tokens]);

  const ctxValue = useMemo(
    () => ({
      user,
      tokens,
      setAuthTokens,
      logoutUser,
      updateUser,
      isLoading,
    }),
    [user, tokens, setAuthTokens, logoutUser, updateUser, isLoading],
  );

  if (!isLoading) {
    return (
      <authContext.Provider value={ctxValue}>{children}</authContext.Provider>
    );
  }
};
