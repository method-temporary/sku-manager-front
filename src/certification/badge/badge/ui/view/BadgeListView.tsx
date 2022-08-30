import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeWithStudentCountRomModel } from '_data/badge/badges/model';
import { getBadgeStateDisplay } from '../logic/BadgeHelper';

interface Props {
  badges: BadgeWithStudentCountRomModel[];
  routeToBadgeDetail: (badgeId: string) => void;
  startNo: number;
  userWorkspaceMap: Map<string, string>;
  categoriesMap: Map<string, string>;
}

class BadgeListView extends React.Component<Props> {
  //
  render() {
    //
    const { badges, routeToBadgeDetail, startNo, userWorkspaceMap, categoriesMap } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="4%" />
          <col />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="7%" />
          <col width="6%" />
          <col width="6%" />
          <col width="4%" />
          <col width="4%" />
          <col width="4%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>Badge명</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>분야</Table.HeaderCell>
            <Table.HeaderCell>유형</Table.HeaderCell>
            <Table.HeaderCell>레벨</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>생성일자</Table.HeaderCell>
            <Table.HeaderCell>발급구분</Table.HeaderCell>
            <Table.HeaderCell>Badge 상태</Table.HeaderCell>
            <Table.HeaderCell>추가발급 요건</Table.HeaderCell>
            <Table.HeaderCell>Badge 획득 인원</Table.HeaderCell>
            <Table.HeaderCell>도전중 인원</Table.HeaderCell>
            <Table.HeaderCell>도전 취소 인원</Table.HeaderCell>
            <Table.HeaderCell>발급 요청 인원</Table.HeaderCell>
            <Table.HeaderCell>발급 취소 인원</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badges && badges.length ? (
            badges.map((badgeWithStudent, index) => (
              <Table.Row onClick={() => routeToBadgeDetail(badgeWithStudent.id)} key={badgeWithStudent.id}>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell>
                  {getPolyglotToAnyString(badgeWithStudent.name, getDefaultLanguage(badgeWithStudent.langSupports))}
                </Table.Cell>
                <Table.Cell>{userWorkspaceMap.get(badgeWithStudent.cineroomId)}</Table.Cell>
                <Table.Cell>{categoriesMap.get(badgeWithStudent.categoryId)}</Table.Cell>
                <Table.Cell>{badgeWithStudent.type}</Table.Cell>
                <Table.Cell>{badgeWithStudent.level}</Table.Cell>
                <Table.Cell>
                  {getPolyglotToAnyString(
                    badgeWithStudent.registrantName,
                    getDefaultLanguage(badgeWithStudent.langSupports)
                  )}
                </Table.Cell>
                <Table.Cell>{moment(badgeWithStudent.registeredTime).format('YYYY.MM.DD')}</Table.Cell>
                <Table.Cell>{badgeWithStudent.issueAutomatically ? '자동' : '수동'}</Table.Cell>
                <Table.Cell>{getBadgeStateDisplay(badgeWithStudent.state)}</Table.Cell>
                <Table.Cell>{badgeWithStudent.additionalRequirementsNeeded ? 'Yes' : 'No'}</Table.Cell>
                <Table.Cell>{badgeWithStudent.issuedCount}</Table.Cell>
                <Table.Cell>{badgeWithStudent.challengingCount}</Table.Cell>
                <Table.Cell>{badgeWithStudent.cancelChallengeCount}</Table.Cell>
                <Table.Cell>{badgeWithStudent.requestingCount}</Table.Cell>
                <Table.Cell>{badgeWithStudent.cancelCount}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={14}>
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

export default BadgeListView;
