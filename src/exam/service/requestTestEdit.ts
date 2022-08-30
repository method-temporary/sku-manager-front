import { setTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { Question } from 'exam/viewmodel/TestSheetViewModel';
import { findExamPaper, findExamQuestions } from '../api/examApi';
import { QuestionGroup, QuestionSelectionConfig } from '../viewmodel/TestCreateFormViewModel';
import MemberApi from '../../_data/approval/members/api/MemberApi';

export async function requestTestEdit(testId: string) {
  const examPaperModel = await findExamPaper(testId);
  const examQuestionModels = await findExamQuestions(testId);
  const memberApi = MemberApi.instance;

  if (examPaperModel === undefined || examQuestionModels === undefined) {
    return;
  }

  const denizenId = getDenizenId(examPaperModel.patronKey.keyString);
  let email = '';
  try {
    const member = await memberApi.findMemberById(denizenId);
    email = member.email;
  } catch (error) {
    console.error('error :: ', error);
  }

  const newQuestions: Question[] = examQuestionModels.map((q) => {
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

  const questionGroups: QuestionGroup[] = examPaperModel.questionSelectionConfig.questionGroups?.map((group) => {
    return {
      name: group.name,
      pointPerGroup: String(group.pointPerGroup),
      questionCount: String(group.questionCount),
      mandatoryCount: 0,
      totalQuestionCount: 0,
    };
  });

  const questionSelectionConfig: QuestionSelectionConfig = {
    enableShuffle: examPaperModel.questionSelectionConfig.enableShuffle,
    pointPerQuestion: String(examPaperModel.questionSelectionConfig.pointPerQuestion),
    questionCount: String(examPaperModel.questionSelectionConfig.questionCount),
    questionGroups,
  };

  setTestCreateFormViewModel({
    id: examPaperModel.id,
    finalCopy: examPaperModel.finalCopy,
    title: examPaperModel.title,
    description: examPaperModel.description || '',
    applyLimit: String(examPaperModel.applyLimit),
    authorName: examPaperModel.authorName,
    language: examPaperModel.language,
    email,
    newQuestions,
    questionSelectionType: examPaperModel.questionSelectionType,
    questionSelectionConfig,
    successPoint: String(examPaperModel.successPoint),
    totalPoint: examPaperModel.totalPoint,
    stepIndex: 1,
    questionCount: 0,
    mandatoryCount: 0,
    totalQuestionCount: 0,
  });
}

function getDenizenId(key_string: string): string {
  //
  return key_string
    .substring(0, key_string.indexOf('-'))
    .concat(key_string.substring(key_string.indexOf('@'), key_string.lastIndexOf('-')));
}
