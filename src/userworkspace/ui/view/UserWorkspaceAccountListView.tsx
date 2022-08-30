import * as React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { Language, getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserWithRelatedInformationRom from 'user/model/UserWithRelatedInformationRom';

interface Props {
  onChecked: (id: string) => void;

  members: UserWithRelatedInformationRom[];
  selectedMemberIds: string[];
  startNo: number;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceAccountListView extends ReactComponent<Props, States> {
  render() {
    //
    const { onChecked } = this.props;
    const { members, startNo, selectedMemberIds } = this.props;

    const allChecked =
      selectedMemberIds.length !== 0 &&
      members.filter((userRealatedInvitation) => !selectedMemberIds.includes(userRealatedInvitation.user.id)).length ===
        0;

    return (
      <Table celled>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field control={Checkbox} checked={allChecked} onChange={() => onChecked('All')} />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사번</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">연락처</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">이메일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">소속부서명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">초대정보</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록 일자</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members && members.length ? (
            members.map((userWithInvitation, index) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    checked={selectedMemberIds.includes(userWithInvitation.user.id)}
                    onChange={() => onChecked(userWithInvitation.user.id)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">
                  {getPolyglotToAnyString(userWithInvitation.user.name) ||
                    getPolyglotToAnyString(userWithInvitation.user.name, Language.Ko) ||
                    getPolyglotToAnyString(userWithInvitation.user.name, Language.En) ||
                    getPolyglotToAnyString(userWithInvitation.user.name, Language.Zh)}
                </Table.Cell>
                <Table.Cell textAlign="center">{userWithInvitation.user.employeeId}</Table.Cell>
                <Table.Cell textAlign="center">{userWithInvitation.user.phone}</Table.Cell>
                <Table.Cell textAlign="center">{userWithInvitation.user.email}</Table.Cell>
                <Table.Cell textAlign="center">
                  {getPolyglotToAnyString(userWithInvitation.user.departmentName)}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {userWithInvitation.invitation && userWithInvitation.invitation.id
                    ? `${moment(userWithInvitation.invitation.invitationTime).format('YYYY.MM.DD')} / ${
                        (userWithInvitation.invitation.byEmail && 'EMAIL') || ''
                      } ${(userWithInvitation.invitation.bySms && 'SMS') || ''}`
                    : '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {moment(userWithInvitation.user.registeredTime).format('YYYY.MM.DD')}
                </Table.Cell>
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

export default UserWorkspaceAccountListView;
