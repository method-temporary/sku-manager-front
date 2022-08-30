import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Grid, Icon, Select, Table } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';

import ResultMailService from 'resultSendMail/present/logic/ResultMailService';

import { ResultMailModel } from '../../model/ResultMailModel';
import ResultEmailModal from '../logic/ResultEmailModal';

interface Props {
  result: ResultMailModel[];
  limit?: number | 20;
  totalCount: number;
  hadleSendMail: () => void;
  handleClickRow: (sendId: string) => void;
  pageIndex: number;
  setCountForFind: (name: string, value: string) => void;
  sortFilter?: string | 'StudentCountDesc';
  resultMailService?: ResultMailService;
}

interface States {
  openModal: boolean;
}

@inject('resultMailService')
@observer
@reactAutobind
class ResultSendMailListView extends React.Component<Props, States> {
  constructor(props: Props) {
    super(props);
    this.state = {
      openModal: false,
    };
  }

  //
  async openResultModal(sendId: string) {
    //
    const { resultMailService } = this.props;
    if (resultMailService) {
      resultMailService.setSendId(sendId);
      await resultMailService.findResultMail(sendId).then(() => {
        this.setState({ openModal: true });
      });
    }
  }

  //
  resultModalClose() {
    this.setState({ openModal: false });
  }

  //
  render() {
    const { result, limit, totalCount, hadleSendMail, handleClickRow, pageIndex, setCountForFind, sortFilter } =
      this.props;
    const { openModal } = this.state;
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
                <Button onClick={hadleSendMail}>메일 보내기</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Table celled selectable>
          <colgroup>
            <col width="4%" />
            <col width="9%" />
            <col />
            <col width="10%" />
            <col width="10%" />
            <col width="9%" />
            <col width="10%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">구분</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">타이틀</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">담당자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">담당자 이메일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">전송상태</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">전송일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">발송자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">발송자 이메일</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(result &&
              result.length &&
              result.map((cube: ResultMailModel, index) => {
                const resultMail = new ResultMailModel(cube);
                const receiverCount = resultMail.receiverEmail?.split(',').length || 0;
                return (
                  <Table.Row key={index} onClick={() => this.openResultModal(resultMail.sendId)}>
                    <Table.Cell textAlign="center">{totalCount - index - pageIndex}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.typeName}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.mailTitle}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.dispatcherName}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.dispatcherEmail}</Table.Cell>
                    <Table.Cell textAlign="center">
                      {receiverCount}건 / {receiverCount}건
                    </Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.getCreateDate}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.senderName}</Table.Cell>
                    <Table.Cell textAlign="center">{resultMail.senderEmail}</Table.Cell>
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
        {openModal && <ResultEmailModal onClose={this.resultModalClose} />}
      </>
    );
  }
}

export default ResultSendMailListView;
