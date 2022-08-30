import React from 'react';
import { Icon, Radio, Table } from 'semantic-ui-react';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { onChangeSenderAllowed, onChangeSenderDisAllowed } from 'sms/event/smsSenderEvent';
import { SmsSenderListItemModel } from 'sms/viewmodel/SmsSenderViewModel';

interface SmsSenderListViewProps {
  smsNo: number;
  smsList?: SmsSenderListItemModel[];
}

export function SmsSenderListView({ smsNo, smsList }: SmsSenderListViewProps) {
  return (
    <Table celled selectable className="table-fixed">
      <colgroup>
        <col width="5%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">소속회사</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">소속부서명</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">Email</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">SMS 발송권한</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(smsList !== undefined &&
          smsList.length > 0 &&
          smsList.map((sms: SmsSenderListItemModel, index) => {
            return (
              <Table.Row key={sms.id}>
                <Table.Cell textAlign="center">{smsNo - index}</Table.Cell>
                <Table.Cell>{sms?.companyName !== undefined ? getPolyglotToAnyString(sms.companyName) : ''}</Table.Cell>
                <Table.Cell>
                  {sms?.departmentName !== undefined ? getPolyglotToAnyString(sms.departmentName) : ''}
                </Table.Cell>
                <Table.Cell textAlign="center">{sms.name}</Table.Cell>
                <Table.Cell>{sms.email}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Radio
                    toggle
                    checked={sms.allowed}
                    value={sms.id}
                    onChange={() => {
                      if (sms.allowed) {
                        onChangeSenderDisAllowed(sms.id);
                      } else {
                        onChangeSenderAllowed(sms.id);
                      }
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            );
          })) || (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={6}>
              <div className="no-cont-wrap no-contents-icon">
                <Icon className="no-contents80" />
                <div className="sr-only">콘텐츠 없음</div>
                <div className="text">검색 결과가 없습니다.</div>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
}
