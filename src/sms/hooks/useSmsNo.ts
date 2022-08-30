import { useMemo } from "react";
import { useSmsListLimit } from "sms/store/SmsListLimitStore";
import { useSmsListPage } from "sms/store/SmsListPageStore";
import { useSmsListViewModel } from "sms/store/SmsListStore";

export function useSmsNo() {
  const smsList = useSmsListViewModel();
  const page = useSmsListPage();
  const limit = useSmsListLimit();
  const smsNo = useMemo(() => {
    if(smsList?.totalCount === undefined || page === undefined || limit === undefined) {
      return 1;
    }

    return smsList.totalCount - ((page - 1) * limit);
  }, [smsList?.totalCount, page, limit]);
  
  return smsNo;
}