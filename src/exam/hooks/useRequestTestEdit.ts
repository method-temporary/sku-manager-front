import { useEffect } from "react";
import { useParams } from "react-router";
import { TestEditParams } from "exam/viewmodel/TestEditParams";
import { requestTestEdit } from "exam/service/requestTestEdit";


export function useRequestTestEdit() {
  const params = useParams<TestEditParams>();
  useEffect(() => {
    requestTestEdit(params.testId);
  }, [params.testId]);
}
