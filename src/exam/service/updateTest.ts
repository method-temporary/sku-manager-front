import { getTestCreateFormViewModel } from 'exam/store/TestCreateFormStore';
import { updateExamPaper, updateExamPaperFinalCopy } from '../api/examApi';
import { getExamPaperSdoByTestCreateFormViewModel } from '../model/sdo/ExamPaperSdo';

export async function updateTestFinalCopy(id: string): Promise<string | undefined> {
  const testCreateFormModal = getTestCreateFormViewModel();
  if (testCreateFormModal === undefined) return undefined;

  return updateExamPaperFinalCopy(id);
}

export async function updateTest(testId: string, isQuestions?: 'update'): Promise<string | undefined> {
  const testCreateFormModal = getTestCreateFormViewModel();
  if (testCreateFormModal === undefined) return undefined;

  const examPaperSdo = getExamPaperSdoByTestCreateFormViewModel(testCreateFormModal, isQuestions);

  return updateExamPaper(testId, examPaperSdo);
}
