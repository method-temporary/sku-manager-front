import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Grid, Segment, Select, Icon, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useSearchBox, setSearchBox } from 'board/tag/store/SearchBoxStore';
import { requestFindAllConcept, requestfindConcepts, selectField } from 'board/tag/service/requestTag';
import { SearchBox } from 'board/tag/model/SearchBox';
import Concept from 'board/tag/model/Concept';

//TODO : 기획서 확정 후 추가
const COMPETENCY_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  // { key: 'DT', text: 'DT', value: 'DT' },
  // { key: 'AI', text: 'AI', value: 'AI' },
];

const SEARCH_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  { key: 'CONCEPT', text: 'Concept', value: 'CONCEPT' },
  { key: 'CREATOR', text: '생성자', value: 'CREATOR' },
  { key: 'UPDATER', text: '수정자', value: 'UPDATER' },
];

interface SearchBoxContainerProps {
  searchBox: SearchBox;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const SearchBoxContainer: React.FC<SearchBoxContainerProps> = function SearchBoxContainer({ searchBox }) {
  const [startDate, setStartDate] = useState<moment.Moment>();
  const [endDate, setEndDate] = useState<moment.Moment>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const [conceptId, setConceptId] = useState<string>('');
  const [concepts, setConcepts] = useState<any[]>();

  useEffect(() => {
    setSearchBox({
      ...searchBox,
      startDate: startDate && startDate.toDate().getTime(),
      endDate: endDate && endDate.toDate().getTime(),
    });
  }, [startDate, endDate]);

  const setToday = useCallback(() => {
    setStartDate(moment().startOf('day'));
    setEndDate(moment().endOf('day'));
  }, []);

  const setRecentWeek = useCallback(() => {
    setStartDate(moment().subtract(1, 'week').startOf('day'));
    setEndDate(moment().endOf('day'));
  }, []);

  const setRecentMonth = useCallback(() => {
    setStartDate(moment().subtract(1, 'month').startOf('day'));
    setEndDate(moment().endOf('day'));
  }, []);

  const setRecentYear = useCallback(() => {
    setStartDate(moment().subtract(1, 'year').startOf('day'));
    setEndDate(moment().endOf('day'));
  }, []);

  useEffect(() => {
    setRecentYear();
    setConcepts(selectField(true));
  }, []);

  useEffect(() => {
    //TODO : 차후 로직 개선 고민
    if (searchType === 'CONCEPT') {
      setSearchBox({
        ...searchBox,
        conceptName: searchText || '',
        registrantName: '',
        modifierName: '',
      });
    } else if (searchType === 'CREATOR') {
      setSearchBox({
        ...searchBox,
        conceptName: '',
        registrantName: searchText || '',
        modifierName: '',
      });
    } else if (searchType === 'UPDATER') {
      setSearchBox({
        ...searchBox,
        conceptName: '',
        registrantName: '',
        modifierName: searchText || '',
      });
    } else {
      setSearchBox({
        ...searchBox,
        conceptName: '',
        registrantName: '',
        modifierName: '',
      });
    }
  }, [searchType, searchText]);

  useEffect(() => {
    if (conceptId === '전체') {
      setSearchBox({
        ...searchBox,
        conceptId: '',
      });
    } else {
      setSearchBox({
        ...searchBox,
        conceptId,
      });
    }
  }, [conceptId]);

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
                      selected={startDate?.toDate()}
                      onChange={(date: Date) => setStartDate(moment(date))}
                      dateFormat="yyyy.MM.dd"
                      maxDate={moment().toDate()}
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </Form.Field>
                <div className="dash">-</div>
                {/* <SearchEndDate /> */}
                <Form.Field>
                  <div className="ui input right icon">
                    <DatePicker
                      placeholderText="종료날짜를 선택해주세요."
                      selected={endDate?.toDate()}
                      onChange={(date: Date) => setEndDate(moment(date))}
                      dateFormat="yyyy.MM.dd"
                      maxDate={moment().toDate()}
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </Form.Field>
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
                  defaultValue={SEARCH_TYPE_OPTIONS[0].value}
                  onChange={(e: any, data: any) => setSearchType(data.value)}
                  // value={searchBox?.searchType || SEARCH_TYPE_OPTIONS[0].value}
                  // onChange={(e: any, data: any) => setSearchType(data.value)}
                />
                <Form.Field
                  control={Input}
                  width={10}
                  placeholder="검색어를 입력해주세요."
                  disabled={searchType === ''}
                  value={searchText}
                  onChange={(e: any, data: any) => setSearchText(data.value)}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <div className="center">
                <Button primary onClick={() => requestFindAllConcept()}>
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

export default SearchBoxContainer;
