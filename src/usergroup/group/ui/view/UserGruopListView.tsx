import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import moment from 'moment';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserGroupModel } from '../../model';

interface Props {
  checked: boolean;
  cineroomId: string;
  userGroupList: UserGroupModel[];
  startNo: number;
  routeToUserGroupDetail: (userGroupId: string) => void;
  onClickCheckAll: (value: boolean) => void;
  onClickCheckOne: (index: number, name: string, value: boolean) => void;
  userWorkspaceMap: Map<string, string>;
}

class UserGroupListView extends React.Component<Props> {
  //
  render() {
    //
    const {
      checked,
      cineroomId,
      userGroupList,
      startNo,
      routeToUserGroupDetail,
      onClickCheckAll,
      onClickCheckOne,
      userWorkspaceMap,
    } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="3%" />
          <col width="5%" />
          <col width="22%" />
          <col width="15%" />
          <col width="10%" />
          <col width="15%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>
              <Form.Field
                control={Checkbox}
                checked={checked}
                onChange={(event: any, data: any) => onClickCheckAll(data.checked)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>사용자 그룹명</Table.HeaderCell>
            <Table.HeaderCell>사용처</Table.HeaderCell>
            <Table.HeaderCell>사용여부</Table.HeaderCell>
            <Table.HeaderCell>사용자 그룹 분류</Table.HeaderCell>
            <Table.HeaderCell>사용자 수</Table.HeaderCell>
            <Table.HeaderCell>생성자</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userGroupList && userGroupList.length ? (
            userGroupList.map((userGroup: UserGroupModel, index) => (
              <Table.Row onClick={() => routeToUserGroupDetail(userGroup.id)} key={userGroup.id}>
                <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                  <Form.Field
                    disabled={userGroup.cineroomId !== cineroomId}
                    control={Checkbox}
                    value={userGroup.id}
                    checked={userGroup.checked}
                    onChange={(event: any, data: any) => onClickCheckOne(index, 'checked', data.checked)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(userGroup.name)}</Table.Cell>
                <Table.Cell>{userWorkspaceMap.get(userGroup.cineroomId)}</Table.Cell>
                <Table.Cell>{userGroup.enabled ? '사용' : '사용중지'}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(userGroup.categoryName)}</Table.Cell>
                <Table.Cell>{userGroup.userCount}</Table.Cell>
                <Table.Cell>{getPolyglotToAnyString(userGroup.registrantName)}</Table.Cell>
                <Table.Cell textAlign="center">{moment(userGroup.registeredTime).format(`YYYY.MM.DD`)}</Table.Cell>
              </Table.Row>
            ))
          ) : (
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

export default UserGroupListView;
