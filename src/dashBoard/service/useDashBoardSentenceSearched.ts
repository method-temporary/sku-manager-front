import { useEffect, useRef, useState } from 'react';
import { onSearched } from '../store/DashBoardSentenceStore';

type Value = boolean;

export function useDashBoardSentenceSearched(): [Value] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>(false);

  useEffect(() => {
    const serviceId = `useDashboardSentenseSearched-${serviceIdRef.current++}`;
    function subscribeCallback(next: Value) {
      setValue(next);
    }
    return onSearched(serviceId, subscribeCallback);
  }, []);

  return [value];
}
