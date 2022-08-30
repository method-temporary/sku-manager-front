import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Grid, Segment, Select, Icon, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useSearchBox, setSearchBox } from 'board/competency/store/SearchBoxStore';
import { requestFindAllCompetency } from 'board/competency/service/requestCompetency';
import { SearchBox } from 'board/competency/model/SearchBox';

//TODO : 기획서 확정 후 추가
const COMPETENCY_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  { key: 'DT', text: 'DT', value: 'DT' },
  { key: 'AI', text: 'AI', value: 'AI' },
];

const SEARCH_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  { key: 'COMPETENCYNAME', text: '역량명', value: 'COMPETENCYNAME' },
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
  const [competencyGroup, setCompetencyGroup] = useState<string>('');

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
  }, []);

  useEffect(() => {
    //TODO : 차후 로직 개선 고민
    if (searchType === 'COMPETENCYNAME') {
      setSearchBox({
        ...searchBox,
        competencyName: searchText || '',
        creatorName: '',
        updaterName: '',
      });
    } else if (searchType === 'CREATOR') {
      setSearchBox({
        ...searchBox,
        competencyName: '',
        creatorName: searchText || '',
        updaterName: '',
      });
    } else if (searchType === 'UPDATER') {
      setSearchBox({
        ...searchBox,
        competencyName: '',
        creatorName: '',
        updaterName: searchText || '',
      });
    } else {
      setSearchBox({
        ...searchBox,
        competencyName: '',
        creatorName: '',
        updaterName: '',
      });
    }
  }, [searchType, searchText]);

  useEffect(() => {
    if (competencyGroup === 'ALL') {
      setSearchBox({
        ...searchBox,
        competencyGroup: '',
      });
    } else {
      setSearchBox({
        ...searchBox,
        competencyGroup,
      });
    }
  }, [competencyGroup]);

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
                <label>역량군</label>
                <Form.Field
                  control={Select}
                  placeholder="Select"
                  options={COMPETENCY_TYPE_OPTIONS}
                  defaultValue={COMPETENCY_TYPE_OPTIONS[0].value}
                  onChange={(e: any, data: any) => setCompetencyGroup(data.value)}
                />
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
                <Button primary onClick={() => requestFindAllCompetency()}>
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
