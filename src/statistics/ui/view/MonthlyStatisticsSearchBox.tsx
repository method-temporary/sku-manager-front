import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { SearchBox } from 'shared/components';
import { QueryModel } from 'shared/model';

interface Props {}

interface States {}

@observer
@reactAutobind
class MonthlyStatisticsSearchBox extends ReactComponent<Props, States> {
  //
  render() {
    //
    return (
      <SearchBox onSearch={() => {}} changeProps={() => {}} queryModel={new QueryModel()} name="paginationKey">
        <SearchBox.Group name="사용자그룹">
          <SearchBox.Input fieldName="fieldName" />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default MonthlyStatisticsSearchBox;
