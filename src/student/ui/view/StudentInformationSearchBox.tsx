import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SearchBox } from 'shared/components';

import { StudentQueryModel } from '../../model/StudentQueryModel';

interface Props {
  onSearchPostsBySearchBox: () => void;
  onChangeStudentQueryProps: (name: string, value: any) => void;

  paginationKey: string;
  studentQuery: StudentQueryModel;
}

@observer
@reactAutobind
class StudentInformationSearchBox extends ReactComponent<Props, {}> {
  //

  render() {
    //
    const { onChangeStudentQueryProps, onSearchPostsBySearchBox } = this.props;
    const { studentQuery, paginationKey } = this.props;

    return (
      <SearchBox
        onSearch={onSearchPostsBySearchBox}
        changeProps={onChangeStudentQueryProps}
        queryModel={studentQuery}
        name={paginationKey}
      >
        <SearchBox.Group name="신청일자">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group name="상태">
          <SearchBox.Select fieldName="learningState" options={SelectType.learnerType} placeholder="전체" />
        </SearchBox.Group>
        <SearchBox.Group name="검색어">
          <SearchBox.Select fieldName="searchPart" options={SelectType.searchPartForLearner} placeholder="전체" />
          <SearchBox.Input fieldName="searchWord" />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default StudentInformationSearchBox;
