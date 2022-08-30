import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SearchBox } from 'shared/components';

import { StudentQueryModel } from '../../model/StudentQueryModel';

interface Props {
  onSearchPostsBySearchBox: () => void;
  onChangeStudentQueryProp: (name: string, value: any) => void;

  studentQuery: StudentQueryModel;
  paginationKey: string;
  examId: string;
}

@observer
@reactAutobind
class ResultManagementSearchBox extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { onSearchPostsBySearchBox, onChangeStudentQueryProp } = this.props;
    const { studentQuery, paginationKey, examId } = this.props;

    return (
      <SearchBox
        onSearch={onSearchPostsBySearchBox}
        changeProps={onChangeStudentQueryProp}
        queryModel={studentQuery}
        name={paginationKey}
      >
        <SearchBox.Group name="교육기간">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group>
          {(examId !== null && (
            <SearchBox.Select
              name="채점상태"
              fieldName="scoringState"
              options={SelectType.scoringState}
              placeholder="전체"
            />
          )) || (
            <SearchBox.Select
              name="채점상태"
              fieldName="scoringState"
              options={SelectType.nullState}
              placeholder="전체"
            />
          )}
          {examId !== null && examId !== '' && examId !== 'undefined' ? (
            <SearchBox.Select
              name="응시상태"
              fieldName="numberOfTrials"
              options={SelectType.testFrequency}
              placeholder="전체"
            />
          ) : (
            // <Form.Field
            //   control={Select}
            //   options={SelectType.testFrequency}
            //   defaultValue={SelectType.testFrequency[0].text}
            //   onChange={(e: any, data: any) => {
            //     onChangeStudentQueryProp('numberOfTrials', data.value);
            //   }}
            // />
            <SearchBox.Select
              name="응시상태"
              fieldName="numberOfTrials"
              options={SelectType.nullState}
              placeholder="전체"
            />
          )}
          <SearchBox.Select
            name="이수상태"
            fieldName="learningState"
            options={SelectType.completionState}
            placeholder="전체"
          />
        </SearchBox.Group>
        <SearchBox.Group name="검색어">
          <SearchBox.Select fieldName="searchPart" options={SelectType.searchPartForLearner} placeholder="전체" />
          <SearchBox.Input fieldName="searchWord" />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default ResultManagementSearchBox;
