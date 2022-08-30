import React from 'react';
import { Form, Table, Select, DropdownProps } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useFormContext, useController } from 'react-hook-form';
import { AutoEncourageForm } from '../AutoEncourageFormModal';
import dayjs from 'dayjs';

export function EncourageScheduledDateSelectBox() {
  const { watch, control } = useFormContext<AutoEncourageForm>();

  const [encourageIsUse] = watch(['encourageIsUse']);

  const {
    field: { onChange, value: scheduledTime },
  } = useController({
    name: 'scheduledSendTime',
    control,
    rules: {
      validate: (scheduledSendTime) => {
        if (encourageIsUse && scheduledSendTime) {
          if (dayjs().isAfter(scheduledSendTime)) return '현재 일시 보다 이전 일시를 발송 일시로 지정할 수 없습니다.';
        }
      },
    },
    defaultValue: dayjs()
      .hour(dayjs().hour() + 1)
      .minute(0)
      .second(0)
      .valueOf(),
  });

  const onChangeDate = (date: Date) => {
    const nextScheduledTime = dayjs(scheduledTime)
      .year(date.getFullYear())
      .month(date.getMonth())
      .date(date.getDate())
      .valueOf();

    onChange(nextScheduledTime);
  };

  const onChangeHour = (_: React.SyntheticEvent, data: DropdownProps) => {
    const nextScheduledTime = dayjs(scheduledTime)
      .hour(data.value as number)
      .valueOf();

    onChange(nextScheduledTime);
  };

  const onChangeMinute = (_: React.SyntheticEvent, data: DropdownProps) => {
    const nextScheduledTime = dayjs(scheduledTime)
      .minute(data.value as number)
      .second(0)
      .valueOf();

    onChange(nextScheduledTime);
  };

  return (
    <Table.Row>
      <Table.Cell width={2}>
        발송 일시
        <span className="required">*</span>
      </Table.Cell>
      <Table.Cell width={6}>
        <Form.Group inline>
          <DatePicker
            selected={dayjs(scheduledTime).toDate()}
            onChange={onChangeDate}
            disabled={!encourageIsUse}
            minDate={new Date()}
          />
          <Select
            options={hourOption()}
            disabled={!encourageIsUse}
            onChange={onChangeHour}
            value={String(dayjs(scheduledTime).hour())}
            style={{ marginLeft: '10px' }}
          />
          <Select
            options={minuteOption}
            disabled={!encourageIsUse}
            onChange={onChangeMinute}
            value={String(dayjs(scheduledTime).minute())}
          />
        </Form.Group>
      </Table.Cell>
    </Table.Row>
  );
}

const hourOption = () => {
  const hourArr = [];
  let i = 0;

  while (i < 24) {
    const hour = i < 10 ? `0${i}` : String(i);
    hourArr.push({
      key: String(i),
      text: hour,
      value: String(i),
    });
    i++;
  }

  return hourArr;
};

const minuteOption = [
  { key: '0', text: '00', value: '0' },
  { key: '1', text: '10', value: '10' },
  { key: '2', text: '20', value: '20' },
  { key: '3', text: '30', value: '30' },
  { key: '4', text: '40', value: '40' },
  { key: '5', text: '50', value: '50' },
];
