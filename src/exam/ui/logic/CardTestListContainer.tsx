import React, { useCallback } from 'react';
import { CardService } from 'card';
import { setTestSheetModalViewModel } from 'exam/store/TestSheetModalStore';
import { CardTestListView } from '../view/CardTestListView';
import { getLectureTestListViewModel, setLectureTestListViewModel, useLectureTestListViewModel } from 'exam/store/LectureTestListStore';
import { ExamService } from 'exam';
import { useRequestCardTestList } from 'exam/hooks/useRequestCardTestList';

interface CardTestListContainerProps {
  readonly?: boolean;
}

export function CardTestListContainer({
  readonly,
}: CardTestListContainerProps) {
  useRequestCardTestList();
  const lectureTestListViewModel = useLectureTestListViewModel();

  const onClickTest = useCallback((paperId: string) => {
    setTestSheetModalViewModel({
      isOpen: true,
      testId: paperId,
    });
  }, []);

  const onClickTestDeleteRow = useCallback((paperId: string) => {
    const cardService = CardService.instance;
    const examService = ExamService.instance;
    const oriCardTests = cardService.cardContentsQuery.tests.slice();

    cardService.cardContentsQuery.tests.map((result, index) => {
      if (result.paperId === paperId) {
        oriCardTests.splice(index, 1);
        cardService.changeCardContentsQueryProps('tests', oriCardTests);
      }
      const lectureTestListViewModel = getLectureTestListViewModel();
      if (lectureTestListViewModel === undefined) {
        return;
      }

      const nextTestList = lectureTestListViewModel.testList.filter(t => t.id !== paperId);
      setLectureTestListViewModel({
        testList: nextTestList,
      });

      examService.removeSelectedExam(paperId);
    });
  }, []);

  return (
    <>
      {lectureTestListViewModel !== undefined && (
        <CardTestListView
          testList={lectureTestListViewModel.testList}
          readonly={readonly}
          onClickTest={onClickTest}
          onClickTestDeleteRow={onClickTestDeleteRow}
        />
      )}

    </>
  );
}