import { findExamPaper, findExamQuestions } from 'exam/api/examApi';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';
import { getChoiceScore, getAnswerScore } from 'exam/model/ExamQuestionModel';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import { setTestSheetViewModel } from 'exam/store/TestSheetStore';
import { Question } from 'exam/viewmodel/TestSheetViewModel';

export async function requestTestSheet(testId: string) {
  const examPaperModel = await findExamPaper(testId);
  const examQuestionModels = await findExamQuestions(testId);

  if (examPaperModel === undefined || examQuestionModels === undefined) {
    return;
  }

  const choiceScore = getChoiceScore(examQuestionModels);
  const answerScore = getAnswerScore(examQuestionModels);

  const questions: Question[] = examQuestionModels.map((q) => {
    return {
      sequence: q.sequence,
      mandatory: q.mandatory,
      groupName: q.groupName,
      questionType: q.questionType,
      point: String(q.point),
      question: q.question,
      items: q.items,
      imagePath: q.imagePath,
      questionAnswer: q.questionAnswer,
      description: q.description,
    };
  });

  setTestSheetViewModel({
    id: examPaperModel.id,
    title: examPaperModel.title,
    description: examPaperModel.description,
    authorName: examPaperModel.authorName,
    questionSelectionTypeText: QuestionSelectionTypeText[examPaperModel.questionSelectionType],
    questionCount: examPaperModel.questionSelectionType === 'ALL' ? questions.length : getQuestionCount(examPaperModel),
    successPoint: examPaperModel.successPoint,
    totalPoint: examPaperModel.totalPoint,
    choiceScore,
    answerScore,
    questions,
  });
}

function getQuestionCount(examPaperModel: ExamPaperModel): number {
  if (examPaperModel.questionSelectionType === 'BY_GROUP') {
    return examPaperModel.questionSelectionConfig.questionGroups.map((g) => g.questionCount).reduce((a, b) => a + b, 0);
  } else if (examPaperModel.questionSelectionType === 'FIXED_COUNT') {
    return examPaperModel.questionSelectionConfig.questionCount;
  }

  return 0;
}
