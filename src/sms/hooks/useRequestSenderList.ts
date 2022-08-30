import { useEffect } from 'react';
import { onChangePage } from 'sms/event/smsSenderEvent';
import { getSenderRdo } from 'sms/model/SenderRdo';
import { requestSmsSenderList } from 'sms/service/requestSmsSenderList';
import { getSmsSenderSearchBoxViewModel, useSmsSenderListLimit, useSmsSenderListPage } from 'sms/store/SmsSenderStore';

export function useRequestSenderList() {
  const page = useSmsSenderListPage();
  const limit = useSmsSenderListLimit();

  useEffect(() => {
    const smsSearchBox = getSmsSenderSearchBoxViewModel();
    if (smsSearchBox === undefined || limit === undefined) {
      return;
    }
    const sentSmsRdo = getSenderRdo(smsSearchBox);
    requestSmsSenderList(sentSmsRdo);
  }, [limit]);

  useEffect(() => {
    onChangePage();
  }, [page]);
}
