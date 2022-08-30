import { useEffect } from "react";
import { getInitialTestListLimit, setTestListLimit } from "exam/store/TestListLimitStore";
import { setTestListPage } from "exam/store/TestListPageStore";

export function useClearTestList() {
  useEffect(() => {
    return () => {
      setTestListPage(1);
      setTestListLimit(getInitialTestListLimit());
    };
  }, []);
}