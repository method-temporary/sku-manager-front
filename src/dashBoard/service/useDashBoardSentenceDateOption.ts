import { useCallback, useEffect, useRef, useState } from "react"
import { onDateOption, SEARCH_DATE_TYPE, setDateOption } from "../store/DashBoardSentenceRdoStore"

type Value = SEARCH_DATE_TYPE | undefined

interface SetStore {
  (next: SEARCH_DATE_TYPE): void
}

export function useDashBoardSentenceDateOption(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onDateOption(`useDashBoardSentenceDateOption-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: SEARCH_DATE_TYPE) => {
    const serviceId = `useDashBoardSentenceDateOption-${serviceIdRef.current}`
    setDateOption(next, serviceId)
  }, [])

  return [value, setStore]
}

