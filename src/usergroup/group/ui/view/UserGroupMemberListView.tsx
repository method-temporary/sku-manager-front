import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { ReactComponent } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserGroupMemberModel from '../../model/UserGroupMemberModel';

interface Props {
  userGroupMembers: UserGroupMemberModel[];
  startNo: number;
  checked: boolean;
  onClickCheckAll: (value: boolean) => void;
  onClickCheckOne: (index: number, name: string, value: boolean) => void;
}

class UserGroupMemberListView extends ReactComponent<Props> {
  //
  render() {
    //
    const { userGroupMembers, startNo, checked, onClickCheckAll, onClickCheckOne } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="3%" />
          <col width="10%" />
          <col width="15%" />
          <col width="15%" />
          <col width="20%" />
          <col width="17%" />
          <col width="20%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field
                control={Checkbox}
                checked={checked}
                onChange={(event: any, data: any) => onClickCheckAll(data.checked)}
              />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사번</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속회사</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속부서명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">가입일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {userGroupMembers && userGroupMembers.length ? (
            userGroupMembers.map((userGroupMember: UserGroupMemberModel, index: number) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    value={userGroupMember.memberView.id}
                    checked={userGroupMember.checked}
                    onChange={(event: any, data: any) => onClickCheckOne(index, 'checked', data.checked)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{userGroupMember.memberView.employeeId}</Table.Cell>
                <Table.Cell textAlign="center">{getPolyglotToAnyString(userGroupMember.memberView.name)}</Table.Cell>
                <Table.Cell textAlign="center">
                  {getPolyglotToAnyString(userGroupMember.memberView.companyName)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {getPolyglotToAnyString(userGroupMember.memberView.departmentName)}
                </Table.Cell>
                <Table.Cell textAlign="center">{userGroupMember.getRegisteredTime}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={8}>
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

export default UserGroupMemberListView;
