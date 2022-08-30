import React from 'react';
import { observer } from 'mobx-react';
import { Form, Grid, Select } from 'semantic-ui-react';
import CardStudentResultStore from '../CardStudentResult.store';
import { SelectTypeModel, SelectType } from '../../../../shared/model';

export const ScoreStateSearchField = observer(() => {
  //
  const { cardStudentResultQuery, setLearningState, setScoringState } = CardStudentResultStore.instance;

  const getOptions = () => {
    //
    const paperId = 'id' && ''; // 있거나 없거나 체크
    const isReport = true || false; // 있거나 없거나 체크

    let selectTypes: SelectTypeModel[];

    if (paperId === '' && !isReport) {
      selectTypes = SelectType.nullState;
    } else {
      selectTypes = SelectType.scoringState;
    }
    return selectTypes;
  };

  const onChangeLearningState = (value: string) => {
    setLearningState('');

    setScoringState(value);
    if (value === 'Waiting') {
      //
      // this.setState({ learningStateSelect: SelectType.waitingLearningState });
      setLearningState('Progress');
    } else if (value === 'Missing') {
      //
      // this.setState({ learningStateSelect: SelectType.missingLearningState });
    } else {
      //
      // this.setState({ learningStateSelect: SelectType.scoringLearningState });
    }
  };

  return (
    <>
      <label>Report, Test 채점상태</label>
      <Form.Field
        control={Select}
        value={cardStudentResultQuery.scoringState}
        placeholder="전체"
        options={getOptions()}
        // disabled={disabled}
        onChange={(event: any, data: any) => onChangeLearningState(data.value)}
        // search={search}
      />
    </>
  );
});
