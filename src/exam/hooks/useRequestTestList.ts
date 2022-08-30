import { useTestListLimit } from 'exam/store/TestListLimitStore';
import { useTestListPage } from 'exam/store/TestListPageStore';
import { useEffect } from 'react';
import { requestTestList } from '../service/requestTestList';

export function useRequestTestList() {
  const testListPage = useTestListPage();
  const testListLimit = useTestListLimit();
  useEffect(() => {
    if (testListPage === undefined || testListLimit === undefined) {
      return;
    }
    const offset = (testListPage - 1) * testListLimit;
    requestTestList(offset, testListLimit);
  }, [testListPage, testListLimit]);
}
