import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Container, Form, Input, ModalProps } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { PolyglotModel } from 'shared/model';
import { alert, AlertModel, confirm, ConfirmModel, FormTable, Modal } from 'shared/components';
import { Language, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { getNonGdiMemberCitizenUdo, getNonGdiMemberCitizenCdo } from 'userworkspace/shared/util/userworkspace.util';
import UserWorkspaceService from '../../present/logic/UserWorkspaceService';
import { NonGdiMemberSdo } from '../../model/dto/NonGdiMemberSdo';
import { Alert } from 'shared/components/AlertConfirm/AlertConfirm';

interface Props extends ModalProps {
  onMount?: () => Promise<boolean>;
  selectedMemberCheck?: () => boolean;
  findUserWorkspaceAccount: () => void;

  text: string;
  memberId?: string;
}

interface States {}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
}

@inject('userWorkspaceService')
@observer
@reactAutobind
class UserWorkspaceAccountDetailModal extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {}

  onChangeMemberProps(name: string, value: any) {
    //
    const { userWorkspaceService } = this.injected;
    if (name === 'departmentName') {
      const departmentName = new PolyglotModel();
      departmentName.setValue(Language.Ko, value);
      userWorkspaceService.changeMemberProps(name, departmentName);
    } else if (name === 'name') {
      const nameValue = new PolyglotModel();
      nameValue.setValue(Language.Ko, value);
      userWorkspaceService.changeMemberProps(name, nameValue);
    } else {
      userWorkspaceService.changeMemberProps(name, value);
    }
  }

  async findMemberById(): Promise<void> {
    //
    if (this.props.memberId) {
      const { userWorkspaceService } = this.injected;
      await userWorkspaceService.findMemberById(this.props.memberId);
    }
  }

  async onMount() {
    //
    if (this.props.onMount) {
      if (!(await this.props.onMount())) {
        //
      }
    } else {
      this.injected.userWorkspaceService.clearMember();
    }
  }

  async onSave(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, close: () => void): Promise<void> {
    //
    const { userWorkspaceService } = this.injected;
    const { userWorkspace, member } = userWorkspaceService;

    if (this.props.memberId) {
      //
      const udo = getNonGdiMemberCitizenUdo(userWorkspace, member);
      if (this.validationCheck(udo.nonGdiMemberSdo, udo.companyCode)) {
        confirm(
          ConfirmModel.getSaveConfirm(async () => {
            await userWorkspaceService.modifyNonGdiMemberCitizen(udo);
            await this.props.findUserWorkspaceAccount();
            close();
          })
        );
      }
    } else {
      //
      const cdo = getNonGdiMemberCitizenCdo(userWorkspace, member);
      if (this.validationCheck(cdo.nonGdiMemberSdo, cdo.companyCode)) {
        confirm(
          ConfirmModel.getSaveConfirm(async () => {
            const returnValue = (await userWorkspaceService.registerNonGdiMemberCitizen(cdo)) as any;
            if (
              returnValue &&
              returnValue.headers &&
              returnValue.headers['x-message-code'] === 'CitizenEmailAlreadyExists'
            ) {
              alert(
                new AlertModel(
                  false,
                  '중복등록',
                  `${getPolyglotToAnyString(userWorkspace.name)} 에 이미 등록된 이메일 주소입니다.`
                )
              );
              close();
            }
            await this.props.findUserWorkspaceAccount();
            close();
          })
        );
      }
    }
  }

  validationCheck(member: NonGdiMemberSdo, companyCode: string): boolean {
    //
    let validation = '';
    if (!member.name) {
      validation = '이름을 입력해 주세요.';
    }
    if (!member.email) {
      validation = '이메일 입력해 주세요.';
    }
    if (!member.usid) {
      validation = '사번을 입력해주세요.';
    }
    if (!member.phone) {
      validation = '연락처를 입력해주세요.';
    }
    if (!member.departmentName) {
      validation = '소속부서를 입력해주세요.';
    }
    if (companyCode === 'SUNIEDU' && member.email) {
      if (/^.*@sk.com$/.test(member.email.toLowerCase())) {
        validation = 'Suni_Edu 소속은 @sk.com 이메일을 사용할 수 없습니다.';
      }
    }
    if (validation !== '') {
      alert(AlertModel.getCustomAlert(true, '사용자 계정 저장', validation, '확인'));
      return false;
    }

    return true;
  }

  render() {
    //
    const { text, memberId, selectedMemberCheck } = this.props;
    const { userWorkspaceService } = this.injected;
    const { member } = userWorkspaceService;

    return (
      <Modal
        size="large"
        triggerAs="a"
        trigger={
          <Button
            disabled={memberId === '' && !memberId}
            onClick={() => selectedMemberCheck}
            style={{ margin: '0 0.25rem 0 0' }}
          >
            {text}
          </Button>
        }
        modSuper={memberId === '' && !memberId}
        onMount={this.onMount}
      >
        <Modal.Header className="res"> {`사용자 계정 ${text}`}</Modal.Header>
        <Modal.Content className="fit-layout">
          <Container fluid>
            <FormTable title="사용자 계정 정보">
              <FormTable.Row name="성명" required>
                <Form.Field
                  width={16}
                  control={Input}
                  value={getPolyglotToAnyString(member.name)}
                  onChange={(e: any, data: any) => this.onChangeMemberProps('name', data.value)}
                />
              </FormTable.Row>
              <FormTable.Row name="사번" required>
                <Form.Field
                  width={16}
                  control={Input}
                  value={member.employeeId}
                  onChange={(e: any, data: any) => this.onChangeMemberProps('employeeId', data.value)}
                />
              </FormTable.Row>
              <FormTable.Row name="연락처" required>
                <Form.Field
                  width={16}
                  control={Input}
                  value={member.phone}
                  onChange={(e: any, data: any) => this.onChangeMemberProps('phone', data.value)}
                />
              </FormTable.Row>
              <FormTable.Row name="이메일" required>
                <Form.Field
                  width={16}
                  control={Input}
                  value={member.email}
                  onChange={(e: any, data: any) => this.onChangeMemberProps('email', data.value)}
                />
              </FormTable.Row>
              <FormTable.Row name="소속 부서" required>
                <Form.Field
                  width={16}
                  control={Input}
                  value={getPolyglotToAnyString(member.departmentName)}
                  onChange={(e: any, data: any) => this.onChangeMemberProps('departmentName', data.value)}
                />
              </FormTable.Row>
            </FormTable>
          </Container>
          {/*<SubActions form>*/}
          {/*  <SubActions.Center>*/}
          {/*    <Modal.CloseButton>Cancel</Modal.CloseButton>*/}
          {/*    <Modal.CloseButton onClick={() => this.onSave()}>{text}</Modal.CloseButton>*/}
          {/*  </SubActions.Center>*/}
          {/*</SubActions>*/}
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton>취소</Modal.CloseButton>
          <Modal.CloseButton onClickWithClose={this.onSave}>{text}</Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default UserWorkspaceAccountDetailModal;
