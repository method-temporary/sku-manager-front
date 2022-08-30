import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import CommunityListModal from './CommunityListModal';

interface Props {
  communityListModalOpen: boolean;
  handleCloseCommunityListModal: () => void;
  onShowCommunityListModal: (e: any) => void;
}

@observer
@reactAutobind
class CommunityInfoView extends React.Component<Props> {
  render() {
    const { communityListModalOpen, handleCloseCommunityListModal, onShowCommunityListModal } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>커뮤니티 정보</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>가입한 커뮤니티 수</Table.Cell>
            <Table.Cell>
              <a href="#" onClick={(e) => onShowCommunityListModal(e)}>
                200개
              </a>
              <CommunityListModal open={communityListModalOpen} handleClose={handleCloseCommunityListModal} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default CommunityInfoView;
