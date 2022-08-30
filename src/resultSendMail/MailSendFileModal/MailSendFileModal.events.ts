import { setMailSendFileModal } from "./MailSendFileModal.stores";

export function onOpenModal() {
  setMailSendFileModal({
    isOpen: true,
  });
}

export function onCloseModal() {
  setMailSendFileModal({
    isOpen: false,
  });
}