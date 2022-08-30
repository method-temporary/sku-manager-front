import { useCallback, useEffect, useRef, useState } from "react"
import { onLimit, setLimit } from "../store/SerchTagRdoStore"

type Value = number | undefined

interface SetStore {
  (next: number): void
}

export function useSearchTagRdoLimit(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onLimit(`useSearchTagRdoLimit-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: number) => {
    const serviceId = `useSearchTagRdoLimit-${serviceIdRef.current}`
    setLimit(next, serviceId)
  }, [])

  return [value, setStore]
}

