import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SearchBox } from 'shared/components';
import { QueryModel, SelectType, SelectTypeModel } from 'shared/model';

interface Props {
  findUserWorkspaces: () => void;
  changeUserWorkspaceProps: (name: string, value: string) => void;

  userWorkspaceQuery: QueryModel;
  hasParentOptions: SelectTypeModel[];
  name: string;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceSearchBox extends ReactComponent<Props, States> {
  //
  componentDidMount() {}

  render() {
    //
    const { findUserWorkspaces, changeUserWorkspaceProps } = this.props;
    const { userWorkspaceQuery, hasParentOptions, name } = this.props;

    return (
      <SearchBox
        onSearch={findUserWorkspaces}
        changeProps={changeUserWorkspaceProps}
        queryModel={userWorkspaceQuery}
        name={name}
      >
        <SearchBox.Group name="변경일자">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group name="SK 그룹사 여부">
          <SearchBox.Select fieldName="skGroup" options={SelectType.skGroup} />
        </SearchBox.Group>
        <SearchBox.Group name="상위 사용자 소속">
          <SearchBox.Select fieldName="parentId" options={hasParentOptions} />
        </SearchBox.Group>
        <SearchBox.Group name="소속사명">
          <SearchBox.Input placeholder="소속사명을 입력해주세요." fieldName="searchWord" />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default UserWorkspaceSearchBox;
