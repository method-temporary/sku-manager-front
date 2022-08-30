import React from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Form, Grid, Icon } from 'semantic-ui-react';
import { PaidCourseSearchBoxForm } from '../PaidCourseSearchBox';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

export const PaidCourseDateSelectBox = () => {
  const { control } = useFormContext<PaidCourseSearchBoxForm>();

  const {
    field: { onChange: setStarDate, value: startDate },
  } = useController({
    name: 'startDate',
    control,
    rules: {
      required: '시작 날짜를 선택해주세요.',
    },
    defaultValue: dayjs('2019-12-01').valueOf(),
  });

  const {
    field: { onChange: setEndDate, value: endDate },
  } = useController({
    name: 'endDate',
    control,
    rules: {
      required: '종료 날짜를 선택해주세요.',
    },
    defaultValue: dayjs().valueOf(),
  });

  const onChangeSartDate = (date: Date) => {
    setStarDate(dayjs(date).valueOf());
  };

  const onChangeEndDate = (date: Date) => {
    setEndDate(dayjs(date).valueOf());
  };

  const onClickToday = () => {
    setStarDate(dayjs().hour(0).minute(0).second(0).valueOf());
    setEndDate(dayjs().hour(23).minute(59).second(59).valueOf());
  };

  const onClickWeek = () => {
    setStarDate(dayjs().subtract(7, 'day').hour(0).minute(0).second(0).valueOf());
    setEndDate(dayjs().hour(0).minute(0).second(0).valueOf());
  };

  const onClickMonth = () => {
    setStarDate(dayjs().subtract(1, 'month').hour(0).minute(0).second(0).valueOf());
    setEndDate(dayjs().hour(0).minute(0).second(0).valueOf());
  };

  const onClickYear = () => {
    setStarDate(
      dayjs()
        .year(dayjs().year() - 1)
        .hour(0)
        .minute(0)
        .second(0)
        .valueOf()
    );
    setEndDate(dayjs().hour(0).minute(0).second(0).valueOf());
  };

  const onClcikAllDate = () => {
    setStarDate(dayjs('2019-12-01').valueOf());
    setEndDate(dayjs().valueOf());
  };

  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>신청일자</label>
        <Form.Field>
          <div className="ui input right icon">
            <DatePicker
              selected={dayjs(startDate).toDate()}
              onChange={onChangeSartDate}
              dateFormat="yyyy.MM.dd"
              maxDate={dayjs().toDate()}
            />
            <Icon name="calendar alternate outline" />
          </div>
        </Form.Field>
        <div className="dash">-</div>
        <Form.Field>
          <div className="ui input right icon">
            <DatePicker
              selected={dayjs(endDate).toDate()}
              onChange={onChangeEndDate}
              minDate={dayjs(startDate).toDate()}
              dateFormat="yyyy.MM.dd"
              maxDate={dayjs().toDate()}
            />
            <Icon name="calendar alternate outline" />
          </div>
        </Form.Field>
        <Form.Button size="tiny" onClick={onClickToday} type="button">
          오늘
        </Form.Button>
        <Form.Button size="tiny" onClick={onClickWeek} type="button">
          최근 1주
        </Form.Button>
        <Form.Button size="tiny" onClick={onClickMonth} type="button">
          최근 1개월
        </Form.Button>
        <Form.Button size="tiny" onClick={onClickYear} type="button">
          최근 1년
        </Form.Button>
        <Form.Button size="tiny" onClick={onClcikAllDate} type="button">
          전체
        </Form.Button>
      </Form.Group>
    </Grid.Column>
  );
};
