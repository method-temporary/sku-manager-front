import { useCallback, useEffect, useRef, useState } from "react"
import { onStartDate, setStartDate } from "../store/DashBoardSentenceRdoStore"

type Value = Date | undefined

interface SetStore {
  (date: Date): void
}

export function useDashBoardSentenceRdoStartDate(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: number) {
      setValue(new Date(next))
    }
    return onStartDate(`useDashboardSentenseRdoStartDate-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: Date) => {
    const serviceId = `useDashboardSentenseRdoStartDate-${serviceIdRef.current}`
    setStartDate(next.getTime(), serviceId)
  }, [])

  return [value, setStore]
}

