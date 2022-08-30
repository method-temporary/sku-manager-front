import TestModalStore from './TestModal.store';

/**
 * TestModal 에서 선택되어 있는지 여부 판단
 * @param paperId
 */
export const isCheckedExamPaper = (paperId: string) => {
  //
  const { selectedExamPapers } = TestModalStore.instance;

  const examPaper = selectedExamPapers.find((examPaper) => examPaper.id === paperId);

  return !!examPaper;
};
