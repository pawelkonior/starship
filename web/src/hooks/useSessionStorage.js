import { useEffect, useMemo, useState } from 'react';

function getStorageValue(key, defaultValue) {
  const saved = sessionStorage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const useSessionStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    sessionStorage.setItem(key, JSON.stringify(value));
    if (value === null) sessionStorage.removeItem(key);
  }, [key, value]);

  return useMemo(() => [value, setValue], [value, setValue]);
};
