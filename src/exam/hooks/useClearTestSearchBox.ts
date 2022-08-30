import { useEffect } from "react";
import { setTestSearchBoxViewModel } from "exam/store/TestSearchBoxStore";
import { getInitialTestSearchBoxViewModel } from "exam/viewmodel/TestSearchBoxViewModel";

export function useClearTestSearchBox() {
  useEffect(() => {
    return () => {
      setTestSearchBoxViewModel(getInitialTestSearchBoxViewModel());
    }
  }, []);
}