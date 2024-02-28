export const getAuthTokens = () => {
  const storedTokens = localStorage.getItem("authTokens");
  return storedTokens ? JSON.parse(storedTokens) : null;
};
