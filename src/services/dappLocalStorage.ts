const localStorageKey = '@pillarx';

export const storageKey = {
  history: 'history',
  balances: 'balances',
  nfts: 'nfts',
};

export const getItem = (key: string) => {
  return localStorage.getItem(`${localStorageKey}:${key}`);
};

export const setItem = (key: string, value: string) => {
  return localStorage.setItem(`${localStorageKey}:${key}`, value);
};

export const getJsonItem = (key: string) => {
  try {
    return JSON.parse(
      localStorage.getItem(`${localStorageKey}:${key}`) as string
    );
  } catch (e) {
    //
  }
  return null;
};

export const setJsonItem = (key: string, value: unknown) => {
  localStorage.setItem(`${localStorageKey}:${key}`, JSON.stringify(value));
};

export const removeItem = (key: string) => {
  return localStorage.removeItem(`${localStorageKey}:${key}`);
};

export const clearDappStorage = () => {
  Object.values(storageKey).forEach((key) => {
    removeItem(key);
  });
};
