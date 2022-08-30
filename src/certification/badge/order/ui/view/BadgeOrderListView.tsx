import React from 'react';
import { observer } from 'mobx-react';
import { Button, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeCategoryModel } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryModel';

interface Props {
  badgeList: BadgeCategoryModel[];
  userWorkspaceMap: Map<string, string>;
  onClickChangeSequence: (BadgeCategoryModel: BadgeCategoryModel, oldIndex: number, newIndex: number) => void;
}

interface State {}

@observer
@reactAutobind
class BadgeOrderListView extends ReactComponent<Props, State> {
  //

  render() {
    //
    const { badgeList, userWorkspaceMap, onClickChangeSequence } = this.props;

    return (
      <Table celled selectable textAlign="center">
        <colgroup>
          <col width="15%" />
          <col width="20%" />
          <col width="25%" />
          <col width="20%" />
          <col width="20%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>배지 분야</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>등록 일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badgeList && badgeList.length ? (
            badgeList.map((badge, index) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <span className="cell-span">{index + 1}</span>
                  <Button
                    icon
                    size="mini"
                    basic
                    onClick={() => onClickChangeSequence(badge, index, index + 1)}
                    disabled={index === badgeList.length - 1}
                  >
                    <Icon name="angle down" />
                  </Button>
                  <Button
                    icon
                    size="mini"
                    basic
                    onClick={() => onClickChangeSequence(badge, index, index - 1)}
                    disabled={index === 0}
                  >
                    <Icon name="angle up" />
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  {userWorkspaceMap.get(badge.patronKey.keyString.slice(badge.patronKey.keyString.indexOf('@') + 1))}
                </Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(badge.name, getDefaultLanguage(badge.langSupports))}</Table.Cell>
                <Table.Cell>
                  {getPolyglotToAnyString(badge.registrantName, getDefaultLanguage(badge.langSupports))}
                </Table.Cell>
                <Table.Cell textAlign="center">{moment(badge.registeredTime).format(`YYYY.MM.DD`)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={5}>
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

export default BadgeOrderListView;
