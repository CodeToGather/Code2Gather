export const TOKEN_KEY = 'authToken';

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const storeToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const tokenUtils = { getToken, storeToken, removeToken };

export default tokenUtils;
