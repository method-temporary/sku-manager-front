import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataMetaCubeModel from 'dataSearch/metaCube/model/DataMetaCubeModel';

interface Props {
  metaCubes: DataMetaCubeModel[];
  startNo: number;
}

class DataMetaCubeListView extends React.Component<Props> {
  render() {
    const { metaCubes, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="8%" />
          <col width="7%" />
          <col width="7%" />
          <col width="5%" />
          <col width="5%" />
          <col width="5%" />
          <col width="6%" />
          <col width="5%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>컬리지명</Table.HeaderCell>
            <Table.HeaderCell>채널명</Table.HeaderCell>
            <Table.HeaderCell>Cube명</Table.HeaderCell>
            <Table.HeaderCell>메인 카테고리 여부</Table.HeaderCell>
            <Table.HeaderCell>Cube Type</Table.HeaderCell>
            <Table.HeaderCell>난이도</Table.HeaderCell>
            <Table.HeaderCell>학습시간</Table.HeaderCell>
            <Table.HeaderCell>교육기관</Table.HeaderCell>
            <Table.HeaderCell>생성일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {metaCubes && metaCubes.length ? (
            metaCubes.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.collegeName}</Table.Cell>
                  <Table.Cell>{dataModel.channelName}</Table.Cell>
                  <Table.Cell>{dataModel.cubeName}</Table.Cell>
                  <Table.Cell>{dataModel.mainCategory}</Table.Cell>
                  <Table.Cell>{dataModel.cubeType}</Table.Cell>
                  <Table.Cell>{dataModel.difficultyLevel}</Table.Cell>
                  <Table.Cell>{dataModel.learningTime}</Table.Cell>
                  <Table.Cell>{dataModel.institute}</Table.Cell>
                  <Table.Cell>{dataModel.registeredTime}</Table.Cell>
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

export default DataMetaCubeListView;
