import React from 'react';
import { observer } from 'mobx-react';
import { Select, Checkbox, Form } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';

export const PhaseCompleteSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setPhaseCompleteState } = CardStudentResultStore.instance;

  const getOptions = () => {
    return [
      { key: '1', text: '전체', value: '' },
      { key: '2', text: '동의', value: '' },
      { key: '3', text: '미동의', value: '' },
    ];
  };

  return (
    <>
      <label>서약서 동의여부</label>
      <Form.Field
        control={Select}
        value={cardStudentResultQuery.phaseCompleteState}
        placeholder="전체"
        options={getOptions()}
        onClick={(e: any, data: any) => setPhaseCompleteState(data.value)}
      />
      {/* <div style={{ height: '39px' }}>
        <Form.Field
          style={{ margin: '8px' }}
          control={Checkbox}
          checked={cardStudentResultQuery.phaseCompleteState}
          onClick={(e: any, data: any) => setPhaseCompleteState(data.checked)}
        />
      </div> */}
    </>
  );
});
