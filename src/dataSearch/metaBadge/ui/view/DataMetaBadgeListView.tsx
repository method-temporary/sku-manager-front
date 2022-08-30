import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import DataMetaBadgeModel from 'dataSearch/metaBadge/model/DataMetaBadgeModel';

interface Props {
  metaBadges: DataMetaBadgeModel[];
  startNo: number;
}

class DataMetaBadgeListView extends React.Component<Props> {
  render() {
    const { metaBadges, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="7%" />
          <col width="7%" />
          <col width="5%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Badge ID</Table.HeaderCell>
            <Table.HeaderCell>Badge명</Table.HeaderCell>
            <Table.HeaderCell>레벨</Table.HeaderCell>
            <Table.HeaderCell>정렬순서</Table.HeaderCell>
            <Table.HeaderCell>생성일</Table.HeaderCell>
            <Table.HeaderCell>Card ID</Table.HeaderCell>
            <Table.HeaderCell>Card명</Table.HeaderCell>
            <Table.HeaderCell>College ID</Table.HeaderCell>
            <Table.HeaderCell>College명</Table.HeaderCell>
            <Table.HeaderCell>Channel ID</Table.HeaderCell>
            <Table.HeaderCell>Channel명</Table.HeaderCell>
            <Table.HeaderCell>twoDepthChannel ID</Table.HeaderCell>
            <Table.HeaderCell>twoDepthChannel명</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {metaBadges && metaBadges.length ? (
            metaBadges.map((data, idx) => {
              return (
                <Table.Row>
                  <Table.Cell textAlign="center">{startNo - idx}</Table.Cell>
                  <Table.Cell>{data.badgeId}</Table.Cell>
                  <Table.Cell>{data.badgeName}</Table.Cell>
                  <Table.Cell>{data.level}</Table.Cell>
                  <Table.Cell>{data.order}</Table.Cell>
                  <Table.Cell>{data.createdTime}</Table.Cell>
                  <Table.Cell>{data.cardId}</Table.Cell>
                  <Table.Cell>{data.cardName}</Table.Cell>
                  <Table.Cell>{data.collegeId}</Table.Cell>
                  <Table.Cell>{data.collegeName}</Table.Cell>
                  <Table.Cell>{data.channelId}</Table.Cell>
                  <Table.Cell>{data.channelName}</Table.Cell>
                  <Table.Cell>{data.twoDepthChannelId}</Table.Cell>
                  <Table.Cell>{data.twoDepthChannelName}</Table.Cell>
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
export default DataMetaBadgeListView;
