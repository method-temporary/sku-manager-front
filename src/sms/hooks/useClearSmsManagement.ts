import { useEffect } from "react";
import { setSmsListLimit } from "sms/store/SmsListLimitStore";
import { setSmsListPage } from "sms/store/SmsListPageStore";
import { setSmsListViewModel } from "sms/store/SmsListStore";
import { setSmsSearchBoxViewModel } from "sms/store/SmsSearchBoxStore";
import { initSmsListViewModel } from "sms/viewmodel/SmsListViewModel";
import { initSmsSearchBoxViewModel } from "sms/viewmodel/SmsSearchBoxViewModel";

export function useClearSmsManagement() {
  useEffect(() => {
    setSmsSearchBoxViewModel(initSmsSearchBoxViewModel());
    setSmsListViewModel(initSmsListViewModel());
    setSmsListPage(1);
    setSmsListLimit(20);
  }, []);
}