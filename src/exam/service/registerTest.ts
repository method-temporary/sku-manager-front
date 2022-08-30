import { getTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { getExamPaperSdoByTestCreateFormViewModel } from '../model/sdo/ExamPaperSdo';
import { registerExamPaper } from '../api/examApi';

export async function registerTest(isQuestions?: 'create'): Promise<string | undefined> {
  const testCreateFormModal = getTestCreateFormViewModel();
  if (testCreateFormModal === undefined) return undefined;

  const examPaperSdo = getExamPaperSdoByTestCreateFormViewModel(testCreateFormModal, isQuestions);

  return registerExamPaper(examPaperSdo);
}
