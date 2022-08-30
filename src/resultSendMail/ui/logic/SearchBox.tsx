import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Grid, Icon, Input, Segment, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { QueryModel, SearchPeriodType } from 'shared/model';

import ResultMailService from 'resultSendMail/present/logic/ResultMailService';

interface Props {
  resultMailService?: ResultMailService;
  onSearch: (page?: number) => void;
  onChangeQueryProps: (name: string, value: any) => void;
  onClearQueryProps: () => void;
  queryModel: QueryModel;
  searchWordOption: any;
  collegeAndChannel: boolean;
  defaultPeriod: number;
  defaultPeriodType?: string;
}

interface States {
  isSelectedCollege: boolean;
}

@inject('resultMailService')
@observer
@reactAutobind
class SearchBox extends React.Component<Props, States> {
  //
  componentDidMount() {
    //
    const { queryModel, resultMailService, defaultPeriod, defaultPeriodType, searchWordOption } = this.props;

    if (defaultPeriod) this.onSetSearchYear(defaultPeriod);

    if (defaultPeriod && defaultPeriodType === SearchPeriodType.Month) {
      this.onSetSearchMon(defaultPeriod);
    } else if (defaultPeriod && defaultPeriodType === SearchPeriodType.Week) {
      this.onSetSearchWeek(defaultPeriod);
    } else if (defaultPeriod && defaultPeriodType === SearchPeriodType.Day) {
      this.onSetSearchDate(defaultPeriod);
    }

    //this.onSetSerarchType('전체');
    //this.onSetSerarchWord('');
    if (queryModel.searchPart === '') {
      this.onSetSerarchType(searchWordOption[0].value); // 첫번째 항목 선택
    } else {
      this.onSetSerarchType(queryModel.searchPart);
    }
  }

  setPeriodProps(name: string, value: Moment) {
    //
    const { onChangeQueryProps } = this.props;
    if (name === 'period.startDateMoment') {
      if (isNaN(value.date())) {
        onChangeQueryProps(name, null);
      } else {
        onChangeQueryProps(name, value.startOf('day'));
      }
    }
    if (name === 'period.endDateMoment') {
      if (isNaN(value.date())) {
        onChangeQueryProps(name, null);
      } else {
        onChangeQueryProps(name, value.endOf('day'));
      }
    }
  }

  onSetSearchDate(day?: number) {
    //
    const { onChangeQueryProps } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    if (day) startDate = startDate.subtract(day, 'd');

    onChangeQueryProps('period.endDateMoment', endDate);
    onChangeQueryProps('period.startDateMoment', startDate);
  }

  onSetSearchWeek(week?: number) {
    //
    const { onChangeQueryProps } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    const period = 7;
    let day = 0;
    if (week !== undefined) {
      if (week === 1) {
        day = period - 1;
      } else if (week > 1) {
        day = period * (week - 1) + 6;
      } else {
        day = period * week;
      }
    }

    if (day) startDate = startDate.subtract(day, 'd');

    onChangeQueryProps('period.endDateMoment', endDate);
    onChangeQueryProps('period.startDateMoment', startDate);
  }

  onSetSearchMon(mon?: number) {
    //
    const { onChangeQueryProps } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (mon) startDate = startDate.subtract(mon, 'M');

    onChangeQueryProps('period.endDateMoment', endDate);
    onChangeQueryProps('period.startDateMoment', startDate);
  }

  onSetSearchYear(year?: number) {
    //
    const { onChangeQueryProps } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (year) startDate = startDate.subtract(year, 'y');

    onChangeQueryProps('period.endDateMoment', endDate);
    onChangeQueryProps('period.startDateMoment', startDate);
  }

  onSetSerarchType(searchType: string) {
    const { onChangeQueryProps } = this.props;
    onChangeQueryProps('searchPart', searchType);
  }

  onSetSerarchWord(searchWord: string) {
    const { onChangeQueryProps } = this.props;
    onChangeQueryProps('searchWord', searchWord);
  }

  render() {
    const { onSearch, onChangeQueryProps, children, queryModel, searchWordOption } = this.props;
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
                        selected={(queryModel && queryModel.period && queryModel.period.startDateObj) || ''}
                        onChange={(date: Date) => this.setPeriodProps('period.startDateMoment', moment(date))}
                        dateFormat="yyyy.MM.dd"
                        maxDate={moment().toDate()}
                      />
                      <Icon name="calendar alternate outline" />
                    </div>
                  </Form.Field>
                  <div className="dash">-</div>
                  <Form.Field>
                    <div className="ui input right icon">
                      <DatePicker
                        placeholderText="종료날짜를 선택해주세요."
                        selected={(queryModel && queryModel.period && queryModel.period.endDateObj) || ''}
                        onChange={(date: Date) => this.setPeriodProps('period.endDateMoment', moment(date))}
                        minDate={queryModel && queryModel.period && queryModel.period.startDateObj}
                        dateFormat="yyyy.MM.dd"
                        maxDate={moment().toDate()}
                      />
                      <Icon name="calendar alternate outline" />
                    </div>
                  </Form.Field>
                  <Form.Button size="tiny" onClick={() => this.onSetSearchDate()} type="button">
                    오늘
                  </Form.Button>
                  <Form.Button size="tiny" onClick={() => this.onSetSearchWeek(1)} type="button">
                    최근 1주
                  </Form.Button>
                  <Form.Button size="tiny" onClick={() => this.onSetSearchMon(1)} type="button">
                    최근 1개월
                  </Form.Button>
                  <Form.Button size="tiny" onClick={() => this.onSetSearchYear(1)} type="button">
                    최근 1년
                  </Form.Button>
                </Form.Group>
              </Grid.Column>
              {children}
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label>검색어</label>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={searchWordOption}
                    value={(queryModel && queryModel.searchPart) || '전체'}
                    onChange={(e: any, data: any) => onChangeQueryProps('searchPart', data.value)}
                  />
                  <Form.Field
                    control={Input}
                    width={10}
                    placeholder="검색어를 입력해주세요."
                    value={(queryModel && queryModel.searchWord) || ''}
                    disabled={(queryModel && queryModel.searchPart === '') || queryModel.searchPart === '전체'}
                    onChange={(e: any) => onChangeQueryProps('searchWord', e.target.value)}
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={16}>
                <div className="center">
                  <Button primary onClick={() => onSearch(1)}>
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
}

export default SearchBox;
