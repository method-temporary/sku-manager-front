import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';

export const EmployedStateSearchField = observer(() => {
  //
  const { cardStudentQuery, setEmployedState } = CardStudentStore.instance;

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
          value={cardStudentQuery.employed}
          placeholder="전체"
          options={getOptions()}
          onChange={(event: any, data: any) => setEmployedState(data.value)}
        />
      </Form.Group>
    </Grid.Column>
  );
});
