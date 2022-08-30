import React from 'react';
import { inject, observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import _ from 'lodash';

import { SearchBox } from 'shared/components';
import SearchBoxService from '../../logic/SearchBoxService';

interface Props {
  startFieldName: string;
  endFieldName?: string;
  searchButtons?: boolean;
  ago?: 'd' | 'w' | 'm' | 'y' | '2y' | string;
  showFormat?: 'd' | 'm';
  locale?: Locale;
  dateFormat?: string;
  unLimitMaxDate?: boolean;
}

interface Injected {
  searchBoxService: SearchBoxService;
}

@inject('searchBoxService')
@observer
@reactAutobind
class CubeDatePickerContainer extends ReactComponent<Props, {}, Injected> {
  //
  static defaultProps = {
    dateFormat: 'yyyy.MM.dd',
    showFormat: 'd',
    // ago: '2y',
    ago: 'all',
  };

  componentDidMount() {
    //
    this.onSetSearchDate(this.props.ago);
  }

  onSetSearchDate(date?: string) {
    //
    const { startFieldName, endFieldName } = this.props;
    const { changePropsFn } = this.injected.searchBoxService;

    if (date === 't') {
      changePropsFn(startFieldName, moment().startOf('d'));
    } else if (date === 'd') {
      changePropsFn(startFieldName, moment().subtract(1, 'd').startOf('d'));
    } else if (date === 'w') {
      changePropsFn(startFieldName, moment().subtract(7, 'd').startOf('d'));
    } else if (date === 'm') {
      changePropsFn(startFieldName, moment().subtract(1, 'M').startOf('d'));
    } else if (date === 'y') {
      changePropsFn(startFieldName, moment().subtract(1, 'y').startOf('d'));
    } else if (date === '2y') {
      changePropsFn(startFieldName, moment().subtract(2, 'y').startOf('d'));
    } else if (date === 'all') {
      changePropsFn(startFieldName, moment('2019-12-01').startOf('d'));
    } else {
      changePropsFn(startFieldName, moment(date).startOf('d'));
    }

    endFieldName && changePropsFn(endFieldName, moment().endOf('d'));
  }

  onChange(name: string, date: Date) {
    //
    const { startFieldName, endFieldName, unLimitMaxDate } = this.props;
    const { searchBoxQueryModel } = this.injected.searchBoxService;

    if (date === null) return;

    const value = name === startFieldName ? moment(date).startOf('d') : moment(date).endOf('d');

    this.injected.searchBoxService.changePropsFn(name, value);

    if (
      unLimitMaxDate &&
      endFieldName &&
      _.get(searchBoxQueryModel, startFieldName).isAfter(_.get(searchBoxQueryModel, endFieldName))
    ) {
      this.injected.searchBoxService.changePropsFn(endFieldName, value);
    }
  }

  render() {
    //
    const { locale, showFormat, dateFormat, startFieldName, endFieldName, searchButtons, unLimitMaxDate } = this.props;
    const { searchBoxQueryModel } = this.injected.searchBoxService;

    return (
      <>
        <Form.Field>
          <div className="ui input right icon">
            <DatePicker
              locale={locale}
              showMonthYearPicker={showFormat === 'm'}
              placeholderText="시작날짜를 선택해주세요."
              selected={
                (searchBoxQueryModel && moment(_.get(searchBoxQueryModel, startFieldName))).toDate() ||
                moment().toDate()
              }
              onChange={(date: Date) => this.onChange(startFieldName, date)}
              dateFormat={dateFormat}
              maxDate={unLimitMaxDate ? null : moment().toDate()}
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
                  selected={
                    (searchBoxQueryModel && moment(_.get(searchBoxQueryModel, endFieldName))).toDate() ||
                    moment().toDate()
                  }
                  onChange={(date: Date) => this.onChange(endFieldName, date)}
                  minDate={searchBoxQueryModel && moment(_.get(searchBoxQueryModel, startFieldName)).toDate()}
                  dateFormat={dateFormat}
                  maxDate={unLimitMaxDate ? null : moment().toDate()}
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
              최근 1주
            </SearchBox.FieldButton>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('m')}>
              최근 1개월
            </SearchBox.FieldButton>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('y')}>
              최근 1년
            </SearchBox.FieldButton>
            <SearchBox.FieldButton size="tiny" onClick={() => this.onSetSearchDate('all')}>
              전체
            </SearchBox.FieldButton>
          </>
        )}
      </>
    );
  }
}

export default CubeDatePickerContainer;
