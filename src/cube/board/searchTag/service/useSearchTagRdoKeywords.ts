import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { onKeywords, setKeywords } from "../store/SerchTagRdoStore"

type Value = string | undefined

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void
}

export function useSearchTagRdoKeywords(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onKeywords(`useSearchTagRdoKeywords-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const serviceId = `useSearchTagRdoKeywords-${serviceIdRef.current}`
    setKeywords(e.target.value, serviceId)
  }, [])

  return [value, setStore]
}

