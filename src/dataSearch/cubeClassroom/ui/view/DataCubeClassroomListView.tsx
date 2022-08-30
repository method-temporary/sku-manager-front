import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataCubeClassroomModel from 'dataSearch/cubeClassroom/model/DataCubeClassroomModel';

interface Props {
  cubeClassrooms: DataCubeClassroomModel[];
  startNo: number;
}

class DataCubeClassroomListView extends React.Component<Props> {
  render() {
    const { cubeClassrooms, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="8%" />
          <col width="30%" />
          <col width="10%" />
          <col width="12%" />
          <col width="12%" />
          <col width="5%" />
          <col width="8%" />
          <col width="5%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Cube ID</Table.HeaderCell>
            <Table.HeaderCell>Cube명</Table.HeaderCell>
            <Table.HeaderCell>교육형태</Table.HeaderCell>
            <Table.HeaderCell>신청기간</Table.HeaderCell>
            <Table.HeaderCell>교육기간</Table.HeaderCell>
            <Table.HeaderCell>무료여부</Table.HeaderCell>
            <Table.HeaderCell>교육 비용</Table.HeaderCell>
            <Table.HeaderCell>차수</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cubeClassrooms && cubeClassrooms.length ? (
            cubeClassrooms.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.cubeId}</Table.Cell>
                  <Table.Cell>{dataModel.cubeName}</Table.Cell>
                  <Table.Cell>{dataModel.type}</Table.Cell>
                  <Table.Cell textAlign="center">{dataModel.applyingDate}</Table.Cell>
                  <Table.Cell textAlign="center">{dataModel.learningDate}</Table.Cell>
                  <Table.Cell textAlign="center">{dataModel.freeOfCharge}</Table.Cell>
                  <Table.Cell>{dataModel.chargeAmount}</Table.Cell>
                  <Table.Cell>{dataModel.round}</Table.Cell>
                </Table.Row>
              );
            })
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={15}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과가 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default DataCubeClassroomListView;
