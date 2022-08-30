import { getTestCreateFormViewModel } from '../store/TestCreateFormStore';
import { checkDuplicateExamPaperTitle } from '../api/examApi';
import { encodingUrlBrackets } from 'shared/helper';

export async function checkDuplicateTest() {
  const testCreateFormModal = getTestCreateFormViewModel();
  if (testCreateFormModal === undefined) return undefined;

  return checkDuplicateExamPaperTitle(encodingUrlBrackets(testCreateFormModal.title), testCreateFormModal.id);
}
