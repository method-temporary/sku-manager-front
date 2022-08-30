import React from 'react';
import { FormTable } from 'shared/components';
import { UserGroupCategoryModel } from '../../model';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  userGroupCategory: UserGroupCategoryModel;
}

class UserGroupCategoryDetailView extends React.Component<Props> {
  //
  render() {
    //
    const { userGroupCategory } = this.props;

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="사용자 그룹 분류명">
          <Polyglot.Input name="name" languageStrings={userGroupCategory.name} readOnly />
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default UserGroupCategoryDetailView;
