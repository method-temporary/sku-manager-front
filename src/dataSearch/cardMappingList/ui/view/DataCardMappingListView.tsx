import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataCardMappingListModel from 'dataSearch/cardMappingList/model/DataCardMappingListModel';

interface Props {
  cardMappingLists: DataCardMappingListModel[];
  startNo: number;
}

class DataCardMappingListView extends React.Component<Props> {
  render() {
    const { cardMappingLists, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="6%" />
          <col width="10%" />
          <col width="8%" />
          <col width="11%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Card 컬리지명</Table.HeaderCell>
            <Table.HeaderCell>Card 채널명</Table.HeaderCell>
            <Table.HeaderCell>공개여부</Table.HeaderCell>
            <Table.HeaderCell>Card 유형</Table.HeaderCell>
            <Table.HeaderCell>Card ID</Table.HeaderCell>
            <Table.HeaderCell>Card 명</Table.HeaderCell>
            <Table.HeaderCell>Cube 컬리지명</Table.HeaderCell>
            <Table.HeaderCell>Cube 채널명</Table.HeaderCell>
            <Table.HeaderCell>Cube 유형</Table.HeaderCell>
            <Table.HeaderCell>Cube 명</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cardMappingLists && cardMappingLists.length ? (
            cardMappingLists.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.cardCollegeName}</Table.Cell>
                  <Table.Cell>{dataModel.cardChannelName}</Table.Cell>
                  <Table.Cell>{dataModel.cardSearchable}</Table.Cell>
                  <Table.Cell>{dataModel.cardType}</Table.Cell>
                  <Table.Cell>{dataModel.cardId}</Table.Cell>
                  <Table.Cell>{dataModel.cardName}</Table.Cell>
                  <Table.Cell>{dataModel.cubeCollegeName}</Table.Cell>
                  <Table.Cell>{dataModel.cubeChannelName}</Table.Cell>
                  <Table.Cell>{dataModel.cubeType}</Table.Cell>
                  <Table.Cell>{dataModel.cubeName}</Table.Cell>
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

export default DataCardMappingListView;
