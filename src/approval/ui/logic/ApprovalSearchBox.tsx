import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Grid, Icon, Input, Segment, Select } from 'semantic-ui-react';
import moment, { Moment } from 'moment';
import DatePicker from 'react-datepicker';

import { reactAutobind } from '@nara.platform/accent';

import { QueryModel, SelectType } from 'shared/model';

import ApprovalCubeService from '../../present/logic/ApprovalCubeService';

interface Props {
  onSearch: (page?: number) => void;
  onClearQueryProps: () => void;
  queryModel: QueryModel;
  searchWordOption: any;
  defaultPeriod?: number;
  approvalCubeService: ApprovalCubeService;
  companyOptions: any;
}

interface States {
  isSelectedCollege: boolean;
}

@inject()
@observer
@reactAutobind
class ApprovalSearchBox extends React.Component<Props, States> {
  //
  componentDidMount() {
    //
    const { defaultPeriod } = this.props;
    defaultPeriod ? this.onSetSearchYear(defaultPeriod) : this.onSetSearchAll();
  }

  setPeriodProps(name: string, value: Moment) {
    //
    const { approvalCubeService } = this.props;
    if (name === 'period.startDateMoment') {
      approvalCubeService.changeApprovalCubeProps(name, value.startOf('day'));
    }
    if (name === 'period.endDateMoment') {
      approvalCubeService.changeApprovalCubeProps(name, value.endOf('day'));
    }
  }

  setProps(name: string, value: any) {
    //
    const { approvalCubeService } = this.props;
    approvalCubeService.changeApprovalCubeProps(name, value);
  }

  onSetSearchDate(day?: number) {
    //
    const { approvalCubeService } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    if (day) startDate = startDate.subtract(day, 'd');

    approvalCubeService.changeApprovalCubeProps('period.endDateMoment', endDate);
    approvalCubeService.changeApprovalCubeProps('period.startDateMoment', startDate);
  }

  onSetSearchWeek(week?: number) {
    //
    const { approvalCubeService } = this.props;
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

    approvalCubeService.changeApprovalCubeProps('period.endDateMoment', endDate);
    approvalCubeService.changeApprovalCubeProps('period.startDateMoment', startDate);
  }

  onSetSearchMon(mon?: number) {
    //
    const { approvalCubeService } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (mon) startDate = startDate.subtract(mon, 'M');

    approvalCubeService.changeApprovalCubeProps('period.endDateMoment', endDate);
    approvalCubeService.changeApprovalCubeProps('period.startDateMoment', startDate);
  }

  onSetSearchYear(year?: number) {
    //
    const { approvalCubeService } = this.props;
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (year) startDate = startDate.subtract(year, 'y');

    approvalCubeService.changeApprovalCubeProps('period.endDateMoment', endDate);
    approvalCubeService.changeApprovalCubeProps('period.startDateMoment', startDate);
  }

  onSetSearchAll() {
    //
    const { approvalCubeService } = this.props;
    const endDate = moment().endOf('day');
    const startDate = moment('2019-12-01').endOf('day');

    approvalCubeService.changeApprovalCubeProps('period.endDateMoment', endDate);
    approvalCubeService.changeApprovalCubeProps('period.startDateMoment', startDate);
  }

  render() {
    const { onSearch, queryModel, searchWordOption, approvalCubeService, companyOptions } = this.props;

    return (
      <Segment>
        <Form className="search-box">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label>신청일자</label>
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
                  <Form.Button size="tiny" onClick={() => this.onSetSearchAll()} type="button">
                    전체
                  </Form.Button>
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Group inline>
                  <label>신청현황</label>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={SelectType.selectProposalState}
                    value={approvalCubeService.approvalQueryCube.proposalState || '전체'}
                    onChange={(e: any, data: any) =>
                      approvalCubeService.changeApprovalCubeProps('proposalState', data.value)
                    }
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form.Group inline>
                  <label>소속사</label>
                  <Form.Field
                    control={Select}
                    placeholder="전체"
                    options={companyOptions}
                    value={approvalCubeService.approvalQueryCube.companyCode || ''}
                    onChange={(e: any, data: any) =>
                      approvalCubeService.changeApprovalCubeProps('companyCode', data.value)
                    }
                  />
                </Form.Group>
              </Grid.Column>

              <Grid.Column width={8}>
                <Form.Group inline>
                  <label>이수여부</label>
                  <Form.Field
                    control={Select}
                    placeholder="전체"
                    options={SelectType.approvalSearchBoxLearningState}
                    value={approvalCubeService.approvalQueryCube.paidCourseLearningState || ''}
                    onChange={(e: any, data: any) =>
                      approvalCubeService.changeApprovalCubeProps('paidCourseLearningState', data.value)
                    }
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label>검색어</label>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={searchWordOption}
                    value={(queryModel && queryModel.searchPart) || 'All'}
                    onChange={(e: any, data: any) =>
                      approvalCubeService.changeApprovalCubeProps('searchPart', data.value)
                    }
                  />
                  <Form.Field
                    control={Input}
                    width={10}
                    placeholder="검색어를 입력해주세요."
                    value={(queryModel && queryModel.searchWord) || ''}
                    disabled={(queryModel && queryModel.searchPart === '') || queryModel.searchPart === 'All'}
                    onChange={(e: any) => approvalCubeService.changeApprovalCubeProps('searchWord', e.target.value)}
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

export default ApprovalSearchBox;
