import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { FormTable } from '../../../../shared/components';
import LearningStore from '../Learning.store';
import { DEFAULT_DATE_FORMAT } from '../../../../_data/shared';

interface props {
  readonly?: boolean;
}

export const LearningPeriodRow = observer(({ readonly }: props) => {
  //
  const { restrictLearningPeriod, setRestrictLearningPeriod, learningPeriod, setLearningPeriod } =
    LearningStore.instance;

  const onChangeStartDate = async (date: Date) => {
    //
    const newPeriod = { ...learningPeriod };
    newPeriod.startDate = dayjs(date).format(DEFAULT_DATE_FORMAT);

    const startTime = date.getTime();
    const endDay = dayjs(newPeriod.endDate);
    if (startTime > endDay.toDate().getTime()) {
      newPeriod.endDate = dayjs(date).add(1, 'month').format(DEFAULT_DATE_FORMAT);
    }

    setLearningPeriod(newPeriod);
  };

  const onChangeEndDate = (date: Date) => {
    //
    const newPeriod = { ...learningPeriod };
    newPeriod.endDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    setLearningPeriod(newPeriod);
  };

  return (
    <FormTable.Row name="학습기간 제한">
      {!readonly ? (
        <Form.Group>
          <Form.Field
            control={Checkbox}
            label="일정제한"
            checked={restrictLearningPeriod}
            onChange={(_: any, data: any) => setRestrictLearningPeriod(data.checked)}
          />
          <Form.Field>
            <div className="ui input right icon">
              <DatePicker
                placeholderText="시작날짜를 선택해주세요."
                selected={dayjs(learningPeriod.startDate).toDate()}
                onChange={(date: Date) => onChangeStartDate(date)}
                dateFormat="yyyy.MM.dd"
                disabled={!restrictLearningPeriod}
              />
              <Icon name="calendar alternate outline" />
            </div>
          </Form.Field>
          <div className="dash">-</div>
          <Form.Field>
            <div className="ui input right icon">
              <DatePicker
                placeholderText="종료날짜를 선택해주세요."
                selected={dayjs(learningPeriod.endDate).toDate()}
                onChange={(date: Date) => onChangeEndDate(date)}
                dateFormat="yyyy.MM.dd"
                disabled={!restrictLearningPeriod}
              />
              <Icon name="calendar alternate outline" />
            </div>
          </Form.Field>
        </Form.Group>
      ) : (
        <>{`${dayjs(learningPeriod.startDate).format('YYYY-MM-DD')} ~ ${dayjs(learningPeriod.endDate).format(
          'YYYY-MM-DD'
        )}`}</>
      )}
      <div className="margin-top-6px">
        <span className="span-information ">* 일정제한 기능 사용 시, 교육 기간 종료 후 학습이 제한됩니다.</span>
      </div>
    </FormTable.Row>
  );
});
