import React from 'react';
import { observer } from 'mobx-react';
import { Button, Grid, Segment } from 'semantic-ui-react';
import CardStudentStore from '../CardStudent.store';
import { DateSearchField } from './DateSearchField';
import { LearningStateSearchField } from './LearningStateSearchField';
import { ProposalStateSearchField } from './ProposalStateSearchField';
import { SearchPartSearchField } from './SearchPartSearchField';
import { useFindCardStudentForAdminStudent } from '../CardStudent.hooks';
import { EmployedStateSearchField } from './EmployedStateSearchField';

export const CardStudentSearchBox = observer(() => {
  //
  const { setParams, setOffset, setCardStudentSelected } = CardStudentStore.instance;

  const onClickSearch = () => {
    setCardStudentSelected([]);
    setOffset(1);
    setParams();
  };

  return (
    <Segment>
      <div className="ui form search-box">
        <Grid>
          <Grid.Row>
            <DateSearchField />
            {/*<PhaseSearchField />*/}
            <ProposalStateSearchField />
            <LearningStateSearchField />
            <EmployedStateSearchField />
            <SearchPartSearchField />
          </Grid.Row>
        </Grid>
      </div>
      <Grid.Column width={16}>
        <div className="center">
          <Button primary onClick={onClickSearch}>
            검색
          </Button>
        </div>
      </Grid.Column>
    </Segment>
  );
});
