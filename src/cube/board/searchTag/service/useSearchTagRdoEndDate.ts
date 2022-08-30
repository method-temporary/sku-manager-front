import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react"
import { onEndDate, setEndDate } from "../store/SerchTagRdoStore"

type Value = Date | undefined

interface SetStore {
  (date: Date): void
}

export function useSearchTagRdoEndDate(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: number) {
      setValue(new Date(next))
    }
    return onEndDate(`useSearchTagRdoEndDate-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: Date) => {
    const serviceId = `useSearchTagRdoEndDate-${serviceIdRef.current}`
    setEndDate(next.getTime(), serviceId)
  }, [])

  return [value, setStore]
}

