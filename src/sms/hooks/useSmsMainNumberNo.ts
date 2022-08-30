import { useMemo } from 'react';
import {
  useSmsMainNumberListLimit,
  useSmsMainNumberListPage,
  useSmsMainNumberListViewModel,
} from 'sms/store/SmsMainNumberStore';

export function useSmsMainNumberNo() {
  const smsList = useSmsMainNumberListViewModel();
  const page = useSmsMainNumberListPage();
  const limit = useSmsMainNumberListLimit();
  const smsNo = useMemo(() => {
    if (smsList?.totalCount === undefined || page === undefined || limit === undefined) {
      return 1;
    }

    return smsList.totalCount - (page - 1) * limit;
  }, [smsList?.totalCount, page, limit]);

  return smsNo;
}
