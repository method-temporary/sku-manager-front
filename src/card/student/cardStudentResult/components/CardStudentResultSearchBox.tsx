import React from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { DateSearchField } from './DateSearchField';
import { ScoreStateSearchField } from './ScoreStateSearchField';
import { ExamAttendanceSearchField } from './ExamAttendacneSearchField';
import { PhaseCompleteSearchField } from './PhaseCompleteSearchField';
import { SurveyCompletedSearchField } from './SurveyCompletedSearchField';
import { LearningStateSearchField } from './LearningStateSearchField';
import { SearchPartSearchField } from './SearchPartSearchField';
import CardStudentResultStore from '../CardStudentResult.store';
import { EmployedStateSearchField } from './EmployedStateSearchField';

export const CardStudentResultSearchBox = observer(() => {
  //
  const { setOffset, setCardStudentSelected, setParams } = CardStudentResultStore.instance;

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
            <Grid.Column width={16}>
              <Form.Group inline>
                <ScoreStateSearchField />
                <ExamAttendanceSearchField />
                <PhaseCompleteSearchField />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <Form.Group inline>
                <SurveyCompletedSearchField />
                <LearningStateSearchField />
                <EmployedStateSearchField />
              </Form.Group>
            </Grid.Column>
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
