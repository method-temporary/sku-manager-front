import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { onKeywords, setKeywords } from '../store/SerchTagCdoStore';

type Value = string | undefined;

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export function useSearchTagCdoKeywords(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = `useSearchTagCdoKeywords-${serviceIdRef.current++}`;
    setServiceId(serviceId);

    function subscribeCallback(next: Value) {
      setValue(next);
    }
    return onKeywords(serviceId, subscribeCallback);
  }, []);

  const setStore = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setKeywords(e.target.value, serviceId);
    },
    [serviceId]
  );

  return [value, setStore];
}
