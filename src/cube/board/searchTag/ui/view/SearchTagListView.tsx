import moment from 'moment';
import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Button, Checkbox, Form, Grid, Icon, Pagination, Table, Select } from 'semantic-ui-react';

import { SelectType } from 'shared/model';
import { Loader, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { SearchTagViewModel } from '../../model/SearchTag';
import { useSearchTagRdoLimit } from '../../service/useSearchTagRdoLimit';

interface SearchTagListViewProps {
  searched?: boolean;
  totalCount?: number;
  results: SearchTagViewModel[];
  empty: boolean;
  offset: number;
  limit: number;
  requestExcel: () => string;
  changePage: (_: any, data: any) => void;
  changeLimit: (_: any, data: any) => void;
  deleteSearchTags: () => void;
  check: (id: string) => void;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const SearchTagListView: React.FC<SearchTagListViewProps> = function SearchTagListView({
  searched = false,
  totalCount = 0,
  offset,
  limit,
  results,
  requestExcel,
  changePage,
  changeLimit,
  deleteSearchTags,
  check,
}) {
  const [filterLimit] = useSearchTagRdoLimit();
  const location = useLocation();
  const history = useHistory();
  const routeToCreate = useCallback(() => {
    const parentPath = location.pathname.split('/tag-list')[0];
    const createPath = `${parentPath}/tag-create`;
    history.push(createPath);
  }, [location, history]);
  const routeToDetail = useCallback(
    (tagId) => {
      const parentPath = location.pathname.split('/tag-list')[0];
      const createPath = `${parentPath}/tag-modify/${tagId}`;
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
              {searched ? '개의 Tag 검색 결과' : '개 Tag 등록'}
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <Select
                className="ui small-border dropdown m0"
                value={filterLimit}
                control={Select}
                options={SelectType.limit}
                onChange={changeLimit}
              />
              <SubActions.ExcelButton download onClick={async () => requestExcel()} />
              <Button type="button" onClick={deleteSearchTags}>
                <Icon name="minus" />
                Delete
              </Button>
              <Button type="button" onClick={routeToCreate}>
                <Icon name="plus" />
                Create
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Loader>
        <Table celled selectable>
          <colgroup>
            <col width="5%" />
            <col width="10%" />
            <col width="36%" />
            <col width="15%" />
            <col width="12%" />
            <col width="10%" />
            <col width="12%" />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Tag</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">유사어</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">등록일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">최종업데이트</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">수정자</Table.HeaderCell>
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
              results.map((searchTag) => (
                <Table.Row key={searchTag.id}>
                  <Table.Cell>
                    <Form.Field control={Checkbox} onClick={() => check(searchTag.id)} checked={searchTag.checked} />
                  </Table.Cell>
                  <Table.Cell onClick={() => routeToDetail(searchTag.id)}>{searchTag.tag}</Table.Cell>
                  <Table.Cell onClick={() => routeToDetail(searchTag.id)}>{searchTag.keywords}</Table.Cell>
                  <Table.Cell textAlign="center" onClick={() => routeToDetail(searchTag.id)}>
                    {timeToDateString(searchTag.registeredTime)}
                  </Table.Cell>
                  <Table.Cell onClick={() => routeToDetail(searchTag.id)}>
                    {getPolyglotToAnyString(searchTag.registrant.name)}
                  </Table.Cell>
                  <Table.Cell onClick={() => routeToDetail(searchTag.id)}>
                    {searchTag.modifiedTime ? moment(searchTag.modifiedTime).format('YYYY-MM-DD') : ''}
                  </Table.Cell>
                  <Table.Cell onClick={() => routeToDetail(searchTag.id)}>
                    {searchTag.modifier && getPolyglotToAnyString(searchTag.modifier.name)}
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </Loader>
      <div className="center">
        <Pagination
          activePage={Math.ceil(offset === 0 ? 1 : offset / limit)}
          totalPages={Math.ceil(totalCount === 0 ? 1 : totalCount / limit)}
          onPageChange={changePage}
        />
      </div>
    </>
  );
};

export default SearchTagListView;
