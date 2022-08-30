import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import OperatorWithUserIdentity from '../../model/sdo/OperatorWithUserIdentity';

interface Props {
  getOperatorGroupName: (id: string) => string;
  onClickOperatorCheckBox: (id: string) => void;
  onClickAllCheckBox: (value: boolean) => void;
  onClickOperatorCheckBoxInModal?: (operator: OperatorWithUserIdentity) => void;
  onClickAllOperatorCheckBixInModal?: (value: boolean) => void;

  operators: OperatorWithUserIdentity[];
  selectedOperatorIds: string[];
  startNo: number;
  isModal?: boolean;
}

@observer
@reactAutobind
class QuestOperatorListView extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const {
      getOperatorGroupName,
      onClickOperatorCheckBox,
      onClickAllCheckBox,
      onClickOperatorCheckBoxInModal,
      onClickAllOperatorCheckBixInModal,
    } = this.props;
    const { operators, selectedOperatorIds, startNo, isModal } = this.props;
    const allChecked =
      (selectedOperatorIds.length > 0 &&
        isModal &&
        operators.filter((target) => !selectedOperatorIds.includes(target.operator.denizenId)).length === 0) ||
      operators.filter((target) => !selectedOperatorIds.includes(target.operator.id)).length === 0;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="7%" />
          <col width="13%" />
          <col width="13%" />
          <col width="13%" />
          <col width="13%" />
          <col />
          <col width="13%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={allChecked}
                onChange={() =>
                  (isModal && onClickAllOperatorCheckBixInModal && onClickAllOperatorCheckBixInModal(!allChecked)) ||
                  onClickAllCheckBox(!allChecked)
                }
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> 담당조직</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> 이름</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> 소속사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> 부서</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> E-mail</Table.HeaderCell>
            <Table.HeaderCell textAlign="center"> 등록일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(operators &&
            operators.length > 0 &&
            operators.map((operatorWithUserIdentity, index) => {
              const { operator, userIdentity } = operatorWithUserIdentity;

              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">
                    <Form.Field
                      control={Checkbox}
                      checked={
                        (isModal && selectedOperatorIds.includes(operator.denizenId)) ||
                        selectedOperatorIds.includes(operator.id)
                      }
                      onChange={() =>
                        (isModal &&
                          onClickOperatorCheckBoxInModal &&
                          onClickOperatorCheckBoxInModal(operatorWithUserIdentity)) ||
                        onClickOperatorCheckBox(operator.id)
                      }
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell textAlign="center">{getOperatorGroupName(operator.operatorGroupId)}</Table.Cell>
                  <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.name)}</Table.Cell>
                  <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.companyName)}</Table.Cell>
                  <Table.Cell textAlign="center">{getPolyglotToAnyString(userIdentity.departmentName)}</Table.Cell>
                  <Table.Cell textAlign="center">{userIdentity.email}</Table.Cell>
                  <Table.Cell textAlign="center">{moment(operator.registeredTime).format('YYYY.MM.DD')}</Table.Cell>
                </Table.Row>
              );
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={8}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default QuestOperatorListView;
