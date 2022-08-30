import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';
import { OperatorModel } from '../../../../community/community/model/OperatorModel';

interface Props {
  cubeOperator: OperatorModel | undefined;
}

interface States {}

@observer
@reactAutobind
class CubeManagerInfoView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { cubeOperator } = this.props;
    return (
      <>
        {cubeOperator && cubeOperator.employeeId ? (
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
                <Table.Cell>{cubeOperator.company}</Table.Cell>
                <Table.Cell>{cubeOperator.name}</Table.Cell>
                <Table.Cell>{cubeOperator.email}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        ) : null}
      </>
    );
  }
}

export default CubeManagerInfoView;
