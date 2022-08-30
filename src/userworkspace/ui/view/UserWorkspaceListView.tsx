import React, { ReactNode } from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import { getUserWorkspaceStateValue } from '../../model/vo/UserWorkspaceState';

interface Props {
  routeToUserWorkspaceDetailPage: (id?: string) => void;
  getParentWorkspaceName: (id: string) => string;
  onChecked: (id: string) => void;
  makeUserGroupsNode: (groupSequences: number[]) => ReactNode;

  userWorkspaces: UserWorkspaceModel[];
  selectedUserWorkspaceIds: string[];
  startNo: number;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceListView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { routeToUserWorkspaceDetailPage, getParentWorkspaceName, onChecked, makeUserGroupsNode } = this.props;
    const { userWorkspaces, selectedUserWorkspaceIds, startNo } = this.props;
    const allChecked =
      selectedUserWorkspaceIds.length !== 0 &&
      userWorkspaces.filter((userWorkspace) => !selectedUserWorkspaceIds.includes(userWorkspace.id)).length === 0;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col />
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
          <col width="15%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field control={Checkbox} checked={allChecked} onChange={() => onChecked('All')} />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용자 소속</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사용 여부</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상위 사용자 소속</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">SK 그룹사 여부</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">GDI 계정 동기화</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">초기 사용자 그룹</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">최종 변경</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(userWorkspaces &&
            userWorkspaces.length &&
            userWorkspaces.map((userWorkSpace, index) => (
              <Table.Row key={index} onClick={() => routeToUserWorkspaceDetailPage(userWorkSpace.id)}>
                <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                  <Form.Field
                    control={Checkbox}
                    checked={selectedUserWorkspaceIds.includes(userWorkSpace.id)}
                    onChange={() => onChecked(userWorkSpace.id)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{getPolyglotToAnyString(userWorkSpace.name)}</Table.Cell>
                <Table.Cell textAlign="center">{getUserWorkspaceStateValue(userWorkSpace.state)}</Table.Cell>
                {/*TODO: 있으면 검색된 애들중에 찾아서 표시*/}
                <Table.Cell textAlign="center">{getParentWorkspaceName(userWorkSpace.parentId)}</Table.Cell>
                <Table.Cell textAlign="center">{userWorkSpace.skGroup ? 'SK 그룹사' : '-'}</Table.Cell>
                <Table.Cell textAlign="center">{userWorkSpace.syncWithGdi ? '동기화 사용' : '-'}</Table.Cell>
                <Table.Cell textAlign="center">
                  {makeUserGroupsNode(userWorkSpace.defaultUserGroupSequences.sequences)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {moment(userWorkSpace.modifiedTime).format('YYYY.MM.DD')}
                  {'/'}
                  {getPolyglotToAnyString(userWorkSpace.modifierName)}
                </Table.Cell>
              </Table.Row>
            ))) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={9}>
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

export default UserWorkspaceListView;
