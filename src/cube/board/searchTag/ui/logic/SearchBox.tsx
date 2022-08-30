import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Grid, Segment, Select } from 'semantic-ui-react';
import { useSearchTagList } from '../../service/useSearchTagList';
import { useSearchTagRdoSearchType } from '../../service/useSearchTagRdoSearchType';
import {
  setCreator,
  setEndDate,
  setKeywords,
  setStartDate,
  setTag,
  setText,
  setUpdater,
} from '../../store/SerchTagRdoStore';
import SearchCreator from './SearchCreator';
import SearchEndDate from './SearchEndDate';
import SearchKeywords from './SearchKeywords';
import SearchStartDate from './SearchStartDate';
import SearchTag from './SearchTag';
import SearchText from './SearchText';
import SearchUpdater from './SearchUpdater';

const SEARCH_TYPE_OPTIONS = [
  { key: 'TEXT', text: '전체', value: 'TEXT' },
  { key: 'TAG', text: 'Tag', value: 'TAG' },
  { key: 'KEYWORDS', text: '유사어', value: 'KEYWORDS' },
  { key: 'CREATOR', text: '생성자', value: 'CREATOR' },
  { key: 'UPDATER', text: '최종 업데이트', value: 'UPDATER' },
];

const SearchBox: React.FC = function SearchBox() {
  const [, requestValue] = useSearchTagList();
  const [searchType, setSearchType] = useSearchTagRdoSearchType();

  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');

  const changeSearchType = useCallback((e: any, data: any) => {
    setTag('', serviceId);
    setKeywords('', serviceId);
    setCreator('', serviceId);
    setUpdater('', serviceId);
    setText('', serviceId);
    setSearchType(data.value);
  }, []);

  const setToday = useCallback(() => {
    setStartDate(moment().startOf('day').valueOf(), serviceId);
    setEndDate(moment().endOf('day').valueOf(), serviceId);
  }, [serviceId]);

  const setRecentWeek = useCallback(() => {
    setStartDate(moment().subtract(1, 'week').startOf('day').valueOf(), serviceId);
    setEndDate(moment().endOf('day').valueOf(), serviceId);
  }, [serviceId]);

  const setRecentMonth = useCallback(() => {
    setStartDate(moment().subtract(1, 'month').startOf('day').valueOf(), serviceId);
    setEndDate(moment().endOf('day').valueOf(), serviceId);
  }, [serviceId]);

  const setRecentYear = useCallback(() => {
    setStartDate(moment().subtract(1, 'year').startOf('day').valueOf(), serviceId);
    setEndDate(moment().endOf('day').valueOf(), serviceId);
  }, [serviceId]);

  useEffect(() => {
    serviceIdRef.current++;
    setServiceId(`SearchBox-${serviceIdRef.current}`);
    setRecentYear();
  }, []);

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>등록일자</label>
                <SearchStartDate />
                <div className="dash">-</div>
                <SearchEndDate />
                <Form.Button size="tiny" onClick={setToday} type="button">
                  오늘
                </Form.Button>
                <Form.Button size="tiny" onClick={setRecentWeek} type="button">
                  최근 1주
                </Form.Button>
                <Form.Button size="tiny" onClick={setRecentMonth} type="button">
                  최근 1개월
                </Form.Button>
                <Form.Button size="tiny" onClick={setRecentYear} type="button">
                  최근 1년
                </Form.Button>
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>검색어</label>
                <Form.Field
                  control={Select}
                  placeholder="Select"
                  options={SEARCH_TYPE_OPTIONS}
                  value={searchType}
                  onChange={changeSearchType}
                />
                {searchType === 'TEXT' && <SearchText />}
                {searchType === 'TAG' && <SearchTag />}
                {searchType === 'KEYWORDS' && <SearchKeywords />}
                {searchType === 'CREATOR' && <SearchCreator />}
                {searchType === 'UPDATER' && <SearchUpdater />}
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <div className="center">
                <Button primary onClick={requestValue}>
                  검색
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
};

export default SearchBox;
