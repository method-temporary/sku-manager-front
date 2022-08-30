import React from 'react';
import { useFormContext, useController } from 'react-hook-form';
import { CheckboxProps, DropdownProps, Form, Select, Table } from 'semantic-ui-react';
import { AutoEncourageForm } from '../AutoEncourageFormModal';
import { CardService } from 'card';
import { LearningStateType } from 'lecture/student/model/LearningState';
import { isEmpty, trim } from 'lodash';
import { useParams } from 'react-router-dom';
import { useFindCardById } from 'card/list/CardList.hook';
import { countRound } from 'card/autoEncourage/utiles';

export function EncourageTargetOptions() {
  const { control } = useFormContext<AutoEncourageForm>();

  const { reportFileBox, surveyId, tests } = CardService.instance.cardContentsQuery;

  const params = useParams<{ cardId: string }>();
  const { data: card } = useFindCardById(params.cardId);

  const { field: round } = useController({
    name: 'round',
    control,
    rules: {
      required: !isEmpty(card?.cardContents.enrollmentCards) && '차수를 선택해주세요',
    },
  });

  const { field: learningState } = useController({
    name: 'encourageTarget.learningState',
    control,
  });

  const { field: surveyNotPassed } = useController({
    name: 'encourageTarget.surveyNotPassed',
    control,
  });

  const { field: reportNotPassed } = useController({
    name: 'encourageTarget.reportNotPassed',
    control,
  });

  const { field: testNotPassed } = useController({
    name: 'encourageTarget.testNotPassed',
    control,
  });

  const onChangeRound = (_: React.SyntheticEvent, data: DropdownProps) => {
    round.onChange(data.value as number);
  };

  const onChangeLearningState = (_: React.SyntheticEvent, data: DropdownProps) => {
    learningState.onChange(data.value as LearningStateType);
  };

  const onChangeSurveyNotPassed = (_: React.FormEvent, data: CheckboxProps) => {
    surveyNotPassed.onChange(data.checked);
  };

  const onChangReportNotPassed = (_: React.FormEvent, data: CheckboxProps) => {
    reportNotPassed.onChange(data.checked);
  };

  const onChangeTestNotPassed = (_: React.FormEvent, data: CheckboxProps) => {
    testNotPassed.onChange(data.checked);
  };

  const isExistSurvey = surveyId !== null;
  const isExistReport = trim(reportFileBox.reportName.ko) !== '';
  const isExistTest = !isEmpty(tests);

  return (
    <Table.Row>
      <Table.Cell>
        독려대상
        <span className="required">*</span>
      </Table.Cell>
      <Table.Cell>
        <Form.Group inline>
          {!isEmpty(card?.cardContents.enrollmentCards) && (
            <span style={{ width: '110px', marginRight: '5px' }}>
              <Select
                options={countRound(card?.cardContents.enrollmentCards)}
                value={round.value || ''}
                placeholder="Select"
                onChange={onChangeRound}
                fluid
              />
            </span>
          )}
          <span style={{ width: '110px' }}>
            <Select
              options={encourageTargetOptions}
              value={learningState.value || ''}
              placeholder="전체"
              onChange={onChangeLearningState}
              fluid
            />
          </span>
          <Form.Checkbox
            label="Survey 미참여자"
            checked={surveyNotPassed.value}
            disabled={!isExistSurvey}
            onChange={onChangeSurveyNotPassed}
          />
          <Form.Checkbox
            label="Report 미제출/불합격자"
            checked={reportNotPassed.value}
            disabled={!isExistReport}
            onChange={onChangReportNotPassed}
          />
          <Form.Checkbox
            label="Test 미제출/불합격자"
            checked={testNotPassed.value}
            disabled={!isExistTest}
            onChange={onChangeTestNotPassed}
          />
        </Form.Group>
      </Table.Cell>
    </Table.Row>
  );
}

const encourageTargetOptions: { key: string; text: string; value: LearningStateType }[] = [
  { key: '1', text: '전체', value: '' },
  { key: '2', text: '결과처리 대기', value: 'Progress' },
  { key: '3', text: '이수', value: 'Passed' },
  { key: '4', text: '미이수', value: 'Missed' },
  { key: '5', text: '불참', value: 'NoShow' },
];
