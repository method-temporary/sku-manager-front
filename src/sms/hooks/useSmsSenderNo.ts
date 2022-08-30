import { useMemo } from 'react';
import { useSmsSenderListLimit, useSmsSenderListPage, useSmsSenderDisplayListViewModel } from 'sms/store/SmsSenderStore';

export function useSmsSenderNo() {
  const smsList = useSmsSenderDisplayListViewModel();
  const page = useSmsSenderListPage();
  const limit = useSmsSenderListLimit();
  const smsNo = useMemo(() => {
    if (smsList?.totalCount === undefined || page === undefined || limit === undefined) {
      return 1;
    }

    return smsList.totalCount - (page - 1) * limit;
  }, [smsList?.totalCount, page, limit]);

  return smsNo;
}
