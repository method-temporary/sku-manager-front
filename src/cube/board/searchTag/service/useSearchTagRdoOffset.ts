import { useCallback, useEffect, useRef, useState } from "react"
import { onOffset, setOffset } from "../store/SerchTagRdoStore"

type Value = number | undefined

interface SetStore {
  (next: number): void
}

export function useSearchTagRdoOffset(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onOffset(`useSearchTagRdoOffset-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: number) => {
    const serviceId = `useSearchTagRdoOffset-${serviceIdRef.current}`
    setOffset(next, serviceId)
  }, [])

  return [value, setStore]
}

