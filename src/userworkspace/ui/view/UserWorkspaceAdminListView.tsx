import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, Table } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { AudienceIdentity } from 'shared/model';

interface Props {
  onClickCheckBox: (id: string, allChecked?: boolean) => void;
  audienceIdentities: AudienceIdentity[];
  selectedAudienceIdentityIds: string[];
  startNo: number;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceAdminListView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onClickCheckBox } = this.props;
    const { audienceIdentities, selectedAudienceIdentityIds, startNo } = this.props;

    const allChecked =
      selectedAudienceIdentityIds.length > 0 &&
      audienceIdentities.filter((target) => !selectedAudienceIdentityIds.includes(target.citizenId)).length === 0;

    return (
      <Table celled>
        <colgroup>
          <col width="3%" />
          <col width="5%" />
          <col />
          <col />
          <col />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">
              <Form.Field control={Checkbox} checked={allChecked} onChange={() => onClickCheckBox('All', allChecked)} />
            </Table.HeaderCell>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">사번</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(audienceIdentities &&
            audienceIdentities.length > 0 &&
            audienceIdentities.map((audienceIdentity, index) => (
              <Table.Row key={index}>
                <Table.Cell textAlign="center">
                  <Form.Field
                    control={Checkbox}
                    checked={selectedAudienceIdentityIds.includes(audienceIdentity.citizenId)}
                    onChange={() =>
                      onClickCheckBox(
                        audienceIdentity.citizenId,
                        selectedAudienceIdentityIds.includes(audienceIdentity.citizenId)
                      )
                    }
                  />
                </Table.Cell>
                <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{audienceIdentity.usid}</Table.Cell>
                <Table.Cell textAlign="center">{audienceIdentity.displayName}</Table.Cell>
                <Table.Cell textAlign="center">{audienceIdentity.loginId}</Table.Cell>
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

export default UserWorkspaceAdminListView;
