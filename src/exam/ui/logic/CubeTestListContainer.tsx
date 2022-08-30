import React, { useCallback } from 'react';
import { CubeService } from 'cube';
import { ExamService } from 'exam';
import { setTestSheetModalViewModel } from 'exam/store/TestSheetModalStore';
import CubeTestListView from '../../../cube/cube/ui/view/CubeTestListView';
import { getLectureTestListViewModel, setLectureTestListViewModel, useLectureTestListViewModel } from 'exam/store/LectureTestListStore';
import { useRequestCubeTestList } from 'exam/hooks/useRequestCubeTestList';

interface CubeTestListContainerProps {
  readonly?: boolean;
}

export function CubeTestListContainer({
  readonly,
}: CubeTestListContainerProps) {
  useRequestCubeTestList();
  const lectureTestListViewModel = useLectureTestListViewModel();

  const onClickTest = useCallback((paperId: string) => {
    setTestSheetModalViewModel({
      isOpen: true,
      testId: paperId,
    });
  }, []);

  const onClickTestDelete = useCallback((paperId: string) => {
    const cubeService = CubeService.instance;
    const examService = ExamService.instance;

    const targetTests = [...cubeService.cube.cubeContents.tests];
    const index = targetTests.findIndex((test) => test.paperId === paperId);
    targetTests.splice(index, 1);
    cubeService.changeCubeProps('cubeContents.tests', targetTests);

    const lectureTestListViewModel = getLectureTestListViewModel();
    if (lectureTestListViewModel === undefined) {
      return;
    }

    const nextTestList = lectureTestListViewModel.testList.filter(t => t.id !== paperId);
    setLectureTestListViewModel({
      testList: nextTestList,
    });
    examService.removeSelectedExam(paperId);
  }, []);

  return (
    <>
      {lectureTestListViewModel !== undefined && (
        <CubeTestListView
          testList={lectureTestListViewModel.testList}
          readonly={readonly}
          onClickTest={onClickTest}
          onClickTestDeleteRow={onClickTestDelete}
        />
      )}
    </>
  );
}