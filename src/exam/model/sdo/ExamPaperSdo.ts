import { QuestionSelectionType } from '../QuestionSelectionType';
import { QuestionGroup, TestCreateFormViewModel } from '../../viewmodel/TestCreateFormViewModel';
import { Question } from '../../viewmodel/TestSheetViewModel';

export interface ExamPaperSdo {
  authorName: string;
  description: string;
  language: string;
  examQuestions: Question[];
  finalCopy: boolean;
  questionSelectionConfig?: SdoQuestionSelectionConfig;
  questionSelectionType?: QuestionSelectionType;
  successPoint?: number;
  title: string;
  totalPoint?: number;
  applyLimit: number;
}

export const getExamPaperSdoByTestCreateFormViewModel = (
  testCreateFormModel: TestCreateFormViewModel,
  isQuestions?: 'create' | 'update'
): ExamPaperSdo => {
  //
  // QuestionSelectionType 에 해당하는 Config Data 만 추출
  const questionSelectionType = testCreateFormModel.questionSelectionType;
  const questionSelectionConfig = getInitialSdoQuestionSelectionConfig();
  const prevQuestionSelectionConfig = testCreateFormModel.questionSelectionConfig;

  let examQuestions: Question[] = [];

  if (questionSelectionType !== QuestionSelectionType.BY_GROUP) {
    const questions = testCreateFormModel.newQuestions;

    questions.forEach((question) => {
      question.groupName = '';
      examQuestions.push(question);
    });
  } else {
    examQuestions = testCreateFormModel.newQuestions;
  }

  if (isQuestions) {
    if (isQuestions === 'create') {
      return {
        authorName: testCreateFormModel.authorName,
        description: testCreateFormModel.description,
        language: testCreateFormModel.language,
        examQuestions,
        finalCopy: testCreateFormModel.finalCopy,
        questionSelectionConfig,
        questionSelectionType: QuestionSelectionType.BY_GROUP,
        successPoint: 0,
        title: testCreateFormModel.title,
        totalPoint: 0,
        applyLimit: Number(testCreateFormModel.applyLimit),
      };
    } else {
      return {
        authorName: testCreateFormModel.authorName,
        description: testCreateFormModel.description,
        language: testCreateFormModel.language,
        examQuestions,
        finalCopy: testCreateFormModel.finalCopy,
        title: testCreateFormModel.title,
        applyLimit: Number(testCreateFormModel.applyLimit),
      };
    }
  }

  if (questionSelectionType === QuestionSelectionType.ALL) {
    questionSelectionConfig.enableShuffle = prevQuestionSelectionConfig.enableShuffle;
  } else if (questionSelectionType === QuestionSelectionType.BY_GROUP) {
    const groups = prevQuestionSelectionConfig.questionGroups.map((questionGroup) =>
      getSdoQuestionGroupByQuestionGroup(questionGroup)
    );

    // 미지정 그룹이 맨 뒤로 가도록
    questionSelectionConfig.questionGroups = groups
      .filter((group) => group.name !== '')
      .concat(groups.filter((group) => group.name === ''));
  } else if (questionSelectionType === QuestionSelectionType.FIXED_COUNT) {
    questionSelectionConfig.questionCount = Number(prevQuestionSelectionConfig.questionCount);
    questionSelectionConfig.pointPerQuestion = Number(prevQuestionSelectionConfig.pointPerQuestion);
  }

  return {
    authorName: testCreateFormModel.authorName,
    description: testCreateFormModel.description,
    language: testCreateFormModel.language,
    examQuestions,
    finalCopy: testCreateFormModel.finalCopy,
    questionSelectionConfig,
    questionSelectionType: testCreateFormModel.questionSelectionType,
    successPoint: Number(testCreateFormModel.successPoint),
    title: testCreateFormModel.title,
    totalPoint: testCreateFormModel.totalPoint,
    applyLimit: Number(testCreateFormModel.applyLimit),
  };
};

interface SdoQuestionSelectionConfig {
  enableShuffle: boolean;
  questionGroups: SdoQuestionGroup[];
  pointPerQuestion: number;
  questionCount: number;
}

function getInitialSdoQuestionSelectionConfig(): SdoQuestionSelectionConfig {
  return {
    enableShuffle: true,
    questionGroups: [getInitialSdoQuestionGroup()],
    pointPerQuestion: 0,
    questionCount: 0,
  };
}

interface SdoQuestionGroup {
  name: string;
  pointPerGroup: number;
  questionCount: number;
}

function getInitialSdoQuestionGroup(): SdoQuestionGroup {
  return {
    name: '',
    pointPerGroup: 0,
    questionCount: 0,
  };
}

function getSdoQuestionGroupByQuestionGroup(questionGroup: QuestionGroup): SdoQuestionGroup {
  return {
    name: questionGroup.name,
    pointPerGroup: Number(questionGroup.pointPerGroup),
    questionCount: Number(questionGroup.questionCount),
  };
}
