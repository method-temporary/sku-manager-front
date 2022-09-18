import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Grid, Icon, Input, Segment, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';

import { CollegeService } from '../../../college';
import { SearchPeriodType, QueryModel } from '../../model';
import { getPolyglotToAnyString } from '../../components/Polyglot';

interface Props {
  onSearch: (page?: number) => void;
  onChangeQueryProps: (name: string, value: any) => void;
  onClearQueryProps: () => void;
  queryModel: QueryModel;
  searchWordOption: any;
  collegeAndChannel: boolean;
  defaultPeriod: number;
  defaultPeriodType?: string;
  inLastChildren?: React.ReactNode;
}

interface States {
  isSelectedCollege: boolean;
}

interface Injected {
  collegeService: CollegeService;
}

@inject('collegeService')
@observer
@reactAutobind
class SearchBox extends ReactComponent<Props, States, Injected> {
  //
  componentDidMount() {
    //
    const { queryModel, defaultPeriod, defaultPeriodType, searchWordOption } = this.props;
    const { collegeService } = this.injected;
    this.findAllColleges();
    if (collegeService && queryModel && queryModel.college) {
      collegeService.findMainCollege(queryModel.college);
    }
    this.onSetSearchDateAll();

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

  findAllColleges() {
    //
    const { collegeService } = this.injected;
    if (collegeService) collegeService.findAllColleges();
  }

  setCollege() {
    //
    const { colleges, collegesForCurrentCineroom } = this.injected.collegeService || ({} as CollegeService);
    const collegeSelect: any = [];
    const cineroomId = patronInfo.getCineroomId();

    const collegeLists = cineroomId === 'ne1-m2-c2' ? colleges : collegesForCurrentCineroom;
    if (collegeLists) {
      collegeSelect.push({ key: 'All', text: '전체', value: '전체' });
      collegeLists.map((college, index) => {
        collegeSelect.push({
          key: index + 1,
          text: getPolyglotToAnyString(college.name),
          value: college.id,
        });
      });
    }

    return collegeSelect;
  }

  selectCollege(name: string, collegeId: string) {
    const { onChangeQueryProps } = this.props;
    const { collegeService } = this.injected;

    if (collegeService && collegeId !== '전체') {
      collegeService
        .findMainCollege(collegeId)
        .then(() => onChangeQueryProps(name, collegeId))
        .then(() => onChangeQueryProps('channel', '전체'));
    } else if (collegeService && collegeId === '전체') {
      onChangeQueryProps(name, collegeId);
      onChangeQueryProps('channel', '');
    }
  }

  setChannel() {
    const { mainCollege } = this.injected.collegeService || ({} as CollegeService);
    const channels = mainCollege && mainCollege.channels;
    const channelSelect: any = [];
    channelSelect.push({ key: 'All', text: '전체', value: '전체' });
    channels?.forEach((channel, index) => {
      channelSelect.push({
        key: index + 1,
        text: getPolyglotToAnyString(channel.name),
        value: channel.id,
      });
    });
    return channelSelect;
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

  onSetSearchDateAll() {
    //
    const { onChangeQueryProps } = this.props;
    const endDate = moment().endOf('day');
    const startDate = moment('2019-12-01').endOf('day');

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
    const { onSearch, onChangeQueryProps, children, queryModel, searchWordOption, collegeAndChannel, inLastChildren } =
      this.props;
    const collegeSelect = this.setCollege();
    const channelSelect = queryModel && queryModel.college && this.setChannel();
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
                  {/* <Form.Button size="tiny" onClick={() => this.onSetSearchDate()} type="button">
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
                  <Form.Button size="tiny" onClick={() => this.onSetSearchDateAll()} type="button">
                    전체
                  </Form.Button> */}
                </Form.Group>
              </Grid.Column>
              {collegeAndChannel ? (
                <Grid.Column width={8}>
                  <Form.Group inline>
                    <label>Category / Channel</label>
                    <Form.Field
                      control={Select}
                      placeholder="Select"
                      options={collegeSelect}
                      value={(queryModel && queryModel.college) || '전체'}
                      onChange={(e: any, data: any) => this.selectCollege('college', data.value)}
                    />
                    {queryModel && queryModel.college ? (
                      <Form.Field
                        control={Select}
                        placeholder="Select"
                        options={channelSelect && channelSelect}
                        value={(queryModel && queryModel.channel) || '전체'}
                        onChange={(e: any, data: any) => onChangeQueryProps('channel', data.value)}
                      />
                    ) : null}
                  </Form.Group>
                </Grid.Column>
              ) : null}
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
              {inLastChildren}
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
