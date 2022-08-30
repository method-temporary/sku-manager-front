import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"
import { onText, setText } from "../store/SerchTagRdoStore"

type Value = string | undefined

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void
}

export function useSearchTagRdoText(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onText(`useSearchTagRdoText-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const serviceId = `useSearchTagRdoText-${serviceIdRef.current}`
    setText(e.target.value, serviceId)
  }, [])

  return [value, setStore]
}

