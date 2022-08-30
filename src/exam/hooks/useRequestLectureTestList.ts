import { useEffect } from "react";
import { requestLectureTestList } from "exam/service/requestLectureTestList";

export function useRequestLectureTestList(examPaperIds: string[]) {
  useEffect(() => {
    requestLectureTestList(examPaperIds);
  }, []);
}