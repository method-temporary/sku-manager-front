import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { DataBadgeModel } from '../../model/DataBadgeModel';
import moment from 'moment';

interface Props {
  badges: DataBadgeModel[];
  startNo: number;
}

class DataBadgeListView extends React.Component<Props> {
  //
  render() {
    //
    const { badges, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="10%" />
          <col width="5%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Badge명</Table.HeaderCell>
            <Table.HeaderCell>회사</Table.HeaderCell>
            <Table.HeaderCell>소속부서명</Table.HeaderCell>
            <Table.HeaderCell>회원명</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>도전상태</Table.HeaderCell>
            <Table.HeaderCell>도전시간</Table.HeaderCell>
            <Table.HeaderCell>이수상태</Table.HeaderCell>
            <Table.HeaderCell>이수시간</Table.HeaderCell>
            <Table.HeaderCell>진행률</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badges && badges.length ? (
            badges.map((badgeViewModel, index) => (
              <Table.Row>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell>{badgeViewModel.badgeName}</Table.Cell>
                <Table.Cell>{badgeViewModel.companyName}</Table.Cell>
                <Table.Cell>{badgeViewModel.departmentName}</Table.Cell>
                <Table.Cell>{badgeViewModel.name}</Table.Cell>
                <Table.Cell>{badgeViewModel.email}</Table.Cell>
                <Table.Cell textAlign="center">{badgeViewModel.challengeState}</Table.Cell>
                <Table.Cell>
                  {badgeViewModel.challengeTime
                    ? moment(badgeViewModel.challengeTime).format('YYYY.MM.DD HH:mm:ss')
                    : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">{badgeViewModel.issueState}</Table.Cell>
                <Table.Cell>
                  {' '}
                  {badgeViewModel.issueTime ? moment(badgeViewModel.issueTime).format('YYYY.MM.DD HH:mm:ss') : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {badgeViewModel.issueCnt} / {badgeViewModel.cardIds}
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={11}>
                <div className="no-cont-wrap no-contents-icon">
                  <Icon className="no-contents80" />
                  <div className="sr-only">콘텐츠 없음</div>
                  <div className="text">검색 결과를 찾을 수 없습니다.</div>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );
  }
}

export default DataBadgeListView;
