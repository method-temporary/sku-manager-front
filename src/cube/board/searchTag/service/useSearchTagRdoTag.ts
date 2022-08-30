import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { onTag, setTag } from "../store/SerchTagRdoStore"

type Value = string | undefined

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void
}

export function useSearchTagRdoTag(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onTag(`useSearchTagRdoTag-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const serviceId = `useSearchTagRdoTag-${serviceIdRef.current}`
    setTag(e.target.value, serviceId)
  }, [])

  return [value, setStore]
}

