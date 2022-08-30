import React from 'react';
import { observer } from 'mobx-react';
import { Form, Table } from 'semantic-ui-react';
import { MemberViewModel } from '@nara.drama/approval';
import ManagerListModal from '../../../../../../cube/cube/ui/view/ManagerListModal';
import { getPolyglotToAnyString } from '../../../../../../shared/components/Polyglot';
import EnrollmentCubeStore from '../EnrollmentCube.store';

interface props {
  readonly?: boolean;
}
export const CubeOperatorRow = observer(({ readonly }: props) => {
  //
  const { operator, setOperator } = EnrollmentCubeStore.instance;

  const onClickOperator = (member: MemberViewModel, memberList: MemberViewModel[]) => {
    //
    setOperator(member);
  };

  return (
    <Table.Row>
      <Table.Cell className="tb-header">
        담당자 정보<span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        {!readonly && (
          <Form.Group>
            <ManagerListModal multiSelect={false} handleOk={onClickOperator} buttonName={'담당자 선택'} />
          </Form.Group>
        )}
        {operator && operator.id && (
          <Table celled>
            <colgroup>
              <col width="30%" />
              <col width="20%" />
              <col width="50%" />
            </colgroup>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">소속</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이름</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{operator.companyName && getPolyglotToAnyString(operator.companyName)}</Table.Cell>
                <Table.Cell>{operator.name && getPolyglotToAnyString(operator.name)}</Table.Cell>
                <Table.Cell>{operator && operator.email}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}
      </Table.Cell>
    </Table.Row>
  );
});
