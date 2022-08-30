import React from 'react';
import { FunctionComponent, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, Icon } from 'semantic-ui-react';

interface Props {
  value: string;
  name: string;
  selectedDate: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const DateFilterButton: FunctionComponent<Props> = function DateFilterButton({ name, value, selectedDate, onClick }) {
  const isSelected = selectedDate === value;
  const classes = `ui button ${isSelected && 'active'}`;

  return (
    <Form.Button size="tiny" type="button" value={value} onClick={onClick}>
      {name}
    </Form.Button>
  );
};

const ButtonList = [
  {
    name: '오늘',
    value: 'day',
  },
  {
    name: '최근 1주',
    value: 'week',
  },
  {
    name: '최근 1개월',
    value: 'month',
  },
  {
    name: '최근 1년',
    value: 'year',
  },
  {
    name: '전체',
    value: 'all',
  },
];

interface CalendarViewProps {
  startDate: Date;
  endDate: Date;
  selectedDate: string;
  onChangeStartDate: (date: Date) => void;
  onChangeEndDate: (date: Date) => void;
  onClickDate: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CalendarView({
  startDate,
  endDate,
  selectedDate,
  onChangeStartDate,
  onChangeEndDate,
  onClickDate,
}: CalendarViewProps) {
  useEffect(() => {
    const now = new Date();
    let startDate;

    switch (selectedDate) {
      case 'day':
        startDate = new Date();
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7 + 1));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        startDate.setDate(startDate.getDate() + 1);
        break;
      case 'all':
        startDate = new Date(2019, 11, 1);
        break;
      default:
        startDate = new Date(2019, 11, 1);
    }

    onChangeStartDate(startDate);
    onChangeEndDate(new Date());
  }, [selectedDate, onChangeStartDate, onChangeEndDate]);

  return (
    <>
      <Form.Field>
        <div className="ui input right icon">
          <DatePicker
            placeholderText="시작날짜를 선택해주세요."
            selected={startDate}
            onChange={onChangeStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
            dateFormat="yyyy.MM.dd"
          />
          <Icon name="calendar alternate outline" />
        </div>
      </Form.Field>
      <div className="dash">-</div>
      <Form.Field>
        <div className="ui input right icon">
          <DatePicker
            placeholderText="종료날짜를 선택해주세요."
            selected={endDate}
            onChange={onChangeEndDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy.MM.dd"
          />
          <Icon name="calendar alternate outline" />
        </div>
      </Form.Field>
      {ButtonList.map((button, i) => (
        <DateFilterButton
          key={i}
          name={button.name}
          value={button.value}
          selectedDate={selectedDate}
          onClick={onClickDate}
        />
      ))}
    </>
  );
}
