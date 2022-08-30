import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
// import DataLearningCubeModel from 'dataSearch/learningCube/model/DataLearningCubeModel';
import DataCardPermittedModel from 'dataSearch/cardPermitted/model/DataCardPermittedModel';

interface Props {
  cardPermitteds: DataCardPermittedModel[];
  startNo: number;
}

class DataCardPermittedListView extends React.Component<Props> {
  render() {
    const { cardPermitteds, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="7%" />
          <col />
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Card ID</Table.HeaderCell>
            <Table.HeaderCell>Card명</Table.HeaderCell>
            <Table.HeaderCell>핵인싸 범위</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cardPermitteds && cardPermitteds.length ? (
            cardPermitteds.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.cardId}</Table.Cell>
                  <Table.Cell>{dataModel.cardName}</Table.Cell>
                  <Table.Cell>{dataModel.companyName}</Table.Cell>
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

export default DataCardPermittedListView;
