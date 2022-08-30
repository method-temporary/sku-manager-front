import React from 'react';
import { Button, Container, Divider, Header } from 'semantic-ui-react';
import { alert, confirm, AlertModel, ConfirmModel } from '../components/AlertConfirm';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

interface Props {}

@observer
@reactAutobind
class AlertConfirmExample extends ReactComponent<Props> {
  //
  saveSuccessAlert() {
    //
    alert(AlertModel.getSaveSuccessAlert());
  }

  removeSuccessAlert() {
    //
    alert(AlertModel.getRemoveSuccessAlert());
  }

  approvalSuccessAlert() {
    //
    alert(AlertModel.getApprovalSuccessAlert());
  }

  getRequestApprovalSuccessAlert() {
    //
    alert(AlertModel.getOpenApprovalSuccessAlert());
  }

  requiredInputAlert() {
    //
    alert(AlertModel.getRequiredInputAlert('항목 이름'));
  }

  requiredChoiceAlert() {
    //
    alert(AlertModel.getRequiredChoiceAlert('항목 이름'));
  }

  overlapAlert() {
    //
    alert(AlertModel.getOverlapAlert('항목 이름'));
  }

  customWarningAlert() {
    //
    alert(AlertModel.getCustomAlert(true, '타이틀', '메시지', '버튼명', () => {}));
  }

  customInfoAlert() {
    //
    alert(
      AlertModel.getCustomAlert(
        false,
        '타이틀',
        '메시지',
        '버튼명',
        () => {},
        'ajsdfklajsfkldasjfkajeklfjasdklfja klfjdklsjf akldsjfa klsdjfla sdfij aeklaiefjkalsd;faiejfkl;'
      )
    );
  }

  saveConfirm() {
    //
    confirm(ConfirmModel.getSaveConfirm(this.saveSuccessAlert));
  }

  removeConfirm() {
    //
    confirm(ConfirmModel.getRemoveConfirm(this.removeSuccessAlert), false);
  }

  approvalConfirm() {
    //
    confirm(ConfirmModel.getApprovalConfirm('이름', this.approvalSuccessAlert), false);
  }

  requestApprovalConfirm() {
    //
    confirm(ConfirmModel.getRequestApprovalConfirm(this.getRequestApprovalSuccessAlert), false);
  }

  saveAndApprovalConfirm() {
    //
    confirm(
      ConfirmModel.getSaveAndApprovalConfirm(
        () => {},
        () => {}
      )
    );
  }

  render() {
    //
    return (
      <Container fluid>
        <Header size="large">Alert</Header>

        <Header size="small">저장 안내</Header>
        <Button onClick={this.saveSuccessAlert}>저장</Button>

        <Header size="small">삭제 안내</Header>
        <Button onClick={this.removeSuccessAlert}>삭제</Button>

        <Header size="small">승인 안내</Header>
        <Button onClick={this.approvalSuccessAlert}>승인</Button>

        <Header size="small">필수 정보 입력 안내</Header>
        <Button onClick={this.requiredInputAlert}>필수 입력</Button>

        <Header size="small">필수 선택 안내( Radio, CheckBox )</Header>
        <Button onClick={this.requiredChoiceAlert}>필수 선택</Button>

        <Header size="small">중복 안내</Header>
        <Button onClick={this.overlapAlert}>중복 체크</Button>

        <Header size="small">Custom 경고 안내</Header>
        <Button onClick={this.customWarningAlert}>경고</Button>

        <Header size="small">Custom 정보 안내</Header>
        <Button onClick={this.customInfoAlert}>정보</Button>

        <Divider />
        <Header size="large">Confirm</Header>

        <Header size="small">저장 안내</Header>
        <Button onClick={this.saveConfirm}>저장</Button>

        <Header size="small">삭제 안내</Header>
        <Button onClick={this.removeConfirm}>삭제</Button>

        <Header size="small">승인 안내</Header>
        <Button onClick={this.approvalConfirm}>승인</Button>

        <Header size="small">승인 요청 안내</Header>
        <Button onClick={this.requestApprovalConfirm}>승인요청</Button>

        <Header size="small">승인 안내</Header>
        <Button onClick={this.saveAndApprovalConfirm}>저장 후 승인</Button>
      </Container>
    );
  }
}

export default AlertConfirmExample;
