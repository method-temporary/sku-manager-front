import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Icon, Input, Table } from 'semantic-ui-react';

import { SubActions } from 'shared/components';

import { DATE_PICKER_FORMAT } from '_data/shared';
import { EnrollmentCard } from '_data/lecture/cards/model/EnrollmentCard';

import LearningStore from '../Learning.store';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { settingRoundInfoInAllEnrollmentCubes } from '../Learning.util';
import LearningContentsStore from '../learningPlan/LearningContents/LearningContents.store';
import CardDetailStore from '../../../detail/CardDetail.store';
import { EnrollmentCardWithOptional } from '../model/EnrollmentCardWithOptional';

interface Props {
  readonly?: boolean;
  index: number;
  enrollmentCard: EnrollmentCardWithOptional;
}

const RoundList = observer(({ readonly, index, enrollmentCard }: Props) => {
  //
  const { enrollmentCards, setEnrollmentCards, onChangeEnrollmentCardDate } = LearningStore.instance;
  const { cardState } = CardDetailStore.instance;

  const onRemoveRound = () => {
    //

    setEnrollmentCards(
      enrollmentCards
        .filter((enrollment) => enrollment.round !== enrollmentCard.round)
        .map((enrollment, idx) => ({
          ...enrollment,
          round: idx + 1,
        }))
    );

    // todo 라운드 삭제 시 하위 EnrollmentCube의 차수 정보 수정
    settingRoundInfoInAllEnrollmentCubes();
  };

  const onChangeCapacity = (capacity: number) => {
    //
    setEnrollmentCards(
      enrollmentCards.map((enrollment, idx) => {
        if (idx === index) {
          //
          return {
            ...enrollment,
            capacity,
          } as EnrollmentCardWithOptional;
        } else {
          return enrollment;
        }
      })
    );
  };

  return (
    <Table celled>
      <colgroup>
        <col width="15%" />
        <col width="35%" />
        <col width="15%" />
        <col width="35%" />
      </colgroup>

      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={4}>
            <SubActions>
              {`${enrollmentCard.round} 차수`}
              {index !== 0 &&
                !readonly &&
                ('Created OpenApproval Rejected'.includes(cardState) ||
                  (cardState === 'Opened' && !enrollmentCard.isApprovalRound)) && (
                  <SubActions.Right>
                    <Button onClick={onRemoveRound}>{'-'}</Button>
                  </SubActions.Right>
                )}
            </SubActions>
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            신청기간 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <>
                <div className="ui input right icon">
                  <DatePicker
                    showMonthYearPicker={false}
                    placeholderText="시작날짜를 선택해주세요."
                    selected={dayjs(enrollmentCard.applyingPeriod.startDate).toDate()}
                    onChange={(date: Date) =>
                      onChangeEnrollmentCardDate(enrollmentCard, date, 'applyingPeriod.startDate')
                    }
                    dateFormat={DATE_PICKER_FORMAT}
                  />
                  <Icon name="calendar alternate outline" />
                </div>
                <div className="dash">-</div>
                <div className="ui input right icon">
                  <DatePicker
                    showMonthYearPicker={false}
                    placeholderText="종료날짜를 선택해주세요."
                    selected={dayjs(enrollmentCard.applyingPeriod.endDate).toDate()}
                    onChange={(date: Date) =>
                      onChangeEnrollmentCardDate(enrollmentCard, date, 'applyingPeriod.endDate')
                    }
                    dateFormat={DATE_PICKER_FORMAT}
                    minDate={dayjs(enrollmentCard.applyingPeriod.startDate).toDate()}
                  />
                  <Icon name="calendar alternate outline" />
                </div>
              </>
            ) : (
              <>{`${enrollmentCard.applyingPeriod.startDate} ~ ${enrollmentCard.applyingPeriod.endDate}`}</>
            )}
          </Table.Cell>
          <Table.Cell>
            취소가능기간 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <>
                <div className="ui input right icon">
                  <DatePicker
                    showMonthYearPicker={false}
                    placeholderText="시작날짜를 선택해주세요."
                    selected={dayjs(enrollmentCard.cancellablePeriod.startDate).toDate()}
                    onChange={(date: Date) =>
                      onChangeEnrollmentCardDate(enrollmentCard, date, 'cancellablePeriod.startDate')
                    }
                    dateFormat={DATE_PICKER_FORMAT}
                  />
                  <Icon name="calendar alternate outline" />
                </div>
                <div className="dash">-</div>
                <div className="ui input right icon">
                  <DatePicker
                    showMonthYearPicker={false}
                    placeholderText="종료날짜를 선택해주세요."
                    selected={dayjs(enrollmentCard.cancellablePeriod.endDate).toDate()}
                    onChange={(date: Date) =>
                      onChangeEnrollmentCardDate(enrollmentCard, date, 'cancellablePeriod.endDate')
                    }
                    dateFormat={DATE_PICKER_FORMAT}
                    minDate={dayjs(enrollmentCard.cancellablePeriod.startDate).toDate()}
                  />
                  <Icon name="calendar alternate outline" />
                </div>
              </>
            ) : (
              <>{`${enrollmentCard.cancellablePeriod.startDate} ~ ${enrollmentCard.cancellablePeriod.endDate}`}</>
            )}
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            교육기간 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <>
                <div className="ui input right icon">
                  <DatePicker
                    showMonthYearPicker={false}
                    placeholderText="시작날짜를 선택해주세요."
                    selected={dayjs(enrollmentCard.learningPeriod.startDate).toDate()}
                    onChange={(date: Date) =>
                      onChangeEnrollmentCardDate(enrollmentCard, date, 'learningPeriod.startDate')
                    }
                    dateFormat={DATE_PICKER_FORMAT}
                  />
                  <Icon name="calendar alternate outline" />
                </div>
                <div className="dash">-</div>
                <div className="ui input right icon">
                  <DatePicker
                    showMonthYearPicker={false}
                    placeholderText="종료날짜를 선택해주세요."
                    selected={dayjs(enrollmentCard.learningPeriod.endDate).toDate()}
                    onChange={(date: Date) =>
                      onChangeEnrollmentCardDate(enrollmentCard, date, 'learningPeriod.endDate')
                    }
                    dateFormat={DATE_PICKER_FORMAT}
                    minDate={dayjs(enrollmentCard.learningPeriod.startDate).toDate()}
                  />
                  <Icon name="calendar alternate outline" />
                </div>
              </>
            ) : (
              <>{`${enrollmentCard.learningPeriod.startDate} ~ ${enrollmentCard.learningPeriod.endDate}`}</>
            )}
          </Table.Cell>
          <Table.Cell>
            정원 <span className="required">*</span>
          </Table.Cell>
          <Table.Cell>
            {!readonly ? (
              <Form.Field
                width={4}
                control={Input}
                placeholder="정원"
                value={enrollmentCard.capacity}
                onChange={(e: any, data: any) => onChangeCapacity(Number(data.value))}
                type="number"
                min={0}
              />
            ) : (
              <>{`${enrollmentCard.capacity} 명`}</>
            )}
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
});

export default RoundList;
