import React from 'react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';
import { BadgeApproverModel } from '../../model/BadgeApproverModel';

interface Props {
  checked: boolean;
  startNo: number;
  onClickCheckAll: (value: boolean) => void;
  onClickCheckOne: (index: number, name: string, value: boolean) => void;
  badgeApproverList: BadgeApproverModel[];
  userWorkspaceMap: Map<string, string>;
}

class BadgeApproverListView extends React.Component<Props> {
  //
  render() {
    //
    const { checked, startNo, onClickCheckAll, onClickCheckOne, badgeApproverList, userWorkspaceMap } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="3%" />
          <col width="5%" />
          <col width="25%" />
          <col width="20%" />
          <col width="25%" />
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
            <Table.HeaderCell textAlign="center">승인대상</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(badgeApproverList &&
            badgeApproverList.length &&
            badgeApproverList.map((badgeApprover, index) => (
              <Table.Row key={badgeApprover.id}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    value={badgeApprover.id}
                    checked={badgeApprover.checked}
                    onChange={(event: any, data: any) => onClickCheckOne(index, 'checked', data.checked)}
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{userWorkspaceMap.get(badgeApprover.cineroomId)}</Table.Cell>
                <Table.Cell textAlign="center">{badgeApprover.displayName}</Table.Cell>
                <Table.Cell textAlign="center">{badgeApprover.loginId}</Table.Cell>
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

export default BadgeApproverListView;
