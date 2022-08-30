import * as React from 'react';
import { observer } from 'mobx-react';
import { Button, Grid, Icon, Select, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';

import { ResultMailDetailModel } from '../../model/ResultMailDetailModel';

interface Props {
  result: ResultMailDetailModel[];
  limit?: number | 20;
  totalCount: number;
  historyBack: () => void;
  pageIndex: number;
  setCountForFind: (name: string, value: string) => void;
  sortFilter?: string | 'StudentCountDesc';
}

@observer
@reactAutobind
class SendMailView extends React.Component<Props> {
  //
  render() {
    const {
      result,
      limit,
      totalCount,
      historyBack,

      pageIndex,
      setCountForFind,
      sortFilter,
    } = this.props;
    return (
      <>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              <span>
                전체 <strong>{totalCount}</strong>개
              </span>
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <Select
                  className="ui small-border dropdown m0"
                  value={limit}
                  control={Select}
                  options={SelectType.limit}
                  onChange={(e: any, data: any) => setCountForFind('limit', data.value)}
                />
                <Button onClick={historyBack}>목록</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Table celled selectable>
          <colgroup>
            <col width="4%" />
            <col width="12%" />
            <col />
            <col width="15%" />
            <col width="12%" />
            <col width="12%" />
            <col width="12%" />
            <col width="12%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">타이틀</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">과정명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">수신자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">수신자이메일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">전송상태</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">전송일</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(result &&
              result.length &&
              result.map((cube: ResultMailDetailModel, index) => {
                const resultMail = new ResultMailDetailModel(cube);
                return (
                  <Table.Row key={index}>
                    <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.typeName}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.mailTitle}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.cubeName}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.receiverName}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.receiverEmail}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.sendStatus ? 'Success' : 'Fail'}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.getCreateDate}</Table.Cell>
                  </Table.Row>
                );
              })) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={14}>
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
      </>
    );
  }
}

export default SendMailView;
