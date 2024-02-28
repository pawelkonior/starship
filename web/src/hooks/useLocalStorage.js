import { useEffect, useMemo, useState } from 'react';

function getStorageValue(key, defaultValue) {
  const saved = localStorage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
    if (value === null) localStorage.removeItem(key);
  }, [key, value]);

  return useMemo(() => [value, setValue], [value, setValue]);
};
