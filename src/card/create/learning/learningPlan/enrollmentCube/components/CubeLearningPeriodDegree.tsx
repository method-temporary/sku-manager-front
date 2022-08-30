import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Table } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { DATE_PICKER_FORMAT, DEFAULT_DATE_FORMAT } from '../../../../../../_data/shared';
import EnrollmentCubeStore from '../EnrollmentCube.store';
import { ClassroomSdo } from '../../../../../../_data/cube/model/material';
import LearningStore from '../../../Learning.store';

interface props {
  index: number;
  readonly?: boolean;
}

export const CubeLearningPeriodDegree = observer(({ index, readonly }: props) => {
  //
  const { classroomSdos, setClassroomSdo } = EnrollmentCubeStore.instance;
  const { enrollmentCards } = LearningStore.instance;

  const onChangeLearningStartDate = (date: Date) => {
    //
    const target = getDegreeInfo();

    const newClassroom: ClassroomSdo | null =
      (target && {
        ...target,
        enrolling: {
          ...target.enrolling,
          learningPeriod: { ...target.enrolling.learningPeriod, startDate: dayjs(date).format(DEFAULT_DATE_FORMAT) },
        },
      }) ||
      null;

    newClassroom && setClassroomSdo(index, newClassroom);
  };

  const onChangeLearningEndDate = (date: Date) => {
    //
    const target = getDegreeInfo();

    const newClassroom: ClassroomSdo | null =
      (target && {
        ...target,
        enrolling: {
          ...target.enrolling,
          learningPeriod: { ...target.enrolling.learningPeriod, endDate: dayjs(date).format(DEFAULT_DATE_FORMAT) },
        },
      }) ||
      null;

    newClassroom && setClassroomSdo(index, newClassroom);
  };

  const getDegreeInfo = () => {
    return classroomSdos.find((_, targetIdx) => targetIdx === index);
  };

  const getStartDate = () => {
    return (
      (getDegreeInfo() && dayjs(getDegreeInfo()!.enrolling.learningPeriod.startDate)!.toDate()) || dayjs().toDate()
    );
  };

  const getStartStringDate = () => {
    return (
      (getDegreeInfo() && getDegreeInfo()!.enrolling.learningPeriod.startDate) || dayjs().format(DEFAULT_DATE_FORMAT)
    );
  };

  const getEndDate = () => {
    return (
      (getDegreeInfo() && dayjs(getDegreeInfo()!.enrolling.learningPeriod.endDate))!.toDate() ||
      dayjs().add(1, 'month').toDate()
    );
  };

  const getEndStringDate = () => {
    return (
      (getDegreeInfo() && getDegreeInfo()!.enrolling.learningPeriod.endDate) ||
      dayjs().add(1, 'month').format(DEFAULT_DATE_FORMAT)
    );
  };

  const getRoundLearningPeriod = () => {
    return enrollmentCards.find((card, idx) => idx === index)?.learningPeriod || null;
  };

  return (
    (getDegreeInfo() && (
      <Table celled>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">{`${index + 1}차수`}</Table.Cell>
            <Table.Cell>
              {readonly ? (
                <>{`${getStartStringDate()} ~ ${getEndStringDate()}`}</>
              ) : (
                <>
                  {' '}
                  <div className="ui input right icon">
                    <DatePicker
                      showMonthYearPicker={false}
                      placeholderText="시작날짜를 선택해주세요."
                      selected={getStartDate()}
                      onChange={(date: Date) => onChangeLearningStartDate(date)}
                      dateFormat={DATE_PICKER_FORMAT}
                      minDate={
                        (getRoundLearningPeriod() && dayjs(getRoundLearningPeriod()?.startDate).toDate()) || null
                      }
                      maxDate={(getRoundLearningPeriod() && dayjs(getRoundLearningPeriod()?.endDate).toDate()) || null}
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                  <div className="dash">-</div>
                  <div className="ui input right icon">
                    <DatePicker
                      showMonthYearPicker={false}
                      placeholderText="종료날짜를 선택해주세요."
                      selected={getEndDate()}
                      onChange={(date: Date) => onChangeLearningEndDate(date)}
                      dateFormat={DATE_PICKER_FORMAT}
                      minDate={
                        (getRoundLearningPeriod() &&
                          dayjs(getRoundLearningPeriod()?.startDate).toDate() > getStartDate() &&
                          dayjs(getRoundLearningPeriod()?.startDate).toDate()) ||
                        getStartDate()
                      }
                      maxDate={(getRoundLearningPeriod() && dayjs(getRoundLearningPeriod()?.endDate).toDate()) || null}
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </>
              )}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    )) ||
    null
  );
});
