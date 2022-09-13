import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import ko from 'date-fns/locale/ko';
import dayjs from 'dayjs';
import { SearchBox } from '../../../../shared/components';
import CardStudentResultStore from '../CardStudentResult.store';

export const DateSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setStartTime, setEndTime } = CardStudentResultStore.instance;

  const onChangeTimeFromButton = (type: string): void => {
    if (type === 'today') {
      setStartTime(dayjs().toDate());
    } else if (type === 'lastweek') {
      setStartTime(dayjs().subtract(1, 'week').toDate());
    } else if (type === 'lastmonth') {
      setStartTime(dayjs().subtract(1, 'month').toDate());
    } else if (type === 'lastyear') {
      setStartTime(dayjs().subtract(1, 'year').toDate());
    } else if (type === 'total') {
      setStartTime(dayjs().subtract(100, 'year').toDate());
    }
  };

  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>교육기간</label>
        <Form.Field>
          <div className="ui input right icon">
            <DatePicker
              locale={ko}
              placeholderText="시작날짜를 선택해주세요."
              selected={dayjs(cardStudentResultQuery.startTime).toDate()}
              onChange={setStartTime}
              dateFormat="yyyy.MM.dd"
            />
            <Icon name="calendar alternate outline" />
          </div>
        </Form.Field>
        <>
          <div className="dash">-</div>
          <Form.Field>
            <div className="ui input right icon">
              <DatePicker
                placeholderText="종료날짜를 선택해주세요."
                selected={dayjs(cardStudentResultQuery.endTime).toDate()}
                onChange={setEndTime}
                dateFormat="yyyy.MM.dd"
              />
              <Icon name="calendar alternate outline" />
            </div>
          </Form.Field>
        </>
        {/* <>
          <SearchBox.FieldButton size="tiny" onClick={() => onChangeTimeFromButton('today')}>
            오늘
          </SearchBox.FieldButton>
          <SearchBox.FieldButton size="tiny" onClick={() => onChangeTimeFromButton('lastweek')}>
            최근 1주
          </SearchBox.FieldButton>
          <SearchBox.FieldButton size="tiny" onClick={() => onChangeTimeFromButton('lastmonth')}>
            최근 1개월
          </SearchBox.FieldButton>
          <SearchBox.FieldButton size="tiny" onClick={() => onChangeTimeFromButton('lastyear')}>
            최근 1년
          </SearchBox.FieldButton>
          <SearchBox.FieldButton size="tiny" onClick={() => onChangeTimeFromButton('total')}>
            전체
          </SearchBox.FieldButton>
        </> */}
      </Form.Group>
    </Grid.Column>
  );
});
