import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { onUpdater, setUpdater } from "../store/SerchTagRdoStore"

type Value = string | undefined

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void
}

export function useSearchTagRdoUpdater(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onUpdater(`useSearchTagRdoUpdater-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const serviceId = `useSearchTagRdoUpdater-${serviceIdRef.current}`
    setUpdater(e.target.value, serviceId)
  }, [])

  return [value, setStore]
}

