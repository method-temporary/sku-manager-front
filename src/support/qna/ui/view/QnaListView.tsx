import * as React from 'react';
import { observer } from 'mobx-react';
import { Table, Icon } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import QnaRom from 'support/qna/model/sdo/QnaRom';
import { QuestionState } from 'support/qna/model/vo/QuestionState';
import { RequestChannel } from 'support/qna/model/vo/RequestChannel';

interface Props {
  totalCount: number;
  offset: number;
  results: QnaRom[];
  handleClickQnaRow: (id: string) => void;
  getChannel: (keyword: RequestChannel | '') => string | undefined;
  getCategory: (keyword: string) => string | undefined;
  getState: (keyword: QuestionState) => string | undefined;
}
@observer
@reactAutobind
class QnaListView extends React.Component<Props> {
  //
  render() {
    const { totalCount, offset, results, handleClickQnaRow, getChannel, getCategory, getState } = this.props;
    const tempIdx = offset;
    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="8%" />
          <col width="35%" />
          <col width="7%" />
          <col width="10%" />
          <col width="5%" />
          <col width="10%" />
          <col width="5%" />
          <col width="8%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">접수채널</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">카테고리</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">문의 제목</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">문의일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">회사명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">문의자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">문의자 이메일</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">담당자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">처리상태</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(results &&
            results.length &&
            results.map((post, index) => (
              <Table.Row key={index} onClick={() => handleClickQnaRow(post.question && post.question.id)}>
                <Table.Cell textAlign="center">{totalCount - tempIdx - index}</Table.Cell>
                <Table.Cell textAlign="center">{getChannel(post.question.requestChannel) || ''}</Table.Cell>
                <Table.Cell textAlign="center">{getCategory(post.question.mainCategoryId)}</Table.Cell>
                <Table.Cell textAlign="left">{post.question.title}</Table.Cell>
                <Table.Cell textAlign="center">
                  {moment(post.question && post.question.registeredTime).format('yyyy.MM.DD')}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {(post.inquirerIdentity && getPolyglotToAnyString(post.inquirerIdentity.companyName)) || ''}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {(post.inquirerIdentity && getPolyglotToAnyString(post.inquirerIdentity.name)) || ''}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {(post.inquirerIdentity && post.inquirerIdentity.email) || ''}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {(post.answer && post.answer.content && getPolyglotToAnyString(post.answer.modifierName)) || '미정'}
                </Table.Cell>
                <Table.Cell textAlign="center">{getState(post.question.state) || ''}</Table.Cell>
              </Table.Row>
            ))) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={10}>
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

export default QnaListView;
