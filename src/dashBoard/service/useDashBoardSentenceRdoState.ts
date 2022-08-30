import { useCallback, useEffect, useRef, useState } from "react"
import { onState, SEARCH_TYPE, setState } from "../store/DashBoardSentenceRdoStore"

type Value = SEARCH_TYPE | undefined

interface SetStore {
  (next: SEARCH_TYPE): void
}

export function useDashBoardSentenceRdoState(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onState(`useDashboardSentenseRdoState-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: SEARCH_TYPE) => {
    const serviceId = `useDashboardSentenseRdoState-${serviceIdRef.current}`
    setState(next, serviceId)
  }, [])

  return [value, setStore]
}

