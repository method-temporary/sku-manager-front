import { onText, setText } from "dashBoard/store/DashBoardSentenceRdoStore";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react"

type Value = string | undefined

interface SetStore {
  (e: ChangeEvent<HTMLInputElement>): void
}

export function useDashBoardSentenceText(): [Value, SetStore] {
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

