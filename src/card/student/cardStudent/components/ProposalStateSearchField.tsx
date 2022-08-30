import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';

export const ProposalStateSearchField = observer(() => {
  //
  const { cardStudentQuery, setProposalState } = CardStudentStore.instance;

  const getOptions = () => {
    //
    return [
      { key: '1', text: '전체', value: '' },
      { key: '2', text: '승인요청', value: 'Submitted' },
      { key: '3', text: '반려', value: 'Rejected' },
      { key: '4', text: '승인', value: 'Approved' },
      { key: '5', text: '취소', value: 'Canceled' },
    ];
  };

  return (
    <Grid.Column width={4}>
      <Form.Group inline>
        <label>상태</label>
        <Form.Field
          control={Select}
          value={cardStudentQuery.proposalStateParam}
          placeholder="전체"
          options={getOptions()}
          onChange={(event: any, data: any) => setProposalState(data.value)}
        />
      </Form.Group>
    </Grid.Column>
  );
});
