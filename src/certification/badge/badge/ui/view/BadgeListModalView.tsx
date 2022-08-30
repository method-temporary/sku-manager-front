import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeWithStudentCountRomModel } from '_data/badge/badges/model';

interface Props {
  badgeIds: string[];
  badges: BadgeWithStudentCountRomModel[];
  userWorkspaceMap: Map<string, string>;
  categoriesMap: Map<string, string>;
  onClickCheck: (badgeModel: BadgeWithStudentCountRomModel, value: string) => void;
}

class BadgeListModalView extends React.Component<Props> {
  //
  render() {
    //
    const { badgeIds, badges, userWorkspaceMap, categoriesMap, onClickCheck } = this.props;

    return (
      <Table celled>
        <colgroup>
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
            <Table.HeaderCell>선택</Table.HeaderCell>
            <Table.HeaderCell>Badge명</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>분야</Table.HeaderCell>
            <Table.HeaderCell>유형</Table.HeaderCell>
            <Table.HeaderCell>레벨</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>생성일자</Table.HeaderCell>
            <Table.HeaderCell>추가발급 요건</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badges && badges.length ? (
            badges.map((badge, index) => (
              <Table.Row key={badge.id}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    value={badge.id}
                    checked={badgeIds.includes(badge.id)}
                    onChange={(event: any, data: any) => onClickCheck(badge, badge.id)}
                  />
                </Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(badge.name)}</Table.Cell>
                <Table.Cell>{userWorkspaceMap.get(badge.cineroomId)}</Table.Cell>
                <Table.Cell>{categoriesMap.get(badge.categoryId)}</Table.Cell>
                <Table.Cell>{badge.type}</Table.Cell>
                <Table.Cell>{badge.level}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(badge.registrantName)}</Table.Cell>
                <Table.Cell>{moment(badge.registeredTime).format('YYYY.MM.DD')}</Table.Cell>
                <Table.Cell>{badge.additionalRequirementsNeeded ? 'Yes' : 'No'}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={13}>
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

export default BadgeListModalView;
