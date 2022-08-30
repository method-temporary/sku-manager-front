import * as React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment, { Moment } from 'moment';
import { NewDatePeriod } from '../../model/NewDatePeriod';

interface Props {
  title: string;
  period: NewDatePeriod;
  onChangeStartDateProps: (value: Moment) => void;
  onChangeEndDateProps: (value: Moment) => void;
}

@observer
@reactAutobind
class SearchBoxPeriodView extends React.Component<Props> {
  //
  onSetSearchDate(day?: number) {
    //
    const { onChangeStartDateProps, onChangeEndDateProps } = this.props;
    if (typeof day === 'undefined') day = 1;

    const startDate = moment().startOf('day').subtract(day, 'd');

    onChangeStartDateProps(startDate);
    onChangeEndDateProps(moment().endOf('day'));
  }

  onSetSearchWeek(week?: number) {
    //
    const { onChangeStartDateProps, onChangeEndDateProps } = this.props;
    const period = 7;

    if (typeof week === 'undefined') week = 1;

    let startDate = moment().startOf('day');
    let day = 0;
    if (week === 1) {
      day = period - 1;
    } else if (week > 1) {
      day = period * (week - 1) + 6;
    } else {
      day = period * week;
    }

    if (day) startDate = startDate.subtract(day, 'd');

    onChangeStartDateProps(startDate);
    onChangeEndDateProps(moment().endOf('day'));
  }

  onSetSearchMon(mon?: number) {
    //
    const { onChangeStartDateProps, onChangeEndDateProps } = this.props;

    if (typeof mon === 'undefined') mon = 1;

    const startDate = moment().startOf('day').subtract(-1, 'day').subtract(mon, 'M');

    onChangeStartDateProps(startDate);
    onChangeEndDateProps(moment().endOf('day'));
  }

  onSetSearchYear(year?: number) {
    //
    const { onChangeStartDateProps, onChangeEndDateProps } = this.props;

    if (typeof year === 'undefined') year = 1;

    const startDate = moment().startOf('day').subtract(-1, 'day').subtract(year, 'y');

    onChangeStartDateProps(startDate);
    onChangeEndDateProps(moment().endOf('day'));
  }

  render() {
    const { title, period, onChangeStartDateProps, onChangeEndDateProps } = this.props;
    return (
      <Form.Group inline>
        <label>{title}</label>
        <Form.Field>
          <div className="ui input right icon">
            <DatePicker
              placeholderText="시작날짜를 선택해주세요."
              selected={period.startDateObj || ''}
              onChange={(date: Date) => onChangeStartDateProps(moment(date))}
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
              selected={period.endDateObj || ''}
              onChange={(date: Date) => onChangeEndDateProps(moment(date))}
              minDate={period.startDateObj}
              dateFormat="yyyy.MM.dd"
              maxDate={moment().toDate()}
            />
            <Icon name="calendar alternate outline" />
          </div>
        </Form.Field>
        <Form.Button size="tiny" onClick={() => this.onSetSearchDate()} type="button">
          오늘
        </Form.Button>
        <Form.Button size="tiny" onClick={() => this.onSetSearchWeek()} type="button">
          최근 1주
        </Form.Button>
        <Form.Button size="tiny" onClick={() => this.onSetSearchMon()} type="button">
          최근 1개월
        </Form.Button>
        <Form.Button size="tiny" onClick={() => this.onSetSearchYear()} type="button">
          최근 1년
        </Form.Button>
      </Form.Group>
    );
  }
}

export default SearchBoxPeriodView;
