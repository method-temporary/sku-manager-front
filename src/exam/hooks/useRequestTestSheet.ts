import { useEffect } from "react";
import { useParams } from "react-router";
import { TestDetailParams } from '../viewmodel/TestDetailParams';
import { requestTestSheet } from "../service/requestTestSheet";
import { setTestSheetViewModel } from "exam/store/TestSheetStore";

export function useRequestTestSheet() {
  const params = useParams<TestDetailParams>();

  useEffect(() => {
    requestTestSheet(params.testId);

    return () => {
      setTestSheetViewModel();
    };
  }, [params.testId]);
}
