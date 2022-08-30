import { useEffect, useRef, useState } from 'react';
import { onSearched } from '../store/SearchTagListStore';

type Value = boolean;

export function useSearchTagSearched(): [Value] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>(false);

  useEffect(() => {
    const serviceId = `useSearchTagSearched-${serviceIdRef.current++}`;
    function subscribeCallback(next: Value) {
      setValue(next);
    }
    return onSearched(serviceId, subscribeCallback);
  }, []);

  return [value];
}
