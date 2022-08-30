import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { TempSearchBox } from 'shared/components';

import MemberSearchFormModel from '../../../approval/model/MemberSearchFormModel';
import { MemberSearchType } from '../../../approval/model/vo';

interface Props {
  findUserWorkspaceAccount: () => void;
  changeUserWorkspaceAccountQueryProps: (name: string, value: any) => void;

  memberSearchForm: MemberSearchFormModel;
  paginationKey: string;
}

interface States {}

const searchBoxOptions = [
  { key: '0', text: '전체', value: '' },
  { key: '1', text: '성명', value: MemberSearchType.Name },
  { key: '2', text: 'Email', value: MemberSearchType.Email },
  { key: '3', text: '부서명', value: MemberSearchType.Department },
];

@observer
@reactAutobind
class UserWorkspaceAccountSearchBox extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { findUserWorkspaceAccount, changeUserWorkspaceAccountQueryProps } = this.props;
    const { memberSearchForm, paginationKey } = this.props;

    return (
      <TempSearchBox
        paginationKey={paginationKey}
        onSearch={findUserWorkspaceAccount}
        changeProps={changeUserWorkspaceAccountQueryProps}
      >
        <TempSearchBox.Group name="등록일자">
          <TempSearchBox.DatePicker
            startDate={memberSearchForm.startDate}
            startFieldName="startDate"
            endDate={memberSearchForm.endDate}
            endFieldName="endDate"
            searchButtons
          />
        </TempSearchBox.Group>
        {/*<TempSearchBox.Group name="검색어">*/}
        {/*  <TempSearchBox.Select*/}
        {/*    fieldName="searchType"*/}
        {/*    options={SelectType.searchWordForUserWorkspaceAccount}*/}
        {/*    placeholder="전체"*/}
        {/*  />*/}
        {/*  <TempSearchBox.Input*/}
        {/*    fieldName="searchWord"*/}
        {/*    disabled={*/}
        {/*      searchBoxQueryModel[searchWordDisabledKey] === '' || searchBoxQueryModel[searchWordDisabledKey] === ''*/}
        {/*    }*/}
        {/*  />*/}
        {/*</TempSearchBox.Group>*/}
        <TempSearchBox.BasicSearch
          options={searchBoxOptions}
          values={[memberSearchForm.searchPart, memberSearchForm.searchWord]}
          disabledKey={''}
        />
      </TempSearchBox>
    );
  }
}

export default UserWorkspaceAccountSearchBox;
