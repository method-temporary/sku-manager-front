import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { UserGroupRuleModel } from 'shared/model';
import { getBasedAccessRuleView } from 'shared/helper';

import { PageElementModel } from '../../index';
import { getPositionName } from '../pageElementHelper';

interface Props {
  routeToUpdatePageElement: (id: string) => void;
  pageElements: PageElementModel[];

  startNo: number;
  userGroupMap: Map<number, UserGroupRuleModel>;
}

@observer
@reactAutobind
class ElementManagementListView extends ReactComponent<Props> {
  //
  render() {
    const { routeToUpdatePageElement, pageElements, startNo, userGroupMap } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="25%" />
          <col width="25%" />
          <col width="13%" />
          <col />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>구분</Table.HeaderCell>
            <Table.HeaderCell>타입</Table.HeaderCell>
            <Table.HeaderCell>권한 설정 일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">접근제어규칙</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(pageElements &&
            pageElements.length > 0 &&
            pageElements.map((pageElement, idx) => (
              <Table.Row key={idx} onClick={() => routeToUpdatePageElement(pageElement.id)}>
                <Table.Cell textAlign="center">{startNo - idx}</Table.Cell>
                <Table.Cell>{getPositionName(pageElement.position)}</Table.Cell>
                <Table.Cell> {pageElement.type} </Table.Cell>
                <Table.Cell textAlign="center">{moment(pageElement.time).format('YYYY.MM.DD')}</Table.Cell>
                <Table.Cell>
                  {pageElement &&
                    pageElement.groupBasedAccessRule &&
                    getBasedAccessRuleView(pageElement.groupBasedAccessRule, userGroupMap)}
                </Table.Cell>
              </Table.Row>
            ))) || (
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

export default ElementManagementListView;
