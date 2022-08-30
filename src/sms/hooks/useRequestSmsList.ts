import { useEffect } from "react";
import { getSentSmsRdo } from "sms/model/SentSmsRdo";
import { requestSmsList } from "sms/service/requestSmsList";
import { useSmsListLimit } from "sms/store/SmsListLimitStore";
import { useSmsListPage } from "sms/store/SmsListPageStore";
import { getSmsSearchBoxViewModel } from "sms/store/SmsSearchBoxStore";

export function useRequestSmsList() {
  const page = useSmsListPage();
  const limit = useSmsListLimit();

  useEffect(() => {
    if (page === undefined || limit === undefined) {
      return;
    }
    const smsSearchBox = getSmsSearchBoxViewModel();
    if (smsSearchBox === undefined) {
      return;
    }
    const offset = (page - 1) * limit;
    const sentSmsRdo = getSentSmsRdo(smsSearchBox, offset, limit);
    requestSmsList(sentSmsRdo);
  }, [page, limit]);
}