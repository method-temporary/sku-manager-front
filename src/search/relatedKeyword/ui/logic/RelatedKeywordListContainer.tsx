import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Container,
  Breadcrumb,
  Header,
  Segment,
  Form,
  Grid,
  Icon,
  Input,
  Button,
  Table,
  Select,
  Pagination,
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import XLSX from 'xlsx';
import qs from 'qs';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

import { reactAlert, reactConfirm } from '@nara.platform/accent';

import { axiosApi } from 'shared/axios/Axios';
import { AxiosReturn } from 'shared/present';
import { OffsetElementList, PolyglotString } from 'shared/model';
import { SubActions } from 'shared/components';
import { createStore } from 'shared/store';

interface RelatedKeyword {
  id: string;
  keyword: string;
  modifiedTime: number;
  modifier: string;
  modifierName: PolyglotString | null;
  registeredTime: number;
  registrant: string;
  registrantName: PolyglotString;
  relatedKeywords: string[];
}

interface ListProps {
  startDate: Date;
  endDate: Date;
  keyword: string;
  page: number;
  limit: number;
  totalCount: number;
  items: RelatedKeyword[];
}

interface RelatedKeywordExcel {
  검색어: string;
  '연관 검색어': string;
  '등록 일자': string;
  생성자: string;
}

const initializedValue: ListProps = {
  startDate: moment('2019-12-01').startOf('day').toDate(),
  endDate: moment().endOf('day').toDate(),
  keyword: '',
  page: 1,
  limit: 20,
  totalCount: 0,
  items: [],
};

const [setListProps, onListProps, getListProps, useListProps] = createStore<ListProps>(initializedValue);

const PATH = [
  { key: 'Home', content: 'HOME', link: false },
  { key: 'Support', content: '서비스 관리', link: false },
  { key: 'Search', content: '검색 관리', active: false },
  { key: 'relatableSearch', content: '연관검색어 관리', active: true },
];

const LIMIT_OPTIONS = [
  { key: '1', text: '20개씩 보기', value: 20 },
  { key: '2', text: '50개씩 보기', value: 50 },
  { key: '3', text: '100개씩 보기', value: 100 },
];

const API_URL = '/api/search/relatedKeyword/admin';

function validateKeyword(keyword: string) {
  return keyword.trim().length > 1;
}

function validateRelatedKeywords(relatedKeywords: string) {
  return relatedKeywords
    .split(',')
    .map((c) => c.trim())
    .every((c) => c.length > 1);
}

async function requestPostRelatedKeyword(keyword: string, relatedKeyword: string) {
  await axiosApi.post<string>(API_URL, { keyword, relatedKeywords: relatedKeyword.split(',').map((c) => c.trim()) });
  requestGetRelatedKeyword();
}

async function requestExistsByKeyword(keyword: string) {
  return axiosApi.get<boolean>(`${API_URL}//exists`, { params: { keyword } }).then((c) => c.data);
}

async function requestPutRelatedKeyword(id: string, relatedKeyword: string) {
  await axiosApi.put<string>(`${API_URL}/${id}`, { relatedKeywords: relatedKeyword.split(',').map((c) => c.trim()) });
  requestGetRelatedKeyword();
}

async function requestDeleteRelatedKeyword(id: string) {
  await axiosApi.delete(`${API_URL}/${id}`);
  requestGetRelatedKeyword();
}

async function requestConanSuggest(keyword: string) {
  return axiosApi
    .get<string[]>(
      `https://mysuni.sk.com/search/api/suggestion?target=related&domain_no=0&term=${keyword}&max_count=10`
    )
    .then(AxiosReturn);
}

function requestGetRelatedKeyword() {
  const props = getListProps();
  if (props === undefined) {
    return;
  }
  const { startDate, endDate, limit, keyword, page } = props;
  const offset = (page - 1) * limit;
  const params: any = {
    startDate: moment(startDate).startOf('day').toDate().getTime(),
    endDate: moment(endDate).endOf('day').toDate().getTime(),
    offset,
    limit,
  };
  if (keyword.length > 0) {
    params.keyword = keyword;
  }
  axiosApi
    .get<OffsetElementList<RelatedKeyword>>(API_URL, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
    })
    .then((r) => {
      if (r.data !== undefined) {
        const preProps = getListProps() || initializedValue;
        setListProps({ ...preProps, totalCount: r.data.totalCount, items: r.data.results });
      }
    });
}

async function requestGetRelatedKeywordForExcel() {
  const props = getListProps();
  if (props === undefined) {
    return;
  }
  const { startDate, endDate, keyword } = props;
  const params: any = {
    startDate: moment(startDate).startOf('day').toDate().getTime(),
    endDate: moment(endDate).endOf('day').toDate().getTime(),
    offset: 0,
    limit: 99999999,
    keyword,
  };

  setExcelHistoryParams({
    searchUrl: API_URL,
    searchParam: params,
    workType: 'Excel Download',
  });

  axiosApi
    .get<OffsetElementList<RelatedKeyword>>(API_URL, {
      params,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'comma' }),
    })
    .then((r) => {
      if (r.data !== undefined) {
        //
        const wbList: RelatedKeywordExcel[] = [];

        r.data.results.forEach((relatedKeyword) => {
          wbList.push({
            검색어: relatedKeyword.keyword,
            '연관 검색어': relatedKeyword.relatedKeywords.join(','),
            '등록 일자': moment(relatedKeyword.registeredTime).format('YYYY.MM.DD HH:mm:ss'),
            생성자: relatedKeyword.registrantName.ko,
          });
        });

        excelDown(wbList);
      }
    });
}

function excelDown(wbList: RelatedKeywordExcel[]) {
  //
  const relatedKeywordExcel = XLSX.utils.json_to_sheet(wbList);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, relatedKeywordExcel, '연관 검색어');

  const date = moment().format('YYYY-MM-DD_HH:mm:ss');
  const fileName = `연관 검색어.${date}.xlsx`;
  XLSX.writeFile(wb, fileName, { compression: true });
  return fileName;
}

function SearchBox() {
  const props = useListProps();
  if (props === undefined) {
    return null;
  }
  const { startDate, endDate, keyword } = props;

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>등록일자</label>
                <Form.Field>
                  <div className="ui input right icon">
                    <DatePicker
                      placeholderText="시작날짜를 선택해주세요."
                      selected={startDate}
                      onChange={(date: Date) => setListProps({ ...props, startDate: date })}
                      dateFormat="yyyy.MM.dd"
                      maxDate={new Date()}
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </Form.Field>
                <div className="dash">-</div>
                <Form.Field>
                  <div className="ui input right icon">
                    <DatePicker
                      placeholderText="종료날짜를 선택해주세요."
                      selected={endDate}
                      onChange={(date: Date) => setListProps({ ...props, endDate: date })}
                      minDate={startDate}
                      dateFormat="yyyy.MM.dd"
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </Form.Field>
                <Form.Button
                  size="tiny"
                  onClick={() => {
                    const startDate = moment().startOf('day').toDate();
                    const endDate = moment().endOf('day').toDate();
                    setListProps({ ...props, startDate, endDate });
                  }}
                  type="button"
                >
                  오늘
                </Form.Button>
                <Form.Button
                  size="tiny"
                  onClick={() => {
                    const startDate = moment().subtract('week', 1).startOf('day').toDate();
                    const endDate = moment().endOf('day').toDate();
                    setListProps({ ...props, startDate, endDate });
                  }}
                  type="button"
                >
                  최근 1주
                </Form.Button>
                <Form.Button
                  size="tiny"
                  onClick={() => {
                    const startDate = moment().subtract('month', 1).startOf('day').toDate();
                    const endDate = moment().endOf('day').toDate();
                    setListProps({ ...props, startDate, endDate });
                  }}
                  type="button"
                >
                  최근 1개월
                </Form.Button>
                <Form.Button
                  size="tiny"
                  onClick={() => {
                    const startDate = moment().subtract('year', 1).startOf('day').toDate();
                    const endDate = moment().endOf('day').toDate();
                    setListProps({ ...props, startDate, endDate });
                  }}
                  type="button"
                >
                  최근 1년
                </Form.Button>
                <Form.Button
                  size="tiny"
                  onClick={() => {
                    const startDate = moment('2019-12-01').startOf('day').toDate();
                    const endDate = moment().endOf('day').toDate();
                    setListProps({ ...props, startDate, endDate });
                  }}
                  type="button"
                >
                  전체
                </Form.Button>
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>검색어</label>
                <Form.Field
                  control={Input}
                  width={16}
                  placeholder="검색어를 입력해주세요."
                  value={keyword}
                  onChange={(e: any) => setListProps({ ...props, keyword: e.target.value })}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <div className="center">
                <Button primary onClick={() => requestGetRelatedKeyword()}>
                  검색
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
}

function Append() {
  const [keyword, setKeyword] = useState<string>('');
  const [conanSuggest, setConanSuggest] = useState<string>('');
  const [relatedKeyword, setRelatedKeyword] = useState<string>('');
  const setKeywordAndRequestConanSuggest = useCallback(async (nextKeyword: string) => {
    setKeyword(nextKeyword);
    if (nextKeyword.length < 2) {
      setConanSuggest('');
    } else {
      const nextConanSuggest = await requestConanSuggest(nextKeyword);
      if (Array.isArray(nextConanSuggest)) {
        setConanSuggest(nextConanSuggest.join(','));
      }
    }
  }, []);
  return (
    <Segment>
      <Form>
        <Form.Group widths={'equal'}>
          <Form.Field
            control={Input}
            width={16}
            placeholder="검색어"
            value={keyword}
            onChange={(e: any) => setKeywordAndRequestConanSuggest(e.target.value)}
          />
          <Form.Field
            control={Input}
            width={16}
            placeholder="연관 검색어 - 쉼표 기호로 구분"
            value={relatedKeyword}
            onChange={(e: any) => setRelatedKeyword(e.target.value)}
          />
        </Form.Group>
        <Form.Group widths={'equal'}>
          <Form.Field
            readOnly={true}
            control={Input}
            width={16}
            placeholder="검색 엔진에서 수집 한 연관 검색어"
            value={conanSuggest}
          />
        </Form.Group>
        <Button
          primary
          onClick={async () => {
            if (!validateKeyword(keyword)) {
              reactAlert({
                title: '연관 검색어 관리',
                message: '검색어는 공백을 제외한 2글자 이상으로 이루어져야 합니다.',
              });
              return;
            }
            const exist = await requestExistsByKeyword(keyword);
            if (exist === true) {
              reactAlert({
                title: '연관 검색어 관리',
                message: '이미 존재하는 검색어 입니다.',
              });
              return;
            }
            if (!validateRelatedKeywords(relatedKeyword)) {
              reactAlert({
                title: '연관 검색어 관리',
                message: '연관 검색어는 쉼표로 구분한 각 검색어가 모두 공백을 제외한 2글자 이상으로 이루어져야 합니다.',
              });
              return;
            }
            requestPostRelatedKeyword(keyword, relatedKeyword);
            setKeyword('');
            setRelatedKeyword('');
          }}
        >
          추가
        </Button>
      </Form>
    </Segment>
  );
}

interface ItemProps extends RelatedKeyword {
  no: number;
}

function Item(props: ItemProps) {
  const { keyword, relatedKeywords, registeredTime, registrantName, id, no } = props;
  const [localRelatedKeywords, setLocalRelatedKeywords] = useState<string>(relatedKeywords.join(','));
  const changed = useMemo<boolean>(() => {
    return relatedKeywords.join(',') !== localRelatedKeywords;
  }, [relatedKeywords, localRelatedKeywords]);
  useEffect(() => {
    setLocalRelatedKeywords(relatedKeywords.join(','));
  }, [relatedKeywords]);
  return (
    <Table.Row>
      <Table.Cell textAlign="center">{no}</Table.Cell>
      <Table.Cell textAlign="center">{keyword}</Table.Cell>
      <Table.Cell>
        <Input
          label={changed ? { icon: 'edit' } : null}
          fluid
          value={localRelatedKeywords}
          onChange={(e) => {
            setLocalRelatedKeywords(e.target.value);
          }}
        />
      </Table.Cell>
      <Table.Cell textAlign="center">{moment(registeredTime).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
      <Table.Cell textAlign="center">{registrantName.ko}</Table.Cell>
      <Table.Cell textAlign="center">
        <Button
          disabled={!changed}
          onClick={() => {
            if (!validateRelatedKeywords(localRelatedKeywords)) {
              reactAlert({
                title: '연관 검색어 관리',
                message: '연관 검색어는 쉼표로 구분한 각 검색어가 모두 공백을 제외한 2글자 이상으로 이루어져야 합니다.',
              });
              return;
            }

            requestPutRelatedKeyword(id, localRelatedKeywords);
          }}
        >
          저장
        </Button>
      </Table.Cell>
      <Table.Cell textAlign="center">
        <Button
          onClick={() => {
            reactConfirm({
              title: '연관 검색어 관리',
              message: `[${keyword}] 검색어를 정말 삭제하시겠습니까?`,
              onOk: () => {
                requestDeleteRelatedKeyword(id);
              },
            });
          }}
        >
          삭제
        </Button>
      </Table.Cell>
    </Table.Row>
  );
}

function List() {
  const props = useListProps();
  if (props === undefined) {
    return null;
  }
  const { page, limit, totalCount, items } = props;
  const pageIndex = (page - 1) * limit;
  return (
    <>
      <Grid className="list-info">
        <Grid.Row>
          <Grid.Column width={8}>
            <span>
              총 <strong>{totalCount}</strong>개 결과
            </span>
          </Grid.Column>
          <Grid.Column width={8}>
            <div className="right">
              <SubActions.ExcelButton download onClick={requestGetRelatedKeywordForExcel} />
              <Select
                className="ui small-border dropdown m0"
                value={limit}
                control={Select}
                options={LIMIT_OPTIONS}
                onChange={(_: any, data: any) => {
                  setListProps({ ...props, limit: data.value, page: 1 });
                  requestGetRelatedKeyword();
                }}
              />
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table celled selectable>
        <colgroup>
          <col width="60px" />
          <col width="120px" />
          <col width="auto" />
          <col width="100px" />
          <col width="80px" />
          <col width="120px" />
          <col width="120px" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">검색어</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">연관 검색어</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">등록 일자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">생성자</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">저장</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">삭제</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(items.length > 0 &&
            items.map((item, index) => {
              const no = totalCount - (index + pageIndex);
              return <Item key={item.id} no={no} {...item} />;
            })) || (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan={7}>
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

function PaginationView() {
  const props = useListProps();
  if (props === undefined) {
    return null;
  }
  const { page, limit, totalCount } = props;
  return (
    <div className="center">
      <Pagination
        activePage={page}
        totalPages={Math.ceil(totalCount === 0 ? 1 : totalCount / limit)}
        onPageChange={(_: any, data: any) => {
          setListProps({ ...props, page: data.activePage });
          requestGetRelatedKeyword();
        }}
      />
    </div>
  );
}

export function RelatedKeywordListContainer() {
  useEffect(() => {
    requestGetRelatedKeyword();
  }, []);
  return (
    <Container fluid>
      <div>
        <Breadcrumb icon="right angle" sections={PATH} />
        <Header as="h2">연관 검색어 관리</Header>
      </div>
      <SearchBox />
      <Append />
      <List />
      <PaginationView />
    </Container>
  );
}
