import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { QueryModel, SelectType } from 'shared/model';
import { SearchBox } from 'shared/components';

interface Props {
  onSearch: () => void;
  changeProps: (name: string, value: any) => void;

  paginationKey: string;
  queryModel: QueryModel;
  searchBoxQueryModel: QueryModel;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceAdminSearchBox extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onSearch, changeProps } = this.props;
    const { paginationKey, queryModel, searchBoxQueryModel } = this.props;
    const searchWordDisabledKey = 'searchPart';
    const searchWordDisabledKeyWord = searchBoxQueryModel[searchWordDisabledKey];

    return (
      <SearchBox name={paginationKey} queryModel={queryModel} onSearch={onSearch} changeProps={changeProps}>
        <SearchBox.Group name="검색어">
          <SearchBox.Select placeholder="전체" options={SelectType.searchPartForBadgeApprover} fieldName="searchPart" />
          <SearchBox.Input
            fieldName="searchWord"
            placeholder="검색어를 입력해주세요."
            disabled={searchWordDisabledKeyWord === '' || searchWordDisabledKeyWord === '전체'}
          />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}
export default UserWorkspaceAdminSearchBox;
