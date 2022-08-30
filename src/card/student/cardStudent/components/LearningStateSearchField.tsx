import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';

export const LearningStateSearchField = observer(() => {
  //
  const { cardStudentQuery, setLearningState } = CardStudentStore.instance;

  const getOptions = () => {
    //
    return [
      { key: '1', text: '전체', value: '' },
      { key: '2', text: '결과처리 대기', value: 'Progress' },
      { key: '3', text: '이수', value: 'Passed' },
      { key: '4', text: '미이수', value: 'Missed' },
      { key: '5', text: '불참', value: 'NoShow' },
    ];
  };

  return (
    <Grid.Column width={12}>
      <Form.Group inline>
        <label>이수 상태</label>
        <Form.Field
          control={Select}
          value={cardStudentQuery.learningStateParam}
          placeholder="전체"
          options={getOptions()}
          onChange={(event: any, data: any) => setLearningState(data.value)}
        />
      </Form.Group>
    </Grid.Column>
  );
});
