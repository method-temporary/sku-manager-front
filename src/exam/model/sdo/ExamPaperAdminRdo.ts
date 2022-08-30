export interface ExamPaperAdminRdo {
  title: string;
  authorName: string;
  finalCopy?: boolean;
  questionSelectionType: string;
  startDate?: number;
  endDate?: number;
  limit: number;
  offset: number;
}

export function getInitExamPaperAdminRdo(): ExamPaperAdminRdo {
  return {
    title: '',
    authorName: '',
    finalCopy: undefined,
    questionSelectionType: '',
    startDate: undefined,
    endDate: undefined,
    limit: 20,
    offset: 0,
  };
}
