import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { onTag, setTag } from '../store/SerchTagCdoStore';

type Value = string | undefined;

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void;
}

export function useSearchTagCdoTag(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = `useSearchTagCdoTag-${serviceIdRef.current++}`;
    setServiceId(serviceId);
    function subscribeCallback(next: Value) {
      setValue(next);
    }
    return onTag(serviceId, subscribeCallback);
  }, []);

  const setStore = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setTag(e.target.value, serviceId);
    },
    [serviceId]
  );

  return [value, setStore];
}
