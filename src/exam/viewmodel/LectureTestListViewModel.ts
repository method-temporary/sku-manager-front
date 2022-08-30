import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import { ExamModel } from '..';

export interface LectureTestListViewModel {
  testList: LectureTestListItem[];
}

export interface LectureTestListItem {
  id: string;
  title: string;
  questionSelectionTypeText: QuestionSelectionTypeText;
  successPoint: number;
  totalPoint: number;
}

export function getInitialLectureTestListViewModel(): LectureTestListViewModel {
  return {
    testList: [],
  };
}

export function getExamToLectureTestListViewModel(examModel: ExamModel): LectureTestListItem {
  //
  return {
    id: examModel.id,
    title: examModel.title,
    questionSelectionTypeText: QuestionSelectionTypeText[examModel.questionSelectionType],
    successPoint: examModel.successPoint,
    totalPoint: examModel.totalPoint,
  };
}
