import React from 'react';
import { Form } from 'semantic-ui-react';
import { PolyglotModel } from 'shared/model';
import { FormTable } from 'shared/components';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  userGroupCategoryName?: PolyglotModel;
  setGroupCategoryName: (name: string, value: PolyglotModel) => void;
}

class UserGroupCategoryCreateView extends React.Component<Props> {
  //
  render() {
    //
    const { userGroupCategoryName, setGroupCategoryName } = this.props;

    return (
      <Form>
        <FormTable title="기본 정보">
          <FormTable.Row name="사용자 그룹 분류명" required>
            {/*<Form.Field*/}
            {/*  width={16}*/}
            {/*  control={Input}*/}
            {/*  placeholder=""*/}
            {/*  value={userGroupCategoryName || ''}*/}
            {/*  onChange={(event: any) => setGroupCategoryName(event.target.value)}*/}
            {/*/>*/}

            <Polyglot.Input
              name="name"
              onChangeProps={setGroupCategoryName}
              languageStrings={userGroupCategoryName || new PolyglotModel()}
            />
          </FormTable.Row>
        </FormTable>
      </Form>
    );
  }
}

export default UserGroupCategoryCreateView;
