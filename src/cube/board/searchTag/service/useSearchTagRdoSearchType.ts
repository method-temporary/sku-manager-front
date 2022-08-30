import { useCallback, useEffect, useRef, useState } from "react"
import { onSearchType, SEARCH_TYPE, setSearchType } from "../store/SerchTagRdoStore"

type Value = SEARCH_TYPE | undefined

interface SetStore {
  (next: SEARCH_TYPE): void
}

export function useSearchTagRdoSearchType(): [Value, SetStore] {
  const serviceIdRef = useRef<number>(0);
  const [value, setValue] = useState<Value>();

  useEffect(() => {
    const serviceId = serviceIdRef.current++;
    function subscribeCallback(next: Value) {
      setValue(next)
    }
    return onSearchType(`useSearchTagRdoSearchType-${serviceId}`, subscribeCallback);
  }, [])

  const setStore = useCallback((next: SEARCH_TYPE) => {
    const serviceId = `useSearchTagRdoSearchType-${serviceIdRef.current}`
    setSearchType(next, serviceId)
  }, [])

  return [value, setStore]
}

