import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { OffsetElementList, reactAutobind, ReactComponent } from '@nara.platform/accent';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataTaskCubeModel from 'dataSearch/taskCube/model/DataTaskCubeModel';

interface Props {
  taskCubes: DataTaskCubeModel[];
  startNo: number;
}

class DataTaskCubeListView extends ReactComponent<Props, {}> {
  render() {
    const { taskCubes, startNo } = this.props;

    return (
      <Table celled className="table-fixed">
        <colgroup>
          <col width="5%" />
          <col width="13%" />
          <col width="13%" />
          <col width="12%" />
          <col width="13%" />
          <col width="18%" />
          <col width="52%" />
          <col width="8%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>소속사</Table.HeaderCell>
            <Table.HeaderCell>소속조직(팀)</Table.HeaderCell>
            <Table.HeaderCell>작성자</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>내용</Table.HeaderCell>
            <Table.HeaderCell>조회수</Table.HeaderCell>
            <Table.HeaderCell>등록일</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {taskCubes && taskCubes.length ? (
            taskCubes.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.companyName}</Table.Cell>
                  <Table.Cell>{dataModel.departmentName}</Table.Cell>
                  <Table.Cell>{dataModel.name}</Table.Cell>
                  <Table.Cell>{dataModel.email}</Table.Cell>
                  <Table.Cell>{dataModel.title}</Table.Cell>
                  <Table.Cell>{dataModel.contents}</Table.Cell>
                  <Table.Cell>{dataModel.readCount}</Table.Cell>
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

export default DataTaskCubeListView;
