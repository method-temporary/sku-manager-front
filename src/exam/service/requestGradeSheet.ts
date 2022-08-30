import { setGradeSheetViewModel } from 'exam/store/GradeSheetStore';
import {
  EssayScore,
  GradeSheetViewModel,
  ObtainedScore,
  Question,
  QuestionSelectionInfo,
  TestInfo,
} from 'exam/viewmodel/GradeSheetViewModel';
import { findAnswerSheetDetail } from 'exam/api/examApi';
import { AnswerSheetModel } from 'exam/model/AnswerSheetModel';
import { ExamPaperModel } from 'exam/model/ExamPaperModel';
import { ExamQuestionModel, getAnswerScore, getChoiceScore } from 'exam/model/ExamQuestionModel';
import { ItemAnswer } from 'exam/model/ItemAnswer';
import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';

export async function requestGradeSheet(studentDenizenId: string, lectureId: string) {
  const answerSheetDetail = await findAnswerSheetDetail(studentDenizenId, lectureId);

  if (answerSheetDetail === undefined) {
    return;
  }

  const gradeSheetViewModel = createGradeSheetViewModel(
    answerSheetDetail.examPaper,
    answerSheetDetail.examQuestions,
    answerSheetDetail.answerSheet
  );

  setGradeSheetViewModel(gradeSheetViewModel);
}

function createGradeSheetViewModel(
  examPaper: ExamPaperModel,
  examQuestions: ExamQuestionModel[],
  answerSheet: AnswerSheetModel
): GradeSheetViewModel {
  const choiceScore = getChoiceScore(examQuestions);
  const answerScore = getAnswerScore(examQuestions);

  const answerMap = new Map<number, ItemAnswer>();
  answerSheet.answers.forEach((a) => {
    answerMap.set(a.sequence, a);
  });

  let totalObtainedChoiceScore = 0;
  let totalObtainedShortAnswerScore = 0;
  let totalObtainedEssayScore = 0;
  const essayScores: EssayScore[] = [];

  const questions: Question[] = examQuestions.map((q) => {
    const answer = answerMap.get(q.sequence);
    const examineeAnswer = answer?.answer || '';
    const isCorrect = answer?.obtainedScore === q.point;

    if (q.questionType === 'ShortAnswer') {
      totalObtainedShortAnswerScore += answer?.obtainedScore || 0;
    } else if (q.questionType === 'Essay') {
      totalObtainedEssayScore += answer?.obtainedScore || 0;
    } else if (q.questionType === 'SingleChoice' || q.questionType === 'MultiChoice') {
      totalObtainedChoiceScore += answer?.obtainedScore || 0;
    }

    if (q.questionType === 'Essay') {
      essayScores.push({
        questionNo: q.sequence,
        allocatedPoint: q.point,
        score: answer?.obtainedScore || 0,
      });
    }

    return {
      sequence: q.sequence,
      questionType: q.questionType,
      groupName: q.groupName,
      mandatory: q.mandatory,
      point: String(q.point),
      question: q.question,
      items: q.items,
      imagePath: q.imagePath,
      questionAnswer: q.questionAnswer,
      examineeAnswer,
      isCorrect,
    };
  });
  const testInfo: TestInfo = {
    title: examPaper.title,
    authorName: examPaper.authorName,
    description: examPaper.description,
  };

  const questionSelectionInfo: QuestionSelectionInfo = {
    questionSelectionTypeText: QuestionSelectionTypeText[examPaper.questionSelectionType],
    questionCount: examPaper.questionSelectionType === 'ALL' ? examQuestions.length : getQuestionCount(examPaper),
    successPoint: examPaper.successPoint,
    totalPoint: examPaper.totalPoint,
    choiceScore,
    answerScore,
  };

  const obtainedScore: ObtainedScore = {
    choiceScore: totalObtainedChoiceScore,
    shortAnswerScore: totalObtainedShortAnswerScore,
    essayScore: totalObtainedEssayScore,
  };

  return {
    id: answerSheet.id,
    testInfo,
    questionSelectionInfo,
    questions,
    obtainedScore,
    essayScores,
    graderComment: answerSheet.graderComment || '',
  };
}

function getQuestionCount(examPaperModel: ExamPaperModel): number {
  if (examPaperModel.questionSelectionType === 'BY_GROUP') {
    return examPaperModel.questionSelectionConfig.questionGroups.map((g) => g.questionCount).reduce((a, b) => a + b, 0);
  } else if (examPaperModel.questionSelectionType === 'FIXED_COUNT') {
    return examPaperModel.questionSelectionConfig.questionCount;
  }

  return 0;
}
