import { useEffect } from 'react';
import {
  initSmsSenderListLimit,
  setSmsSenderCondListViewModel,
  setSmsSenderDisplayListViewModel,
  setSmsSenderListLimit,
  setSmsSenderListPage,
  setSmsSenderListViewModel,
  setSmsSenderSearchBoxViewModel,
} from 'sms/store/SmsSenderStore';
import { initSmsSenderSearchBoxViewModel } from 'sms/viewmodel/SmsSenderViewModel';

export function useClearSenderManagement() {
  useEffect(() => {
    setSmsSenderSearchBoxViewModel(initSmsSenderSearchBoxViewModel());
    setSmsSenderListViewModel({ results: [], totalCount: 0 });
    setSmsSenderCondListViewModel({ results: [], totalCount: 0 });
    setSmsSenderDisplayListViewModel({ results: [], totalCount: 0 });
    setSmsSenderListPage(1);
    setSmsSenderListLimit(initSmsSenderListLimit);
  }, []);
}
