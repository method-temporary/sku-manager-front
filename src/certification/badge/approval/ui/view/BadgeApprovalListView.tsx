import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeWithStudentCountRomModel } from '_data/badge/badges/model';

import { getBadgeStateDisplay } from '../../../badge/ui/logic/BadgeHelper';
import { BadgeState } from '_data/badge/badges/model/vo';

interface Props {
  badgeApprovals: BadgeWithStudentCountRomModel[];
  checkAll: boolean;
  routeToBadgeApprovalDetail: (badgeId: string) => void;
  startNo: number;
  userWorkspaceMap: Map<string, string>;
  categoriesMap: Map<string, string>;
  selectedBadgeApprovalIds: string[];
  onClickCheckOne: (id: string, operatorId: string) => void;
  onClickCheckAll: (value: boolean) => void;
}

class BadgeApprovalListView extends React.Component<Props> {
  //
  render() {
    //
    const {
      badgeApprovals,
      checkAll,
      routeToBadgeApprovalDetail,
      startNo,
      userWorkspaceMap,
      categoriesMap,
      selectedBadgeApprovalIds,
      onClickCheckOne,
      onClickCheckAll,
    } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>
              <Form.Field
                control={Checkbox}
                checked={checkAll}
                disabled={
                  badgeApprovals.filter((badgeApproval) => badgeApproval.state === BadgeState.OpenApproval).length === 0
                }
                onChange={(event: any, data: any) => onClickCheckAll(data.checked)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Badge명</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>분야</Table.HeaderCell>
            <Table.HeaderCell>유형</Table.HeaderCell>
            <Table.HeaderCell>레벨</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>승인 요청일자</Table.HeaderCell>
            <Table.HeaderCell>Badge 상태</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badgeApprovals && badgeApprovals.length ? (
            badgeApprovals.map((badgeApproval, index) => (
              <Table.Row
                textAlign="center"
                onClick={() => routeToBadgeApprovalDetail(badgeApproval.id)}
                key={badgeApproval.id}
              >
                <Table.Cell onClick={(event: any) => event.stopPropagation()}>
                  <Form.Field
                    control={Checkbox}
                    disabled={badgeApproval.state !== BadgeState.OpenApproval}
                    checked={selectedBadgeApprovalIds.includes(badgeApproval.id)}
                    onChange={(event: any, data: any) => onClickCheckOne(badgeApproval.id, badgeApproval.operator)}
                  />
                </Table.Cell>
                <Table.Cell>{startNo - index}</Table.Cell>
                <Table.Cell textAlign="left">{getPolyglotToAnyString(badgeApproval.name)}</Table.Cell>
                <Table.Cell>{userWorkspaceMap.get(badgeApproval.cineroomId)}</Table.Cell>
                <Table.Cell>{categoriesMap.get(badgeApproval.categoryId)}</Table.Cell>
                <Table.Cell>{badgeApproval.type}</Table.Cell>
                <Table.Cell>{badgeApproval.level}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(badgeApproval.registrantName)}</Table.Cell>
                <Table.Cell>{moment(badgeApproval.openRequestedTime).format('YYYY.MM.DD')}</Table.Cell>
                <Table.Cell>{getBadgeStateDisplay(badgeApproval.state)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={10}>
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

export default BadgeApprovalListView;
