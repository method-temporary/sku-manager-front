import { setSmsModalViewModel } from "sms/store/SmsModalStore";

export function onModalClose() {
  setSmsModalViewModel({
    isOpen: false,
  });
}