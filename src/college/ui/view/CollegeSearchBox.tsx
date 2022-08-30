import * as React from 'react';
import { observer } from 'mobx-react';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SearchBox } from 'shared/components';
import { SelectTypeModel, SelectType } from 'shared/model';

import CollegeQueryModel from '../../model/dto/CollegeQueryModel';
import UserWorkspaceModel from '../../../userworkspace/model/UserWorkspaceModel';

interface Props {
  findCollegesByRdo: () => void;
  changeCollegeQueryProps: (name: string, value: any) => void;

  currentUserWorkspace: UserWorkspaceModel;
  userWorkspaceOptions: SelectTypeModel[];
  collegeQuery: CollegeQueryModel;
  paginationKey: string;
  sequenceSearch?: boolean;
}

interface States {}

@observer
@reactAutobind
class CollegeSearchBox extends ReactComponent<Props, States> {
  //
  render() {
    //
    const rules = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    const { changeCollegeQueryProps, findCollegesByRdo } = this.props;
    const { userWorkspaceOptions, collegeQuery, currentUserWorkspace, paginationKey, sequenceSearch } = this.props;

    return (
      <SearchBox
        onSearch={findCollegesByRdo}
        changeProps={changeCollegeQueryProps}
        queryModel={collegeQuery}
        name={paginationKey}
      >
        {sequenceSearch ? null : (
          <SearchBox.Group name="사용 여부">
            <SearchBox.Select fieldName="enabled" options={SelectType.collegeState} />
          </SearchBox.Group>
        )}
        {rules.includes('SuperManager') || currentUserWorkspace.hasChildren ? (
          <SearchBox.Group name="사용자 소속">
            <SearchBox.Select fieldName="userWorkspace" options={[...userWorkspaceOptions]} />
          </SearchBox.Group>
        ) : null}
        {sequenceSearch ? null : (
          <SearchBox.Group name="Category 명">
            <SearchBox.Input fieldName="name" />
          </SearchBox.Group>
        )}
      </SearchBox>
    );
  }
}
export default CollegeSearchBox;
