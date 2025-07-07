import { useLocalStorage as useLocalStorageHook } from 'usehooks-ts';

type LocalStorageKeys = 'ISPENSINO-theme';

const useLocalStorage = <T>(
  keyName: LocalStorageKeys,
  defaultValue: T
): [T, (value: T) => void, () => void] => {
  return useLocalStorageHook<T>(keyName, defaultValue);
};

export default useLocalStorage;
