import * as React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getDefaultLanguage, getPolyglotToAnyString } from 'shared/components/Polyglot';

import { BadgeCategoryModel } from '../../../../../_data/badge/badgeCategories/model/BadgeCategoryModel';

interface Props {
  //
  routeToDetailBadgeCategory: (badgeCategoryId: string) => void;
  onSelectAllCheckBox: (checked: boolean) => void;
  changeTargetBadgeCategoryProps: (index: number, name: string, checked: boolean) => void;
  badgeCategories: BadgeCategoryModel[];
  userWorkspaceMap: Map<string, string>;
  startNo: number;
  checked: boolean;
}

@observer
@reactAutobind
class BadgeCategoryListView extends ReactComponent<Props> {
  //
  render() {
    //
    const {
      routeToDetailBadgeCategory,
      onSelectAllCheckBox,
      changeTargetBadgeCategoryProps,
      badgeCategories,
      userWorkspaceMap,
      startNo,
      checked,
    } = this.props;

    return (
      <Table celled selectable textAlign="center">
        <colgroup>
          <col width="6%" />
          <col width="6%" />
          <col width="14%" />
          <col width="35%" />
          <col width="16%" />
          <col width="23%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Form.Field
                control={Checkbox}
                onChange={(e: any, data: any) => onSelectAllCheckBox(data.checked)}
                checked={checked}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>배지 분야</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(badgeCategories &&
            badgeCategories.length &&
            badgeCategories.map((badgeCategory, index) => (
              <Table.Row key={index} onClick={() => routeToDetailBadgeCategory(badgeCategory.id)}>
                <Table.Cell onClick={(event: any) => event.stopPropagation()}>
                  <Form.Field
                    control={Checkbox}
                    checked={badgeCategory.checked}
                    onChange={(e: any, data: any) => changeTargetBadgeCategoryProps(index, 'checked', data.checked)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center"> {startNo - index}</Table.Cell>
                <Table.Cell>
                  {userWorkspaceMap.get(
                    badgeCategory.patronKey.keyString.slice(badgeCategory.patronKey.keyString.indexOf('@') + 1)
                  )}
                </Table.Cell>
                <Table.Cell>
                  {getPolyglotToAnyString(badgeCategory.name, getDefaultLanguage(badgeCategory.langSupports))}
                </Table.Cell>
                <Table.Cell>
                  {getPolyglotToAnyString(badgeCategory.registrantName, getDefaultLanguage(badgeCategory.langSupports))}
                </Table.Cell>
                <Table.Cell> {moment(badgeCategory.registeredTime).format('YYYY.MM.DD HH:mm')} </Table.Cell>
              </Table.Row>
            ))) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={6}>
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

export default BadgeCategoryListView;
