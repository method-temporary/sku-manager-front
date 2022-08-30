import { useCallback, useEffect, useRef, useState } from "react"
import { onShow, setShow } from "../store/DashBoardSentenceRdoStore"

type Value = boolean | undefined

interface SetStore {
  (next: boolean): void
}

export function useDashBoardSentenceRdoShow(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onShow(`useDashboardSentenseRdoShow-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: boolean) => {
    const serviceId = `useDashboardSentenseRdoShow-${serviceIdRef.current}`
    setShow(next, serviceId)
  }, [])

  return [value, setStore]
}

