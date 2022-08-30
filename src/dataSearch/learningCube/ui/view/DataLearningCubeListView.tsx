import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';

interface Props {
  learningCubes: DataLearningCubeModel[];
  startNo: number;
}

class DataLearningCubeListView extends React.Component<Props> {
  render() {
    const { learningCubes, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="8%" />
          <col width="5%" />
          <col width="8%" />
          <col width="5%" />
          <col width="5%" />
          <col width="5%" />
          <col width="6%" />
          <col width="5%" />
          <col width="5%" />
          <col width="5%" />
          <col width="6%" />
          <col width="5%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            {/* <Table.HeaderCell>컬리지명</Table.HeaderCell>
            <Table.HeaderCell>채널명</Table.HeaderCell> */}
            <Table.HeaderCell>Card ID</Table.HeaderCell>
            <Table.HeaderCell>Card명</Table.HeaderCell>
            <Table.HeaderCell>Cube ID</Table.HeaderCell>
            <Table.HeaderCell>과정명</Table.HeaderCell>
            <Table.HeaderCell>회사명</Table.HeaderCell>
            <Table.HeaderCell>부서명</Table.HeaderCell>
            <Table.HeaderCell>회원명</Table.HeaderCell>
            <Table.HeaderCell>e-mail</Table.HeaderCell>
            <Table.HeaderCell>학습유형</Table.HeaderCell>
            <Table.HeaderCell>학습상태</Table.HeaderCell>
            <Table.HeaderCell>설문상태</Table.HeaderCell>
            <Table.HeaderCell>레포트상태</Table.HeaderCell>
            <Table.HeaderCell>시험상태</Table.HeaderCell>
            {/* <Table.HeaderCell>교육시간(분)</Table.HeaderCell> */}
            <Table.HeaderCell>학습시작시간</Table.HeaderCell>
            <Table.HeaderCell>학습수정시간</Table.HeaderCell>
            <Table.HeaderCell>학습완료시간</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {learningCubes && learningCubes.length ? (
            learningCubes.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.cardId}</Table.Cell>
                  <Table.Cell>{dataModel.cardName}</Table.Cell>
                  <Table.Cell>{dataModel.cubeId}</Table.Cell>
                  <Table.Cell>{dataModel.cubeName}</Table.Cell>
                  <Table.Cell>{dataModel.companyName}</Table.Cell>
                  <Table.Cell>{dataModel.departmentName}</Table.Cell>
                  <Table.Cell>{dataModel.studentName}</Table.Cell>
                  <Table.Cell>{dataModel.email}</Table.Cell>
                  <Table.Cell>{dataModel.studentType}</Table.Cell>
                  <Table.Cell>{dataModel.learningState}</Table.Cell>
                  <Table.Cell>{dataModel.surveyStatus}</Table.Cell>
                  <Table.Cell>{dataModel.reportStatus}</Table.Cell>
                  <Table.Cell>{dataModel.testStatus}</Table.Cell>
                  {/* <Table.Cell>{dataModel.learningTime}</Table.Cell> */}
                  <Table.Cell>{dataModel.registeredTime}</Table.Cell>
                  <Table.Cell>{dataModel.modifiedTime}</Table.Cell>
                  <Table.Cell>{dataModel.passedTime}</Table.Cell>
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

export default DataLearningCubeListView;
