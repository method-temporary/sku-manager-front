import React from 'react';
import { Table } from 'semantic-ui-react';

import { SendSmsResultDetailModel } from 'shared/model';
import { maskingPhoneNumber } from 'shared/helper';

interface SmsDetailViewProps {
  from: string;
  to: string;
  message: string;
  sentDate: string;
  detail: SendSmsResultDetailModel;
}

export function SmsDetailView({ from, to, message, sentDate, detail }: SmsDetailViewProps) {
  //
  let failedMessage = `실패 건수: 총 ${detail?.totalFailedCount || 0} 건`;
  detail.smsRsltValMsgAndCountRoms &&
    detail.smsRsltValMsgAndCountRoms.length > 0 &&
    detail.smsRsltValMsgAndCountRoms.map(
      (message) => (failedMessage += '<br>' + `${message?.rsltValMsg}: ${message?.count || 0}건`)
    );

  const toList = to.split(',');
  let maskingToList = '';
  toList.map((number, idx) => {
    if (idx !== 0) {
      maskingToList += ', ';
    }
    maskingToList += maskingPhoneNumber(number);
  });

  return (
    <Table celled>
      <colgroup>
        <col width="20%" />
        <col width="80%" />
      </colgroup>
      <Table.Body>
        <Table.Row>
          <Table.Cell className="tb-header">발신자</Table.Cell>
          <Table.Cell>{maskingPhoneNumber(from)}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">수신자</Table.Cell>
          <Table.Cell>{maskingToList}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">메세지</Table.Cell>
          <Table.Cell style={{ whiteSpace: 'pre-wrap' }}>{message}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">발송일</Table.Cell>
          <Table.Cell>{sentDate}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="tb-header">실패내역</Table.Cell>
          <Table.Cell>
            <div dangerouslySetInnerHTML={{ __html: failedMessage }} />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
}
