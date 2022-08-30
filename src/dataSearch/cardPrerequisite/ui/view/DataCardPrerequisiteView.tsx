import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import DataCardPrerequisiteModel from 'dataSearch/cardPrerequisite/model/DataCardPrerequisiteModel';

interface Props {
  cardPrerequisites: DataCardPrerequisiteModel[];
  startNo: number;
}

class DataCardPrerequisiteListView extends React.Component<Props> {
  render() {
    const { cardPrerequisites, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="8%" />
          <col width="30%" />
          <col width="8%" />
          <col width="30%" />
          <col width="7%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Card ID</Table.HeaderCell>
            <Table.HeaderCell>Card명</Table.HeaderCell>
            <Table.HeaderCell>선수 과정 Card ID</Table.HeaderCell>
            <Table.HeaderCell>선수 과정 Card명</Table.HeaderCell>
            <Table.HeaderCell>카드 공개여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {cardPrerequisites && cardPrerequisites.length ? (
            cardPrerequisites.map((dataModel, index) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{dataModel.cardId}</Table.Cell>
                  <Table.Cell>{dataModel.cardName}</Table.Cell>
                  <Table.Cell>{dataModel.prerequisiteCardId}</Table.Cell>
                  <Table.Cell>{dataModel.prerequisiteCardName}</Table.Cell>
                  <Table.Cell>{dataModel.searchable}</Table.Cell>
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

export default DataCardPrerequisiteListView;
