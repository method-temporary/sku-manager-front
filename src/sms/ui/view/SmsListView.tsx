import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { maskingPhoneNumber } from 'shared/helper';
import { SmsListItem } from 'sms/viewmodel/SmsListViewModel';

interface SmsListViewProps {
  smsNo: number;
  smsList?: SmsListItem[];
  onClickItem: (smsItem: SmsListItem) => void;
}

export function SmsListView({ smsNo, smsList, onClickItem }: SmsListViewProps) {
  return (
    <Table celled selectable className="table-fixed">
      <colgroup>
        <col width="5%" />
        <col width="10%" />
        <col width="10%" />
        <col />
        <col width="10%" />
        <col width="10%" />
        <col width="10%" />
      </colgroup>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">발신번호</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">수신자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">메세지</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">발송일</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">발송자</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">발송자 이메일</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(smsList !== undefined &&
          smsList.length > 0 &&
          smsList.map((sms: SmsListItem, index) => {
            const totalToCount = sms.to.split(',').length;

            return (
              <Table.Row key={sms.id} onClick={() => onClickItem(sms)}>
                <Table.Cell textAlign="center">{smsNo - index}</Table.Cell>
                <Table.Cell textAlign="center">{maskingPhoneNumber(sms.from)}</Table.Cell>
                <Table.Cell textAlign="center">{totalToCount} 건</Table.Cell>
                <Table.Cell>
                  <span className="ellipsis">{sms.message}</span>
                </Table.Cell>
                <Table.Cell textAlign="center">{sms.sentDate}</Table.Cell>
                <Table.Cell textAlign="center">{sms.senderName}</Table.Cell>
                <Table.Cell textAlign="center">{sms.senderEmail}</Table.Cell>
              </Table.Row>
            );
          })) || (
          <Table.Row>
            <Table.Cell textAlign="center" colSpan={7}>
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
