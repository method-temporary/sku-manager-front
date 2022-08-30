import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import { BadgeApproverModel } from '../../model/BadgeApproverModel';

interface Props {
  checked: boolean;
  badgeApprovers: BadgeApproverModel[];
  onClickCheckAll: (value: boolean) => void;
  onClickCheckOne: (index: number, name: string, value: boolean) => void;
  userWorkspaceMap: Map<string, string>;
}

class BadgeApproverModalListView extends React.Component<Props> {
  //
  render() {
    //
    const { checked, badgeApprovers, onClickCheckAll, onClickCheckOne, userWorkspaceMap } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="3%" />
          <col width="30%" />
          <col width="32%" />
          <col width="35%" />
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
            <Table.HeaderCell textAlign="center">승인대상</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badgeApprovers && badgeApprovers.length ? (
            badgeApprovers.map((badgeApprovers, index) => (
              <Table.Row key={badgeApprovers.id}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    value={badgeApprovers.id}
                    checked={badgeApprovers.checked}
                    onChange={(event: any, data: any) => onClickCheckOne(index, 'checked', data.checked)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{userWorkspaceMap.get(badgeApprovers.cineroomId)}</Table.Cell>
                <Table.Cell textAlign="center">{badgeApprovers.displayName}</Table.Cell>
                <Table.Cell textAlign="center">{badgeApprovers.loginId}</Table.Cell>
              </Table.Row>
            ))
          ) : (
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

export default BadgeApproverModalListView;
