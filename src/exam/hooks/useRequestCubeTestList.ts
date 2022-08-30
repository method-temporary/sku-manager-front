import { useEffect } from "react";
import { CubeService } from "cube";
import { requestLectureTestList } from "exam/service/requestLectureTestList";


export function useRequestCubeTestList() {
  const { cube } = CubeService.instance;

  useEffect(() => {
    if (cube.id === undefined) {
      return;
    }

    const examPaperIds = cube.cubeContents.tests.map(t => t.paperId);
    if (examPaperIds.length > 0) {
      requestLectureTestList(examPaperIds);
    }
  }, [cube.id]);
}