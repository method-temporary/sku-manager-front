import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Table } from 'semantic-ui-react';
import Community from '../../../../community/community/model/Community';

interface Props {
  cubeCommunity: Community;
}

@observer
@reactAutobind
class CubeOperationInfoView extends ReactComponent<Props, {}> {
  //

  render() {
    //
    const { cubeCommunity } = this.props;
    return (
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
            <Table.Cell>{cubeCommunity.managerCompany}</Table.Cell>
            <Table.Cell>{cubeCommunity.managerName}</Table.Cell>
            <Table.Cell>{cubeCommunity.managerEmail}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default CubeOperationInfoView;
