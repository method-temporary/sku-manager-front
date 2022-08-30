import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { UserGroupRuleModel } from 'shared/model';
import { getPolyglotToAnyString, Language } from 'shared/components/Polyglot';

import { UserWithPisAgreement } from '../../model/UserWithPisAgreement';

interface Props {
  checked: boolean;
  startNo: number;
  results: UserWithPisAgreement[];
  onSkProfileClick: (memberId: string) => void;
  onClickCheckAll: (value: boolean) => void;
  onClickCheckOne: (index: number, name: string, value: boolean) => void;
  userGroupMap: Map<number, UserGroupRuleModel>;
}

@observer
@reactAutobind
class UserListView extends React.Component<Props> {
  //
  render() {
    //
    const { startNo, checked, results, onClickCheckAll, onClickCheckOne, onSkProfileClick, userGroupMap } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="3%" />
          <col width="5%" />
          <col width="10%" />
          <col width="10%" />
          <col width="14%" />
          <col width="15%" />
          <col width="14%" />
          <col width="14%" />
          <col width="15%" />
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
            <Table.HeaderCell>사번</Table.HeaderCell>
            <Table.HeaderCell>성명</Table.HeaderCell>
            <Table.HeaderCell>소속회사</Table.HeaderCell>
            <Table.HeaderCell>소속부서명</Table.HeaderCell>
            <Table.HeaderCell>동의일자</Table.HeaderCell>
            <Table.HeaderCell>가입일자</Table.HeaderCell>
            <Table.HeaderCell>사용자 그룹</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {results && results.length ? (
            results.map((userWithPisAgreement, index) => {
              const { user, pisAgreement } = userWithPisAgreement;

              return (
                <Table.Row key={index} onClick={() => onSkProfileClick(user.id)}>
                  <Table.Cell textAlign="center" onClick={(event: any) => event.stopPropagation()}>
                    <Form.Field
                      control={Checkbox}
                      value={user.id}
                      checked={user.checked}
                      onChange={(event: any, data: any) => onClickCheckOne(index, 'checked', data.checked)}
                    />
                  </Table.Cell>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell>{user.employeeId}</Table.Cell>
                  <Table.Cell>
                    {(user.name && getPolyglotToAnyString(user.name)) ||
                      (user.name.ko && getPolyglotToAnyString(user.name, Language.Ko)) ||
                      (user.name.en && getPolyglotToAnyString(user.name, Language.En)) ||
                      (user.name.zh && getPolyglotToAnyString(user.name, Language.Zh))}
                  </Table.Cell>
                  <Table.Cell>
                    {(user.companyName && getPolyglotToAnyString(user.companyName)) ||
                      (user.companyName.ko && getPolyglotToAnyString(user.companyName, Language.Ko)) ||
                      (user.companyName.en && getPolyglotToAnyString(user.companyName, Language.En)) ||
                      (user.companyName.zh && getPolyglotToAnyString(user.companyName, Language.Zh))}
                  </Table.Cell>
                  <Table.Cell>
                    {(user.departmentName && getPolyglotToAnyString(user.departmentName)) ||
                      (user.departmentName.ko && getPolyglotToAnyString(user.departmentName, Language.Ko)) ||
                      (user.departmentName.en && getPolyglotToAnyString(user.departmentName, Language.En)) ||
                      (user.departmentName.zh && getPolyglotToAnyString(user.departmentName, Language.Zh))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {pisAgreement.signedDate === 0 ? 'Disagree' : pisAgreement.getSignedDate}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{user.getCreationTime}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {(user.userGroupSequences &&
                      user.userGroupSequences.sequences.length > 0 &&
                      user.userGroupSequences.sequences.map((sequence, index) =>
                        index === 0
                          ? userGroupMap.get(sequence)?.userGroupName
                          : ', ' + userGroupMap.get(sequence)?.userGroupName
                      )) ||
                      ''}
                  </Table.Cell>
                </Table.Row>
              );
            })
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

export default UserListView;
