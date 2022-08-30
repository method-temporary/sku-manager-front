import { reactAlert } from '@nara.platform/accent';
import { getTestCopyFormViewModel, setTestCopyFormViewModel } from 'exam/store/TestCopyFormStore';

export function handleCopyExamPaperError(error: any): undefined {
  if (error.response.status === 409) {
    reactAlert({
      title: '안내',
      message: error.response.data.message,
    });
  }

  const testCopyFormViewModel = getTestCopyFormViewModel();
  if (testCopyFormViewModel === undefined) {
    return undefined;
  }

  setTestCopyFormViewModel({
    ...testCopyFormViewModel,
    isOpen: false,
  });

  return undefined;
}
