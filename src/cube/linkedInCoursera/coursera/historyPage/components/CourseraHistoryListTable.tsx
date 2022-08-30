import { observer } from 'mobx-react';
import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import { CpHistory } from '../../../../../_data/contentProvider/cpHistories/model/CpHistory';
import dayjs from 'dayjs';
import { getCpHistoryCategoryName } from '../../../../../_data/contentProvider/cpHistories/model/CpHistoryCategory';

interface Props {
  cpHistories: CpHistory[];
}

export const CourseHistoryListTable = observer((props: Props) => {
  //
  const { cpHistories } = props;

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {/*<Table.HeaderCell>id</Table.HeaderCell>*/}
          <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
          {/*<Table.HeaderCell>denizenId</Table.HeaderCell>*/}
          <Table.HeaderCell textAlign="center">동기화 기준시간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">요청시간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">완료시간</Table.HeaderCell>
          <Table.HeaderCell textAlign="center">count</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {(cpHistories &&
          cpHistories.length > 0 &&
          cpHistories.map((cpHistory) => {
            return (
              <Table.Row key={cpHistory.id}>
                {/*<Table.Cell>{cpHistory.id}</Table.Cell>*/}
                <Table.Cell textAlign="center">{getCpHistoryCategoryName(cpHistory.cpSyncHistoryCategory)}</Table.Cell>
                {/*<Table.Cell>{cpHistory.denizenId}</Table.Cell>*/}
                <Table.Cell textAlign="center">
                  {(cpHistory.startDate && dayjs(cpHistory.startDate).format('YY.MM.DD HH:mm:ss')) || '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {(cpHistory.requestTime && dayjs(cpHistory.requestTime).format('YY.MM.DD HH:mm:ss')) || '-'}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {(cpHistory.completeTime && dayjs(cpHistory.completeTime).format('YY.MM.DD HH:mm:ss')) || '-'}
                </Table.Cell>
                <Table.Cell textAlign="center"> {cpHistory.count}</Table.Cell>
              </Table.Row>
            );
          })) || (
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
});
