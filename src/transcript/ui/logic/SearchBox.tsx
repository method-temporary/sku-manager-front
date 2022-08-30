import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Form, Grid, Icon, Input, Segment, Select } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { MediaService } from 'cube/media';
import { PanoptoCdoModel } from 'cube/media/model/old/PanoptoCdoModel';
import { CollegeModel } from 'college/model/CollegeModel';
import { CollegeService } from '../../../college';

interface Props {
  mediaService?: MediaService;
  collegeService?: CollegeService;
  onSearch: (page?: number) => void;
  onChangeQueryProps: (name: string, value: any) => void;
  onClearQueryProps?: () => void;
  queryModel: PanoptoCdoModel;
  searchWordOption: any;
  defaultPeriod: number;
  defaultPeriodType?: string;
}

interface State {
  startDate: Date;
  endDate: Date;
}

@inject('mediaService', 'collegeService')
@observer
@reactAutobind
class SearchBox extends React.Component<Props, State> {
  //

  state = {
    startDate: moment().toDate(),
    endDate: moment().toDate(),
  };

  componentDidMount() {
    //
    const { queryModel, collegeService, defaultPeriod, defaultPeriodType, searchWordOption, onChangeQueryProps } =
      this.props;
    this.findAllColleges();
    if (collegeService && queryModel && queryModel.college) {
      collegeService.findMainCollege(queryModel.college);
    }

    this.onSetSearchWeek(1);
  }

  findAllColleges() {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.findAllColleges();
  }

  setCollege() {
    //
    const { collegesForCurrentCineroom } = this.props.collegeService || ({} as CollegeService);
    const collegeSelect: any = [];
    if (collegesForCurrentCineroom) {
      // collegeSelect.push({ key: 'All', text: '전체', value: '전체' });
      collegesForCurrentCineroom.map((college, index) => {
        collegeSelect.push({
          key: index + 1,
          text: getPolyglotToAnyString(college.name),
          value: college.id,
        });
      });
    }

    return collegeSelect;
  }

  onSetCollegeForPanopto(selectedCollege: CollegeModel) {
    //
    const { collegeService } = this.props;
    if (collegeService) collegeService.setCollegeForPanopto(selectedCollege);
  }

  selectCollege(name: string, collegeId: string) {
    const { collegeService, onChangeQueryProps } = this.props;
    if (collegeService && collegeId !== '전체') {
      collegeService
        .findCollege(collegeId)
        .then(() => this.onSetCollegeForPanopto(collegeService.collegeForPanopto))
        .then(() => onChangeQueryProps(name, collegeId))
        .then(() => onChangeQueryProps('folderId', collegeId))
        .then(() => collegeService.clearCollegeForPanopto());
    } else if (collegeService && collegeId === '전체') {
      onChangeQueryProps(name, collegeId);
      collegeService.clearCollegeForPanopto();
    }
  }

  setPeriodProps(name: string, value: Moment) {
    //
    const { mediaService } = this.props;
    const { onChangeQueryProps } = this.props;
    if (name === 'period.startDateMoment') {
      if (isNaN(value.date())) {
        onChangeQueryProps(name, null);
      } else {
        // onChangeQueryProps(name, value.startOf('day'));
        mediaService!.changePanoptoCdoProps(name, value.startOf('day'));
      }
    }
    if (name === 'period.endDateMoment') {
      if (isNaN(value.date())) {
        onChangeQueryProps(name, null);
      } else {
        // onChangeQueryProps(name, value.endOf('day'));
        mediaService!.changePanoptoCdoProps(name, value.endOf('day'));
      }
    }
  }

  onSetSearchDate() {
    //
    const { mediaService } = this.props;

    this.setState({
      startDate: moment().startOf('day').toDate(),
      endDate: moment().startOf('day').toDate(),
    });

    mediaService?.changePanoptoCdoProps('startDate', moment().startOf('day').toDate().getTime());
    mediaService?.changePanoptoCdoProps('endDate', moment().endOf('day').toDate().getTime());
  }

  onSetSearchWeek(week?: number) {
    //
    const { mediaService } = this.props;

    this.setState({
      startDate: moment().subtract(week, 'week').startOf('day').toDate(),
      endDate: moment().startOf('day').toDate(),
    });
    mediaService?.changePanoptoCdoProps('startDate', moment().subtract(week, 'week').startOf('day').toDate().getTime());
    mediaService?.changePanoptoCdoProps('endDate', moment().endOf('day').toDate().getTime());
  }

  onSetSearchMon(mon?: number) {
    //
    const { mediaService } = this.props;
    this.setState({
      startDate: moment().subtract(mon, 'month').startOf('day').toDate(),
      endDate: moment().startOf('day').toDate(),
    });
    mediaService?.changePanoptoCdoProps('startDate', moment().subtract(mon, 'month').startOf('day').toDate().getTime());
    mediaService?.changePanoptoCdoProps('endDate', moment().endOf('day').toDate().getTime());
  }

  onSetSearchYear(year?: number) {
    //
    const { mediaService } = this.props;
    this.setState({
      startDate: moment().subtract(year, 'year').startOf('day').toDate(),
      endDate: moment().startOf('day').toDate(),
    });
    mediaService?.changePanoptoCdoProps('startDate', moment().subtract(year, 'year').startOf('day').toDate().getTime());
    mediaService?.changePanoptoCdoProps('endDate', moment().endOf('day').toDate().getTime());
  }

  onSetSerarchType(searchType: string) {
    const { onChangeQueryProps } = this.props;
    onChangeQueryProps('searchPart', searchType);
  }

  onSetSerarchWord(searchWord: string) {
    const { onChangeQueryProps } = this.props;
    onChangeQueryProps('searchWord', searchWord);
  }

  onChangePanoptoFileName(name: string, value: string) {
    //
    const { mediaService } = this.props;
    mediaService!.changePanoptoCdoProps(name, value);
  }

  render() {
    const { onSearch, onChangeQueryProps, children, queryModel, searchWordOption, mediaService } = this.props;
    const collegeSelect = this.setCollege();
    return (
      <Segment>
        <Form className="search-box">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label style={{ minWidth: '80px' }}>등록일자</label>
                  <Form.Field>
                    <div className="ui input right icon">
                      <DatePicker
                        placeholderText="시작날짜를 선택해주세요."
                        selected={this.state.startDate}
                        onChange={(date: Date) => {
                          this.setState({
                            startDate: moment(date).toDate(),
                          });
                          mediaService?.changePanoptoCdoProps('startDate', moment(date).toDate().getTime());
                          // this.setPeriodProps(
                          //   'period.startDateMoment',
                          //   moment(date)
                          // )
                        }}
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
                        selected={this.state.endDate}
                        onChange={(date: Date) => {
                          this.setState({
                            endDate: moment(date).toDate(),
                          });
                          mediaService?.changePanoptoCdoProps('endDate', moment(date).toDate().getTime());
                        }}
                        minDate={this.state.startDate}
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
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label style={{ minWidth: '80px' }}>Category / Channel</label>
                  <Form.Field
                    control={Select}
                    options={collegeSelect}
                    value={(queryModel && queryModel.college) || '전체'}
                    onChange={(e: any, data: any) => this.selectCollege('college', data.value)}
                  />
                </Form.Group>
              </Grid.Column>
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label style={{ minWidth: '80px' }}>영상명</label>
                  <Form.Field
                    control={Input}
                    width={10}
                    placeholder="영상명을 입력해주세요."
                    value={(queryModel && queryModel.sessionName) || ''}
                    onChange={(e: any, data: any) => this.onChangePanoptoFileName('sessionName', data.value)}
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
