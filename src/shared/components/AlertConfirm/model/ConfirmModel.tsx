import React, { ReactElement } from 'react';
import { Button } from 'semantic-ui-react';

export default class ConfirmModel {
  //
  title: string = '안내';
  message: string = '';
  warning: boolean = false;
  okLabel?: string;
  cancelLabel?: string;
  onOk?: () => void;
  onCancel?: () => void;
  addButton?: ReactElement;

  constructor(
    title: string,
    message: string,
    warning: boolean,
    okLabel: string,
    cancelLabel: string,
    onOk?: () => void,
    onCancel?: () => void,
    addButton?: ReactElement
  ) {
    //
    if (title) this.title = title;
    if (message) this.message = message;
    if (warning) this.warning = warning;
    if (okLabel) this.okLabel = okLabel;
    if (cancelLabel) this.cancelLabel = cancelLabel;
    // if (cancelLabel) this.cancelLabel = cancelLabel;
    if (onOk) this.onOk = onOk;
    if (onCancel) this.onCancel = onCancel;
    if (addButton) this.addButton = addButton;
  }

  static getSaveConfirm(onClickOk: () => void, onClickCancel?: () => void) {
    //
    return new ConfirmModel('저장 안내', '저장하시겠습니까?', false, '저장', '취소', onClickOk, onClickCancel);
  }

  static getRemoveConfirm(onClickOk: () => void, onClickCancel?: () => void) {
    //
    return new ConfirmModel('삭제 안내', '삭제하시겠습니까?', true, '삭제', '취소', onClickOk, onClickCancel);
  }

  static getApprovalConfirm(target: string, onClickOk: () => void, onClickCancel?: () => void) {
    //
    return new ConfirmModel(
      `${target} 승인 안내`,
      `등록된 ${target} 정보에 대해 승인하시겠습니까?`,
      false,
      '승인',
      '취소',
      onClickOk,
      onClickCancel
    );
  }

  static getRequestApprovalConfirm(onClickOk: () => void, onClickCancel?: () => void) {
    //
    return new ConfirmModel(
      '승인 요청 안내',
      '승인요청 하시겠습니까?',
      false,
      '확인',
      '취소',
      onClickOk,
      onClickCancel
    );
  }

  static getApprovalBadgeConfirm(onClickOk: () => void, onClickCancel?: () => void) {
    //
    return new ConfirmModel(
      'Badge 승인',
      '해당 Badge를 승인하시겠습니까? 승인된 Badge는 PC 및 Mobile 내 노출됩니다.',
      false,
      'OK',
      'Cancel',
      onClickOk,
      onClickCancel
    );
  }

  static getOpenApprovalConfirm(onClickOk: () => void, target: string = '', onClickCancel?: () => void) {
    //
    return new ConfirmModel(
      '승인 요청 안내',
      `해당 ${target}을(를) 승인 요청하시겠습니까?`,
      false,
      '요청',
      '취소',
      onClickOk,
      onClickCancel
    );
  }

  static getSaveAndApprovalConfirm(
    onClickSaveAndApproval: () => void,
    onClickOk: () => void,
    onClickCancel?: () => void
  ) {
    //
    const styles = {
      background: '#fff',
      borderTop: '1px solid #ff664d',
      color: '#ff664d',
      boxShadow: 'none',
    };

    return new ConfirmModel(
      '저장 안내',
      '입력하신 프로그램에 대해 승인 요청하시겠습니까?\n' +
        '바로 승인 요청을 하지 않아도 원하시는 시점에 승인 요청을 하실 수 있습니다.',
      false,
      '저장',
      '취소',
      onClickOk,
      onClickCancel,
      (
        <Button style={styles} onClick={onClickSaveAndApproval}>
          저장 및 승인요청
        </Button>
      )
    );
  }

  static getCustomConfirm(
    title: string,
    message: string,
    warning: boolean,
    okLabel: string,
    cancelLabel: string,
    onOk?: () => void,
    onCancel?: () => void,
    addButton?: ReactElement
  ) {
    //
    return new ConfirmModel(title, message, warning, okLabel, cancelLabel, onOk, onCancel, addButton);
  }
}
