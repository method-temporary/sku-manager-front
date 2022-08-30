export default class AlertModel {
  //
  title: string = '알림';
  message: string = '';
  warning?: boolean = false;
  closeLabel?: string;
  onClose?: () => void;
  addInfo?: string;

  constructor(
    warning?: boolean,
    title?: string,
    message?: string,
    closeLabel?: string,
    onClose?: () => void,
    addInfo?: string
  ) {
    //
    if (warning) this.warning = warning;
    if (title) this.title = title;
    if (message) this.message = message;
    if (closeLabel) this.closeLabel = closeLabel;
    if (onClose) this.onClose = onClose;
    if (addInfo) this.addInfo = addInfo;
  }

  static getErrorAxios() {
    //
    return new AlertModel(true, '오류 안내', '예상치 못한 오류가 발생했습니다. 관리자에게 문의하세요.', '확인');
  }

  static getSaveSuccessAlert(onClose?: () => void) {
    //
    return new AlertModel(false, '저장 안내', '저장되었습니다.', '', onClose);
  }

  static getRemoveSuccessAlert(onClose?: () => void) {
    //
    return new AlertModel(false, '삭제 안내', '삭제되었습니다.', '', onClose);
  }

  static getApprovalSuccessAlert(onClose?: () => void) {
    //
    return new AlertModel(false, '승인 안내', '승인되었습니다.', '', onClose);
  }

  static getOpenApprovalSuccessAlert(onClose?: () => void) {
    //
    return new AlertModel(false, '승인 요청 안내', '승인 요청 되었습니다.', '', onClose);
  }

  static getRequiredInputAlert(required: string, onClose?: () => void) {
    //
    return new AlertModel(true, '필수 정보 입력 안내', `${required}은(는) 필수 입력 항목입니다.`, '', onClose);
  }

  static getRequiredChoiceAlert(required: string, onClose?: () => void) {
    //
    return new AlertModel(true, '필수 선택 안내', `${required}을(를) 선택해주세요.`, '', onClose);
  }

  static getOverlapAlert(overlap: string, onClose?: () => void) {
    //
    return new AlertModel(true, `${overlap} 중복 안내`, `이미 같은 ${overlap}이(가) 있습니다.`, '', onClose);
  }

  static getCustomAlert(
    warning: boolean,
    title: string,
    message: string,
    closeLabel: string,
    onClose?: () => void,
    addInfo?: string
  ) {
    //
    return new AlertModel(warning, title, message, closeLabel, onClose, addInfo);
  }
}
