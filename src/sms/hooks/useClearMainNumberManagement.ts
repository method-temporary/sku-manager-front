import { useEffect } from 'react';
import {
  setSmsMainNumberListLimit,
  setSmsMainNumberListPage,
  setSmsMainNumberListViewModel,
  setSmsMainNumberSearchBoxViewModel,
} from 'sms/store/SmsMainNumberStore';
import { initSmsMainNumberSearchBoxViewModel } from 'sms/viewmodel/SmsMainNumberViewModel';

export function useClearMainNumberManagement() {
  useEffect(() => {
    setSmsMainNumberSearchBoxViewModel(initSmsMainNumberSearchBoxViewModel());
    setSmsMainNumberListViewModel({ results: [], totalCount: 0 });
    setSmsMainNumberListPage(1);
    setSmsMainNumberListLimit(20);
  }, []);
}
