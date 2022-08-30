import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

import { SearchBox } from 'shared/components';
import TempSearchBoxService from '../../logic/TempSearchBoxService';

interface Props {
  startDate: number;
  startFieldName: string;
  endDate?: number;
  endFieldName?: string;
  searchButtons?: boolean;
  ago?: 'd' | 'w' | 'm' | 'y' | '2y' | 'a' | string;
  showFormat?: 'd' | 'm';
  locale?: Locale;
  dateFormat?: string;
  unLimitMaxDate?: boolean;
  isAllDate?: boolean;
  onChangeStartDate?: (data: Date, event?: React.SyntheticEvent) => void;
  onChangeEndDate?: (data: Date, event?: React.SyntheticEvent) => void;
  isModal?: boolean;
}

interface Injected {
  tempSearchBoxService: TempSearchBoxService;
}

@inject('tempSearchBoxService')
@observer
@reactAutobind
class DatePickerContainer extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    dateFormat: 'yyyy.MM.dd',
    showFormat: 'd',
    ago: 'a',
  };

  componentDidMount() {
    //
    this.onSetSearchDate(this.props.ago);
  }

  onSetSearchDate(date?: string) {
    //
    const { startFieldName, endFieldName, onChangeStartDate, onChangeEndDate } = this.props;
    const { changePropsFn } = this.injected.tempSearchBoxService;

    let startDate: Date = dayjs().toDate();

    if (date === 'a') {
      startDate = dayjs('2019-12-01').startOf('d').toDate();
    } else if (date === 't') {
      startDate = dayjs().startOf('d').toDate();
    } else if (date === 'd') {
      startDate = dayjs().subtract(1, 'd').startOf('d').toDate();
    } else if (date === 'w') {
      startDate = dayjs().subtract(7, 'd').startOf('d').toDate();
    } else if (date === 'm') {
      startDate = dayjs().subtract(1, 'M').startOf('d').toDate();
    } else if (date === 'y') {
      startDate = dayjs().subtract(1, 'y').startOf('d').toDate();
    } else if (date === '2y') {
      startDate = dayjs().subtract(2, 'y').startOf('d').toDate();
    }

    onChangeStartDate ? onChangeStartDate(startDate) : changePropsFn(startFieldName, startDate.valueOf());

    if (endFieldName) {
      onChangeEndDate
        ? onChangeEndDate(dayjs().endOf('d').toDate())
        : changePropsFn(endFieldName, dayjs().endOf('d').valueOf());
    }
  }

  onChange(date: Date, event: React.SyntheticEvent | undefined, name: string) {
    //
    const { startDate, startFieldName, endDate, endFieldName, unLimitMaxDate, onChangeStartDate, onChangeEndDate } =
      this.props;

    const { changePropsFn, setIsSearch } = this.injected.tempSearchBoxService;

    if (date === null) return;

    setIsSearch(false);

    if (onChangeStartDate && name === startFieldName) {
      onChangeStartDate(date, event);
      return;
    }

    if (onChangeEndDate && name === endFieldName) {
      onChangeEndDate(date, event);
      return;
    }

    const value = name === startFieldName ? dayjs(date).startOf('d').valueOf() : dayjs(date).endOf('d').valueOf();

    changePropsFn(name, value);
    if (unLimitMaxDate && endFieldName && endDate && startDate > endDate) {
      changePropsFn(endFieldName, value);
    }
  }

  render() {
    //
    const {
      startDate,
      endDate,
      locale,
      showFormat,
      dateFormat,
      startFieldName,
      endFieldName,
      searchButtons,
      unLimitMaxDate,
      ago,
      isModal,
    } = this.props;
    return (
      <>
        <Form.Field>
          <div className="ui input right icon">
            <DatePicker
              locale={locale}
              showMonthYearPicker={showFormat === 'm'}
              placeholderText="시작날짜를 선택해주세요."
              selected={dayjs(startDate).toDate() || dayjs().toDate()}
              onChange={(date: Date, event) => this.onChange(date, event, startFieldName)}
              dateFormat={dateFormat}
              maxDate={unLimitMaxDate ? null : dayjs().toDate()}
            />
            <Icon name="calendar alternate outline" />
          </div>
        </Form.Field>
        {endFieldName && (
          <>
            <div className="dash">-</div>
            <Form.Field>
              <div className="ui input right icon">
                <DatePicker
                  showMonthYearPicker={showFormat === 'm'}
                  placeholderText="종료날짜를 선택해주세요."
                  selected={dayjs(endDate).toDate() || dayjs().toDate()}
                  onChange={(date: Date, event) => this.onChange(date, event, endFieldName)}
                  minDate={dayjs(startDate).toDate()}
                  dateFormat={dateFormat}
                  maxDate={unLimitMaxDate ? null : dayjs().toDate()}
                />
                <Icon name="calendar alternate outline" />
              </div>
            </Form.Field>
          </>
        )}
        {searchButtons && (
          <>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('t')}>
              오늘
            </SearchBox.FieldButton>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('w')}>
              {isModal ? '1주' : '최근 1주'}
            </SearchBox.FieldButton>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('m')}>
              {isModal ? '1개월' : '최근 1개월'}
            </SearchBox.FieldButton>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('y')}>
              {isModal ? '1년' : '최근 1년'}
            </SearchBox.FieldButton>
            {ago === 'a' ? (
              <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('a')}>
                전체
              </SearchBox.FieldButton>
            ) : (
              <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('2y')}>
                최근 2년
              </SearchBox.FieldButton>
            )}
          </>
        )}
      </>
    );
  }
}

export default DatePickerContainer;
