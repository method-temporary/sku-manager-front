import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { onCreator, setCreator } from "../store/SerchTagRdoStore"

type Value = string | undefined

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void
}

export function useSearchTagRdoCreator(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onCreator(`useSearchTagRdoCreator-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const serviceId = `useSearchTagRdoCreator-${serviceIdRef.current}`
    setCreator(e.target.value, serviceId)
  }, [])

  return [value, setStore]
}

