import { useEffect } from "react";
import { requestTestSheet } from "exam/service/requestTestSheet";
import { useTestSheetModalViewModel } from "exam/store/TestSheetModalStore";
import { getInitialTestSheetModalViewModel } from "exam/viewmodel/TestSheetModalViewModel";
import { setTestSheetViewModel } from "exam/store/TestSheetStore";


export function useRequestLectureTest() {
  const { testId } = useTestSheetModalViewModel() || getInitialTestSheetModalViewModel();

  useEffect(() => {
    if (testId === '') {
      return () => { };
    }
    requestTestSheet(testId);
    return () => {
      setTestSheetViewModel();
    };
  }, [testId])
}