import React from 'react';
import { observer } from 'mobx-react';
import { Form, Select } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';

export const SurveyCompletedSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setSurveyCompleted } = CardStudentResultStore.instance;

  const getOptions = () => {
    return [
      { key: '1', text: '전체', value: '' },
      { key: '2', text: 'Y', value: true },
      { key: '3', text: 'N', value: false },
    ];
  };

  return (
    <>
      <label>Survey 완료여부</label>
      <Form.Field
        control={Select}
        value={cardStudentResultQuery.surveyCompleted}
        placeholder="전체"
        options={getOptions()}
        onChange={(event: any, data: any) => setSurveyCompleted(data.value)}
      />
    </>
  );
});
