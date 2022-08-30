import moment from 'moment';
import { ExamModel, ExamService } from 'exam';
import { findExamPaperByIds } from 'exam/api/examApi';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import { setLectureTestListViewModel } from 'exam/store/LectureTestListStore';
import { LectureTestListItem } from 'exam/viewmodel/LectureTestListViewModel';

export async function requestLectureTestList(examPaperIds: string[]) {
  const examPapers = await findExamPaperByIds(examPaperIds);
  if (examPapers === undefined) {
    return;
  }

  const selectedExams: ExamModel[] = examPapers.map((e) => {
    return {
      authorId: '',
      authorName: e.authorName,
      questionSelectionType: e.questionSelectionType,
      successPoint: e.successPoint,
      totalPoint: e.totalPoint,
      finalCopy: e.finalCopy,
      finalCopyKr: e.finalCopy === true ? '최종본' : '수정가능본',
      id: e.id,
      questions: [],
      registDate: moment(e.time).format('YYYY-MM-DD'),
      title: e.title,
      year: '',
      multipleChoicePoint: 0,
      assayPoint: 0,
    };
  });

  ExamService.instance.setSelectedExam(selectedExams);

  const testList: LectureTestListItem[] = examPapers.map((e) => {
    return {
      id: e.id,
      title: e.title,
      questionSelectionTypeText: QuestionSelectionTypeText[e.questionSelectionType],
      successPoint: e.successPoint,
      totalPoint: e.totalPoint,
    };
  });

  setLectureTestListViewModel({
    testList,
  });
}
