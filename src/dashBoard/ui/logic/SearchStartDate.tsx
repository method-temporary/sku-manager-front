import React from 'react';
import { Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useDashBoardSentenceRdoStartDate } from '../../service/useDashBoardSentenceRdoStartDate';

function SearchStartDate() {
  const [value, setValue] = useDashBoardSentenceRdoStartDate();

  return (
    <Form.Field>
      <div className="ui input right icon">
        <DatePicker
          placeholderText="시작날짜를 선택해주세요."
          selected={value}
          onChange={setValue}
          dateFormat="yyyy.MM.dd"
          maxDate={moment().toDate()}
        />
        <Icon name="calendar alternate outline" />
      </div>
    </Form.Field>
  );
}

export default SearchStartDate;
