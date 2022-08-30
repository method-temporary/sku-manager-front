import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { SearchBox } from 'shared/components';

import { StudentQueryModel } from 'student/model/StudentQueryModel';

interface Props {
  onSearchPostsBySearchBox: () => void;
  onChangeStudentQueryProp: (name: string, value: any) => void;
  onChangeScoringState: (value: string) => void;

  hasTest: boolean;
  hasReport: boolean;
  learningStateSelect: SelectTypeModel[];
  studentQuery: StudentQueryModel;
  paginationKey: string;
}

@observer
@reactAutobind
class ResultManagementSearchBox extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { onSearchPostsBySearchBox, onChangeStudentQueryProp, onChangeScoringState } = this.props;
    const { studentQuery, paginationKey, learningStateSelect, hasTest, hasReport } = this.props;
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
        <SearchBox.Group name="Report, Test 채점상태">
          <SearchBox.Select
            fieldName="scoringState"
            options={!hasTest && !hasReport ? SelectType.nullState : SelectType.scoringState}
            onChange={(event, data) => onChangeScoringState(data.value)}
            placeholder="전체"
          />
          <SearchBox.Select
            name="Test 응시여부"
            fieldName="examAttendance"
            options={!hasTest && !hasReport ? SelectType.nullState : SelectType.testFrequency}
            placeholder="전체"
          />
        </SearchBox.Group>
        <SearchBox.Group name="Survey 완료여부">
          {/*
          # 채점 상태 별 선택 가능 이수 상태
            채점대기 : 결과처리 대기 (리포트, 테스트)
            결과보기 : 결과처리 대기, 이수, 미이수, 불참
            미응시 : 결과처리 대기, 불참
          */}
          <SearchBox.Select fieldName="surveyCompleted" options={SelectType.surveyCompleted} placeholder="전체" />
          <SearchBox.Select
            name="이수상태"
            fieldName="learningState"
            options={learningStateSelect}
            // options={SelectType.completionState}
            placeholder="전체"
          />

          <SearchBox.Select
            name="재직여부"
            fieldName="employed"
            options={SelectType.employedState}
            placeholder="전체"
          />
        </SearchBox.Group>

        <SearchBox.Query
          options={SelectType.searchPartForLearner}
          placeholders={['전체', '검색어를 입력해주세요.']}
          searchWordDisabledKey="searchPart"
          searchWordDisabledValues={['', '전체']}
        />
      </SearchBox>
    );
  }
}

export default ResultManagementSearchBox;
