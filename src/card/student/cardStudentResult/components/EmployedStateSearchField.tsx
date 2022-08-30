import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';

export const EmployedStateSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setEmployedState } = CardStudentResultStore.instance;

  const getOptions = () => {
    //
    return [
      { key: '0', text: '전체', value: '' },
      { key: '1', text: 'Y', value: true },
      { key: '2', text: 'N', value: false },
    ];
  };

  return (
    <Grid.Column width={12}>
      <Form.Group inline>
        <label>재직여부</label>
        <Form.Field
          control={Select}
          value={cardStudentResultQuery.employed}
          placeholder="전체"
          options={getOptions()}
          onChange={(event: any, data: any) => setEmployedState(data.value)}
        />
      </Form.Group>
    </Grid.Column>
  );
});
