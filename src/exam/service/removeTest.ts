import { removeExamPaper } from '../api/examApi';

export async function removeTest(testId: string) {
  const result = await removeExamPaper(testId);

  return result;
}
