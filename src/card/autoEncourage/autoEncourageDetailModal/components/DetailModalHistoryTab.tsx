import React, { useEffect } from 'react';
import { Form, Table } from 'semantic-ui-react';
import { useFindAutoEncourageById } from 'card/autoEncourage/autoEncourageFormModal/autoEncourageFormModal.hooks';
import { observer } from 'mobx-react';
import HistoryTabStore from 'card/autoEncourage/historyTab/historyTab.store';
import { useFindSentSmsAndFailedCountByEventIds } from '../autoEncourageDetailModal.hook';
import dayjs from 'dayjs';
import { getSendingMedia, parseLeaningState } from '../utiles';
import { isEmpty } from 'lodash';

export const DetailModalHistoryTab = observer(() => {
  const {
    historyTabState: { autoEncourageId },
  } = HistoryTabStore.instance;

  const { data: autoEncourageData } = useFindAutoEncourageById(autoEncourageId);
  const { mutate: sentFailtedCountMutate, data: findSentFailedCount } = useFindSentSmsAndFailedCountByEventIds();

  useEffect(() => {
    if (autoEncourageData?.deliveryEvent?.smsEventIds) {
      sentFailtedCountMutate(autoEncourageData.deliveryEvent.smsEventIds || []);
    }
  }, [sentFailtedCountMutate, autoEncourageData]);

  if (!autoEncourageData) {
    return null;
  }

  const { title, sentTime, scheduledSendTime, target, emailFormat, smsFormat, targetUsers } = autoEncourageData;

  const isUsedAutoEncourage = sentTime < dayjs().valueOf() ? '사용' : '미사용';
  const fomatedSentTime = scheduledSendTime ? dayjs(scheduledSendTime).format('YYYY-MM-DD HH:mm') : '-';
  const isSentEmail = !isEmpty(autoEncourageData?.deliveryEvent?.emailEventIds) ? true : false;
  const isSentSms = !isEmpty(autoEncourageData?.deliveryEvent?.smsEventIds) ? true : false;
  const smsSuccessCount = targetUsers?.length || 0 - (findSentFailedCount?.totalFailedCount || 0);

  return (
    <Form>
      <Table celled>
        <colgroup>
          <col width="10%" />
          <col width="30%" />
          <col width="10%" />
          <col width="50%" />
        </colgroup>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">독려 제목</Table.Cell>
            <Table.Cell>{title}</Table.Cell>
            <Table.Cell className="tb-header">사용 여부</Table.Cell>
            <Table.Cell>{isUsedAutoEncourage}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">발송일시</Table.Cell>
            <Table.Cell>{fomatedSentTime}</Table.Cell>
            <Table.Cell className="tb-header">독려 대상</Table.Cell>
            <Table.Cell>{parseLeaningState(target.learningState || '')}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">발송매체</Table.Cell>
            <Table.Cell colSpan={3}>{getSendingMedia(emailFormat, smsFormat)}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">E-mail</Table.Cell>
            <Table.Cell colSpan={3}>
              <Table celled>
                <colgroup>
                  <col width="12%" />
                  <col width="88%" />
                </colgroup>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">제목</Table.Cell>
                    <Table.Cell>{emailFormat?.title || '-'}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">내용</Table.Cell>
                    <Table.Cell>
                      <div
                        className="email-contents"
                        dangerouslySetInnerHTML={{
                          __html: emailFormat?.mailContents || '-',
                        }}
                      />
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">발송결과</Table.Cell>
                    <Table.Cell>{isSentEmail ? `성공: ${targetUsers?.length || 0} / 실패: 0 ` : '-'}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">SMS</Table.Cell>
            <Table.Cell colSpan={3}>
              <Table celled>
                <colgroup>
                  <col width="12%" />
                  <col width="88%" />
                </colgroup>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell className="tb-header">발송자</Table.Cell>
                    <Table.Cell>{smsFormat?.operatorName || '-'}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">내용</Table.Cell>
                    <Table.Cell>{smsFormat?.smsContents || '-'}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell className="tb-header">발송결과</Table.Cell>
                    <Table.Cell>
                      <div>
                        {isSentSms
                          ? `성공: ${smsSuccessCount} / 실패: ${findSentFailedCount?.totalFailedCount || 0}`
                          : '-'}
                      </div>
                      <ul>
                        {findSentFailedCount?.smsRsltValMsgAndCountRoms.map((message) => (
                          <li>{`${message.rsltValMsg} : ${message.count}건`}</li>
                        ))}
                      </ul>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Form>
  );
});
