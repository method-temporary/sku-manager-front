import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Form, Select } from 'semantic-ui-react';

import { MemberViewModel } from '@nara.drama/approval';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { alert, AlertModel, FormTable, Modal, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import ManagerListModalView from 'cube/cube/ui/view/ManagerListModal';

import OperatorService from '../../present/logic/OperatorService';
import OperatorModel from '../../model/OperatorModel';
import OperatorQueryModel from '../../model/OperatorQueryModel';

interface Props extends RouteComponentProps {}

interface State {}

interface Injected {
  operatorService: OperatorService;
  sharedService: SharedService;
}

@inject('operatorService', 'sharedService')
@observer
@reactAutobind
class QuestionOperatorCreateModal extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'qna-operator';

  componentDidMount() {
    //
    const { operatorService } = this.injected;
    // operatorService.findAllOperatorGroup();
  }

  init() {
    //
    this.injected.operatorService.clearOperator();
  }

  setSelectOptions(): SelectTypeModel[] {
    //
    const { operatorService } = this.injected;
    const { operatorGroups } = operatorService;
    const options: SelectTypeModel[] = [];

    operatorGroups.forEach((operatorGroup, index) => {
      options.push(new SelectTypeModel(`${index + 1}`, getPolyglotToAnyString(operatorGroup.name), operatorGroup.id));
    });

    return options;
  }

  handleManagerListModalOk(member: MemberViewModel, index: any) {
    //
    this.onChangeOperatorProps('denizenId', member.id);

    this.onChangeOperatorProps('name', getPolyglotToAnyString(member.name));
    this.onChangeOperatorProps('companyName', getPolyglotToAnyString(member.companyName));
    this.onChangeOperatorProps('departmentName', getPolyglotToAnyString(member.departmentName));
    this.onChangeOperatorProps('email', member.email);
  }

  onChangeOperatorProps(name: string, value: any): void {
    //
    const { operatorService } = this.injected;
    operatorService.onChangeOperatorProps(name, value);
  }

  async registerOperator(event: React.MouseEvent<HTMLButtonElement>, close: () => void): Promise<void> {
    //
    const { operatorService, sharedService } = this.injected;
    const { operator, operatorQuery } = operatorService;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    if (operator.operatorGroupId === null || operator.operatorGroupId === '') {
      alert(AlertModel.getRequiredChoiceAlert('담당 조직'));
      return;
    }

    if (operator.denizenId === null || operator.denizenId === '') {
      alert(AlertModel.getRequiredChoiceAlert('문의 담당자'));
      return;
    }

    await operatorService.registerOperator(OperatorModel.asCdo(operator));
    alert(
      AlertModel.getCustomAlert(false, '알림', '문의 담당자가 등록되었습니다', '확인', async () => {
        const offsetElementList = await operatorService.findByRdo(OperatorQueryModel.asRdo(operatorQuery, pageModel));

        sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
        close();
      })
    );
  }

  render() {
    //
    const { operatorService } = this.injected;
    const { operator } = operatorService;

    return (
      <Modal size="large" trigger={<SubActions.CreateButton onClick={this.init} />}>
        <Modal.Header className="res">문의 담당자 추가</Modal.Header>
        <Modal.Content>
          <FormTable title="" withoutHeader>
            <FormTable.Row name="담당 조직">
              <Form.Field
                control={Select}
                options={this.setSelectOptions()}
                placeholder="선택하세요"
                value={operator.operatorGroupId}
                onChange={(e: any, data: any) => this.onChangeOperatorProps('operatorGroupId', data.value)}
              />
            </FormTable.Row>
            <FormTable.Row name="문의 담당자">
              <ManagerListModalView
                handleOk={this.handleManagerListModalOk}
                buttonName="담당자 선택"
                multiSelect={false}
              />
            </FormTable.Row>
            <FormTable.Row name="이름">
              <Form.Field>{operator.name}</Form.Field>
            </FormTable.Row>
            <FormTable.Row name="소속사">
              <Form.Field>{operator.companyName}</Form.Field>
            </FormTable.Row>
            <FormTable.Row name="부서">
              <Form.Field>{operator.departmentName}</Form.Field>
            </FormTable.Row>
            <FormTable.Row name="E-mail">
              <Form.Field>{operator.email}</Form.Field>
            </FormTable.Row>
          </FormTable>
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton className="w190 p">Cancel</Modal.CloseButton>
          <Modal.CloseButton onClickWithClose={this.registerOperator} className="w190">
            OK
          </Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withRouter(QuestionOperatorCreateModal);
