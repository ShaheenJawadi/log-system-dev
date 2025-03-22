const TOKEN_KEY = 'assessment_test';
const REFRESH_TOKEN_KEY = TOKEN_KEY+'_refresh';


export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);

};

 
export const setRefreshToken = (refresh_token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
};
 
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};
