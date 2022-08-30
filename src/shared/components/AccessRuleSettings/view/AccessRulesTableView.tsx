import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { Button, Icon, Table } from 'semantic-ui-react';
import { GroupBasedAccessRuleModel } from '../../../model/GroupBasedAccessRuleModel';
import UserGroupRuleModel from '../../../model/UserGroupRuleModel';
import { UserGroupSelectModal } from '../../UserGroupSelect';

interface Props {
  onClickUpdateAccess: (arrayList: UserGroupRuleModel[], index: number) => void;
  onClickDeleteAccess: (index: number) => void;
  onModifyAccessRule: (index: number) => void;
  initialModifyAccessRoleValues: (index: number) => void;
  modSuper?: boolean;
  groupBasedAccessRole: GroupBasedAccessRuleModel;
  multiple?: boolean;
  inModal?: boolean;
}

@observer
@reactAutobind
class AccessRulesTableView extends ReactComponent<Props> {
  //
  render() {
    //
    const {
      modSuper,
      onModifyAccessRule,
      onClickDeleteAccess,
      initialModifyAccessRoleValues,
      groupBasedAccessRole,
      multiple,
      inModal,
    } = this.props;

    return (
      <Table>
        <colgroup>
          <col width={inModal ? '75%' : '80%'} />
          <col width={inModal ? '25%' : '20%'} />
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>규칙</Table.HeaderCell>
            <Table.HeaderCell>관리</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {groupBasedAccessRole &&
            groupBasedAccessRole.accessRules &&
            (groupBasedAccessRole.accessRules.length === 0 ? (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={2}>
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">규칙이 없습니다.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            ) : (
              groupBasedAccessRole.accessRules.map((groupAccessRoles, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    {groupAccessRoles.groupRules.map(({ categoryName, userGroupName }, index) => (
                      <Button
                        key={index}
                        className="del no-clickable"
                        style={{ padding: '0 1.125rem', margin: '0.2rem', fontWeight: 400 }}
                      >
                        {categoryName} {' > '} {userGroupName}
                      </Button>
                    ))}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <>
                      <UserGroupSelectModal
                        initialize={() => initialModifyAccessRoleValues(index)}
                        // onCloseModal={() => console.log('창 닫음')}
                        multiple={multiple}
                        onConfirm={() => onModifyAccessRule(index)}
                        button="수정"
                        modSuper={modSuper}
                      />
                      <Button disabled={modSuper} onClick={() => onClickDeleteAccess(index)}>
                        삭제
                      </Button>
                    </>
                  </Table.Cell>
                </Table.Row>
              ))
            ))}
        </Table.Body>
      </Table>
    );
  }
}

export default AccessRulesTableView;
