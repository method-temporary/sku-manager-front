import React from 'react';
import moment from 'moment';
import { Icon, Table } from 'semantic-ui-react';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MainPagePopupModel } from '../../model/MainPagePopupModel';

interface Props {
  handleClickPopupRow: (popupId: string) => void;
  mainPagePopups: MainPagePopupModel[];
  startNo: number;
}

class MainPagePopupListView extends React.Component<Props> {
  //
  render() {
    //
    const { handleClickPopupRow, mainPagePopups, startNo } = this.props;

    return (
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="5%" />
          <col width="45%" />
          <col width="15%" />
          <col width="7%" />
          {/*<col width="7%"/>*/}
        </colgroup>
        <Table.Header>
          <Table.Row textAlign="center">
            <Table.HeaderCell>No</Table.HeaderCell>
            <Table.HeaderCell>게시여부</Table.HeaderCell>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>기간</Table.HeaderCell>
            <Table.HeaderCell>등록일자</Table.HeaderCell>
            {/*<Table.HeaderCell>작성자</Table.HeaderCell>*/}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {mainPagePopups && mainPagePopups.length ? (
            mainPagePopups.map((view, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                  <Table.Cell textAlign="center">{view.open ? '활성' : '비활성'}</Table.Cell>
                  <Table.Cell onClick={() => handleClickPopupRow(view.id)}>
                    {getPolyglotToAnyString(view.title)}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {view.period.startDate ? moment(view.period.startDate).format('YYYY.MM.DD HH ') : '-'}~
                    {view.period.endDate ? moment(view.period.endDate).format(' YYYY.MM.DD HH') : '-'}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {view.registeredTime ? moment(view.registeredTime).format('YYYY.MM.DD') : '-'}
                  </Table.Cell>
                  {/*<Table.Cell>{view.time}</Table.Cell>*/}
                </Table.Row>
              );
            })
          ) : (
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
  }
}

export default MainPagePopupListView;
