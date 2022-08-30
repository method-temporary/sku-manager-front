import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Grid, Segment, Select } from 'semantic-ui-react';

import { SelectType } from 'shared/model';

import { useDashBoardSentenceRdoState } from 'dashBoard/service/useDashBoardSentenceRdoState';
import { useDashBoardSentenceDateOption } from 'dashBoard/service/useDashBoardSentenceDateOption';
import { useDashBoardSentenceRdoShow } from 'dashBoard/service/useDashBoardSentenceRdoShow';
import { useDashBoardSentenceList } from '../../service/useDashBoardSentenceList';
import { setEndDate, setKeywords, setStartDate, setText } from '../../store/DashBoardSentenceRdoStore';
import SearchEndDate from './SearchEndDate';
import SearchText from './SearchText';
import SearchStartDate from './SearchStartDate';
import { TempSearchBox } from '../../../shared/components';
import { useDashBoardSentenceText } from '../../service/useDashBoardSentenceText';

const SEARCH_TYPE_OPTIONS = [
  { key: 'All', text: '전체', value: 'All' },
  { key: 'Opened', text: '노출중', value: 'Opened' },
  { key: 'Temp', text: '임시저장', value: 'Temp' },
  { key: 'Closed', text: '미노출', value: 'Closed' },
];

const SearchBox: React.FC = function SearchBox() {
  const [, requestValue] = useDashBoardSentenceList();
  const [state, setState] = useDashBoardSentenceRdoState();
  const [show, setShow] = useDashBoardSentenceRdoShow();
  const [dateOption, setDateOption] = useDashBoardSentenceDateOption();
  // const [value, setValue] = useDashBoardSentenceText();

  const serviceIdRef = useRef<number>(0);
  const [serviceId, setServiceId] = useState<string>('');

  const changeState = useCallback((e: any, data: any) => {
    setKeywords('', serviceId);
    setText('', serviceId);
    setState(data.value);
    if (data.value === 'Opened') {
      setShow(true);
    } else if (data.value === 'Closed') {
      setShow(false);
    }
  }, []);

  const changeSearchDateType = useCallback((e: any, data: any) => {
    setKeywords('', serviceId);
    setText('', serviceId);
    setDateOption(data.value);
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
                <Form.Select
                  options={SelectType.dashBoardSentenceDateOptions}
                  onChange={changeSearchDateType}
                  value={dateOption}
                />
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
                <label>상태</label>
                <Form.Field
                  control={Select}
                  placeholder="Select"
                  options={SEARCH_TYPE_OPTIONS}
                  value={state}
                  onChange={changeState}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>문구 Set 명</label>
                {state === 'All' && <SearchText />}
                {state === 'Opened' && <SearchText />}
                {state === 'Temp' && <SearchText />}
                {state === 'Closed' && <SearchText />}
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
      {/*<TempSearchBox onSearch={requestValue} changeProps={() => {}}>*/}
      {/*  <TempSearchBox.Group name="등록일자">*/}
      {/*    <TempSearchBox.Select*/}
      {/*      fieldName={''}*/}
      {/*      value={String(dateOption)}*/}
      {/*      options={SelectType.dashBoardSentenceDateOptions}*/}
      {/*      onChange={changeSearchDateType}*/}
      {/*    />*/}
      {/*    <TempSearchBox.DatePicker*/}
      {/*      startDate={0}*/}
      {/*      startFieldName="startDate"*/}
      {/*      endDate={0}*/}
      {/*      endFieldName="endDate"*/}
      {/*      searchButtons*/}
      {/*    />*/}
      {/*  </TempSearchBox.Group>*/}
      {/*  <TempSearchBox.Group name="상태">*/}
      {/*    <TempSearchBox.Select*/}
      {/*      value={String(state)}*/}
      {/*      options={SEARCH_TYPE_OPTIONS}*/}
      {/*      fieldName="ad"*/}
      {/*      onChange={changeState}*/}
      {/*    />*/}
      {/*  </TempSearchBox.Group>*/}
      {/*  <TempSearchBox.Group name="문구 Set명">*/}
      {/*    <TempSearchBox.Input*/}
      {/*      value={String(value)}*/}
      {/*      onChange={setValue}*/}
      {/*      fieldName="asj"*/}
      {/*      placeholder="검색어를 입력해주세요"*/}
      {/*    />*/}
      {/*  </TempSearchBox.Group>*/}
      {/*</TempSearchBox>*/}
    </Segment>
  );
};

export default SearchBox;
