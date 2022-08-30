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
class CubeCommunityInfoView extends ReactComponent<Props, {}> {
  //

  render() {
    //
    const { cubeCommunity } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">커뮤니티명</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell textAlign="center">{cubeCommunity.name}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default CubeCommunityInfoView;
