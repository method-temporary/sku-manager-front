import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataCardInstructorModel from 'dataSearch/cardInstructor/model/DataCardInstructorModel';

interface Props {
  cardInstructors: DataCardInstructorModel[];
  startNo: number;
}

class DataCardInstructorListView extends React.Component<Props> {
  render() {
    const { cardInstructors, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="8%" />
          <col width="8%" />
          <col width="7%" />
          <col width="7%" />
          <col width="5%" />
          <col width="5%" />
          <col width="6%" />
          <col width="7%" />
          <col width="5%" />
          <col width="7%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>컬리지명</Table.HeaderCell>
            <Table.HeaderCell>채널명</Table.HeaderCell>
            <Table.HeaderCell>Card명</Table.HeaderCell>
            <Table.HeaderCell>메인 카테고리 여부</Table.HeaderCell>
            <Table.HeaderCell>Card Type</Table.HeaderCell>
            <Table.HeaderCell>공개여부</Table.HeaderCell>
            <Table.HeaderCell>강사 이름</Table.HeaderCell>
            <Table.HeaderCell>강사 이메일</Table.HeaderCell>
            <Table.HeaderCell>대표강사 여부</Table.HeaderCell>
            <Table.HeaderCell>학습시간</Table.HeaderCell>
            <Table.HeaderCell>추가 학습 시간</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cardInstructors && cardInstructors.length ? (
            cardInstructors.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.collegeName}</Table.Cell>
                  <Table.Cell>{dataModel.channelName}</Table.Cell>
                  <Table.Cell>{dataModel.cardId}</Table.Cell>
                  <Table.Cell>{dataModel.mainCategory}</Table.Cell>
                  <Table.Cell>{dataModel.cardType}</Table.Cell>
                  <Table.Cell>{dataModel.searchable}</Table.Cell>
                  <Table.Cell>{dataModel.instructorName}</Table.Cell>
                  <Table.Cell>{dataModel.instructorEmail}</Table.Cell>
                  <Table.Cell>{dataModel.representative}</Table.Cell>
                  <Table.Cell>{dataModel.learningTime}</Table.Cell>
                  <Table.Cell>{dataModel.additionalLearningTime}</Table.Cell>
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

export default DataCardInstructorListView;
