import React from 'react';
import { Form, Grid, Radio } from 'semantic-ui-react';

import { FormTable, Polyglot } from 'shared/components';
import { PolyglotModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserGroupCategoryModel } from '../../../category/model';

interface Props {
  userGroupName: PolyglotModel;
  setUserGroupName: (name: string, value: PolyglotModel) => void;
  userGroupCategoryId: string;
  setRadioGroupCategoryId: (value: string) => void;
  userGroupCategoryList: UserGroupCategoryModel[];
}

class UserGroupCreateView extends React.Component<Props> {
  //
  render() {
    //
    const { userGroupName, setUserGroupName, userGroupCategoryId, setRadioGroupCategoryId, userGroupCategoryList } =
      this.props;

    return (
      <Form>
        <FormTable title="기본 정보">
          <FormTable.Row name="사용자 그룹명" required>
            {/*<Form.Field*/}
            {/*  width={16}*/}
            {/*  control={Input}*/}
            {/*  placeholder=""*/}
            {/*  value={(userGroupName && userGroupName) || ''}*/}
            {/*  onChange={(event: any) => setUserGroupName(event.target.value)}*/}
            {/*/>*/}

            <Polyglot.Input name="name" onChangeProps={setUserGroupName} languageStrings={userGroupName} />
          </FormTable.Row>
          <FormTable.Row name="사용자 그룹 분류 " required>
            <div className="check-group">
              <div className="table-inner">
                {userGroupCategoryList &&
                  userGroupCategoryList.length > 0 &&
                  userGroupCategoryList.map((userGroupCategory: UserGroupCategoryModel) => (
                    <Grid.Column key={userGroupCategory.id}>
                      <Form.Field
                        key={userGroupCategory.id}
                        control={Radio}
                        label={getPolyglotToAnyString(userGroupCategory.name)}
                        value={userGroupCategory.id}
                        checked={(userGroupCategoryId && userGroupCategoryId === userGroupCategory.id) || false}
                        onClick={(event: any, data: any) => setRadioGroupCategoryId(data.value)}
                      />
                    </Grid.Column>
                  ))}
              </div>
            </div>
          </FormTable.Row>
        </FormTable>
      </Form>
    );
  }
}

export default UserGroupCreateView;
