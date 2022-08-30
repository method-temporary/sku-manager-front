import * as React from 'react';
import { Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import LearningStampListModal from './LearningStampListModal';
import LearingTrainingListModal from './LearningTrainingListModal';

interface Props {
  stampListModalOpen: boolean;
  handleCloseStampListModal: () => void;
  onShowStampListModal: (e: any) => void;
  trainingListModalOpen: boolean;
  handleCloseTrainingListModal: () => void;
  onShowTrainingListModal: (e: any) => void;
}

@observer
@reactAutobind
class LearningInfoView extends React.Component<Props> {
  render() {
    const {
      stampListModalOpen,
      handleCloseStampListModal,
      onShowStampListModal,
      trainingListModalOpen,
      handleCloseTrainingListModal,
      onShowTrainingListModal,
    } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2}>학습정보</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>총 학습 시간</Table.Cell>
            <Table.Cell>72/200 진행 중</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>학습내역</Table.Cell>
            <Table.Cell>
              <a href="#" onClick={(e) => onShowTrainingListModal(e)}>
                20개 학습 수강 완료 10개 강의 진행 중 | 2개 강의 수강 신청 | 1개 강의 수강 반려
              </a>
              <LearingTrainingListModal open={trainingListModalOpen} handleClose={handleCloseTrainingListModal} />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Stamp 정보</Table.Cell>
            <Table.Cell>
              <a href="#" onClick={(e) => onShowStampListModal(e)}>
                총50개 Stamp 획득
              </a>
              <LearningStampListModal open={stampListModalOpen} handleClose={handleCloseStampListModal} />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default LearningInfoView;
