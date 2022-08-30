import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Grid, Icon, Pagination, Table, Select, Radio } from 'semantic-ui-react';
import moment from 'moment';

import { SelectType } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { DashBoardSentenceViewModel } from '_data/arrange/dashboardMessage/model/DashBoardSentenceModel';
import { useDashBoardSentenceRdoLimit } from 'dashBoard/service/useDashBoardSentenceRdoLimit';

interface SearchTagListViewProps {
  searched?: boolean;
  totalCount?: number;
  results: DashBoardSentenceViewModel[];
  empty: boolean;
  offset: number;
  limit: number;
  changePage: (_: any, data: any) => void;
  changeLimit: (_: any, data: any) => void;
  check: (id: string) => void;
  changeExposure: (id: string, value: boolean) => void;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const DashBoardSentenceListView: React.FC<SearchTagListViewProps> = function SearchTagListView({
  searched = false,
  totalCount = 0,
  offset,
  limit,
  results,
  changePage,
  changeLimit,
  check,
  changeExposure,
}) {
  const [filterLimit] = useDashBoardSentenceRdoLimit();
  const location = useLocation();
  const history = useHistory();
  const routeToCreate = useCallback(() => {
    const parentPath = location.pathname.split('/dash-board-sentence')[0];
    const createPath = `${parentPath}/dash-board-sentence-create`;
    history.push(createPath);
  }, [location, history]);
  const routeToDetail = useCallback(
    (Id) => {
      const parentPath = location.pathname.split('/dash-board-sentence')[0];
      const createPath = `${parentPath}/dash-board-sentence-modify/${Id}`;
      history.push(createPath);
    },
    [location, history]
  );

  return (
    <>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              {searched ? '총' : '전체'} <strong>{totalCount}</strong>
              {searched ? '개의 문구 Set 검색 결과' : '개의 문구 Set 등록'}
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                value={filterLimit}
                options={SelectType.limit}
                onChange={changeLimit}
              />
              <Button type="button" onClick={routeToCreate}>
                <Icon name="plus" />
                Create
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table celled selectable>
        <colgroup>
          <col width="5%" />
          <col width="48%" />
          <col width="10%" />
          <col width="15%" />
          <col width="12%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">문구 Set명</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">상태</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">노출기간</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">최종 수정일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">노출여부</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {results.length === 0 && (
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
          {results.length > 0 &&
            results.map((item, index) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(item.id)}>
                  {totalCount - index - (Math.ceil(offset === 0 ? 1 : offset / limit + 1) - 1) * 20}
                </Table.Cell>
                <Table.Cell onClick={() => routeToDetail(item.id)}>{item.name}</Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(item.id)}>
                  {item.state === 'temp' && '임시저장'}
                  {item.show && item.state === 'regular' && '노출중'}
                  {!item.show && item.state === 'regular' && '미노출'}
                </Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(item.id)}>
                  {item.exposureDateOption && '상시'}
                  {!item.exposureDateOption && (
                    <>
                      {timeToDateString(item.startDate)}~{timeToDateString(item.endDate)}
                    </>
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(item.id)}>
                  {getPolyglotToAnyString(item.registrantName)}
                </Table.Cell>
                <Table.Cell textAlign="center" onClick={() => routeToDetail(item.id)}>
                  {timeToDateString(item.modifiedTime)}
                </Table.Cell>
                {item.state === 'temp' && (
                  <>
                    <Table.Cell textAlign="center">
                      <Radio toggle checked={false} value={item.id} />
                    </Table.Cell>
                  </>
                )}
                {item.state !== 'temp' && (
                  <>
                    <Table.Cell textAlign="center">
                      <Radio
                        toggle
                        checked={item.show}
                        value={item.id}
                        onChange={() => {
                          changeExposure(item.id, item.show);
                        }}
                      />
                    </Table.Cell>
                  </>
                )}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <div className="center">
        <Pagination
          activePage={Math.ceil(offset === 0 ? 1 : offset / limit + 1)}
          totalPages={Math.ceil(totalCount === 0 ? 1 : totalCount / limit)}
          onPageChange={changePage}
        />
      </div>
    </>
  );
};

export default DashBoardSentenceListView;
