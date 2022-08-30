import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';

export const PhaseCompleteSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setPhaseCompleteState } = CardStudentResultStore.instance;

  return (
    <>
      <label>완료여부</label>
      <div style={{ height: '39px' }}>
        <Form.Field
          style={{ margin: '8px' }}
          control={Checkbox}
          checked={cardStudentResultQuery.phaseCompleteState}
          onClick={(e: any, data: any) => setPhaseCompleteState(data.checked)}
        />
      </div>
    </>
  );
});
