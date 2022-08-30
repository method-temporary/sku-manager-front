import React from 'react';
import { Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useSearchTagRdoEndDate } from '../../service/useDashBoardSentenceRdoEndDate';

function SearchEndDate() {
  const [value, setValue] = useSearchTagRdoEndDate();

  return (
    <Form.Field>
      <div className="ui input right icon">
        <DatePicker
          placeholderText="종료날짜를 선택해주세요."
          selected={value}
          onChange={setValue}
          dateFormat="yyyy.MM.dd"
        />
        <Icon name="calendar alternate outline" />
      </div>
    </Form.Field>
  );
}

export default SearchEndDate;
