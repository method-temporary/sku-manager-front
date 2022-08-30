import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { onClickSmsMainNumberItem } from 'sms/event/smsMainNumberEvent';
import { SmsMainNumberListItemModel } from 'sms/viewmodel/SmsMainNumberViewModel';

interface SmsMainNumberListViewProps {
  smsNo: number;
  smsList?: SmsMainNumberListItemModel[];
}

export function SmsMainNumberListView({ smsNo, smsList }: SmsMainNumberListViewProps) {
  return (
    <Table celled selectable className="table-fixed">
      <colgroup>
        <col width="5%" />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
        <col width="5%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">발송처</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">등록번호</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">등록자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">활성/비활성</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(smsList !== undefined &&
          smsList.length > 0 &&
          smsList.map((sms, index) => {
            return (
              <Table.Row key={sms.id} onClick={() => onClickSmsMainNumberItem(sms.id)}>
                <Table.Cell textAlign="center">{smsNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{sms.name}</Table.Cell>
                <Table.Cell textAlign="center">{sms.phone}</Table.Cell>
                <Table.Cell textAlign="center">{sms.registrantName}</Table.Cell>
                <Table.Cell textAlign="center">{sms.enabled ? '활성' : '비활성'}</Table.Cell>
              </Table.Row>
            );
          })) || (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={5}>
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
