import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { FormTable, UserGroupSelectModal } from 'shared/components';
import { ReactNode } from 'react';
import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import { Grid } from 'semantic-ui-react';

interface Props {
  makeUserGroupsNode: (groupSequences: number[]) => ReactNode;
  initialModifyAccessRuleValue: (sequences: number[]) => void;
  onModifyAccessRule: (name: string) => void;

  userWorkspace: UserWorkspaceModel;
  // accessRules: UserGroupRuleModel[];
  updatable: boolean;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceUserGroupView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { makeUserGroupsNode, initialModifyAccessRuleValue, onModifyAccessRule } = this.props;
    const { userWorkspace, updatable } = this.props;

    // console.log(userWorkspace.defaultUserGroupSequences.sequences);

    return (
      <FormTable title=" Initial User Information">
        <FormTable.Row name="초기 사용자 그룹">
          {/*<SelectedItem item={} onClick={} />*/}
          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <div>{makeUserGroupsNode(userWorkspace.defaultUserGroupSequences.sequences)}</div>
              </Grid.Column>
              <Grid.Column width={8}>
                {updatable ? (
                  <div className="right">
                    <UserGroupSelectModal
                      multiple
                      initialize={() => initialModifyAccessRuleValue(userWorkspace.defaultUserGroupSequences.sequences)}
                      // onCloseModal={() => console.log('창 닫음')}
                      onConfirm={() => onModifyAccessRule('defaultUserGroupSequences.sequences')}
                      button="수정"
                      modSuper={false}
                      title="초기 사용자 그룹 설정"
                      description="초기 사용자 그룹을 추가해주세요."
                      cineroomId={userWorkspace.id}
                    />
                  </div>
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </FormTable.Row>
      </FormTable>
    );
  }
}
export default UserWorkspaceUserGroupView;
