import { useContext } from 'react';
import { authContext } from '../contexts/AuthContext';
export function useAuth() {
  const ctxValue = useContext(authContext);

  if (!ctxValue) {
    throw new Error('useCtx must be used within a ContextProvider');
  }
  return ctxValue;
}
