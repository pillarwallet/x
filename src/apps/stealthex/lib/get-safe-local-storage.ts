function isLocalStorageAvailable() {
  const test = 'test';

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

const fakeStorage: Storage = {
  clear() { },
  getItem() {
    return null;
  },
  key() {
    return null;
  },
  length: 0,
  removeItem() { },
  setItem() { },
};

function getSafeLocalStorage() {
  if (!isLocalStorageAvailable()) {
    return fakeStorage;
  }

  return localStorage;
}

export default getSafeLocalStorage;
