import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { FormTable, UserGroupSelectModal } from 'shared/components';
import { Form, Grid, Select } from 'semantic-ui-react';
import { SelectType } from 'shared/model';
import { getLectureApproverTypeValue, LectureApproverType } from '../../model/vo/LectureApproverType';
import ManagerListModal from '../../../cube/cube/ui/view/ManagerListModal';
import { MemberViewModel } from '@nara.drama/approval';
import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import { ReactNode } from 'react';
import { patronInfo } from '@nara.platform/dock';

interface Props {
  handleManagerModalOk: (member: MemberViewModel, propertyName: string) => void;
  onChangeUserWorkspaceProps: (name: string, value: any) => void;
  makeUserGroupsNode: (groupSequences: number[]) => ReactNode;
  initialModifyAccessRuleValue: (sequences: number[]) => void;
  onModifyAccessRule: (name: string) => void;

  userWorkspace: UserWorkspaceModel;
  updatable: boolean;
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceLearningInfoView extends ReactComponent<Props, States> {
  //
  getApproverNode(type: LectureApproverType, name: string): String {
    //
    if (type === LectureApproverType.TeamLeader) {
      return getLectureApproverTypeValue(type);
    } else if (type === LectureApproverType.HrManager) {
      return `${getLectureApproverTypeValue(type)} (${name})`;
    } else {
      return '';
    }
  }

  render() {
    //
    const {
      handleManagerModalOk,
      onChangeUserWorkspaceProps,
      makeUserGroupsNode,
      initialModifyAccessRuleValue,
      onModifyAccessRule,
    } = this.props;

    const { userWorkspace, updatable } = this.props;
    const roles = patronInfo.getPatronRoles(patronInfo.getCineroomId());

    return (
      <FormTable title="학습 관련 정보">
        <FormTable.Row name="개인학습 사용 여부">
          {updatable ? (
            <Form.Field
              width={16}
              control={Select}
              value={userWorkspace.useApl ? 'Yes' : 'No'}
              options={SelectType.aplState}
              onChange={(e: any, data: any) => onChangeUserWorkspaceProps('useApl', data.value)}
            />
          ) : (
            <span>{userWorkspace.useApl ? '사용' : '미사용'}</span>
          )}
        </FormTable.Row>
        {/*팀 리더면 안보여줘도 되고 HR담당자면 보여줘야*/}
        <FormTable.Row name="개인학습 승인">
          {updatable ? (
            <Form.Group inline>
              <Select
                options={SelectType.approverTypeOptions}
                placeholder="승인자 유형"
                value={userWorkspace.lectureApproval.aplApproverType}
                onChange={(e: any, data: any) =>
                  onChangeUserWorkspaceProps('lectureApproval.aplApproverType', data.value)
                }
              />
              {userWorkspace.lectureApproval.aplApproverType === LectureApproverType.HrManager &&
              userWorkspace.lectureApproval.aplApprover &&
              userWorkspace.lectureApproval.aplApproverName ? (
                <span>{`(${userWorkspace.lectureApproval.aplApproverName}) `}</span>
              ) : null}
              {userWorkspace.lectureApproval.aplApproverType === LectureApproverType.HrManager ? (
                <ManagerListModal
                  handleOk={(member, memberList) => handleManagerModalOk(member, 'apl')}
                  buttonName="승인자 선택"
                  multiSelect={false}
                />
              ) : null}
            </Form.Group>
          ) : (
            <span>
              {this.getApproverNode(
                userWorkspace.lectureApproval.aplApproverType,
                userWorkspace.lectureApproval.aplApproverName
              )}
            </span>
          )}
        </FormTable.Row>
        <FormTable.Row name="유료과정 승인">
          {updatable ? (
            <Form.Group inline>
              <Select
                options={SelectType.approverTypeOptions}
                placeholder="승인자 유형"
                value={userWorkspace.lectureApproval.courseApproverType}
                onChange={(e: any, data: any) =>
                  onChangeUserWorkspaceProps('lectureApproval.courseApproverType', data.value)
                }
              />
              {userWorkspace.lectureApproval.courseApproverType === LectureApproverType.HrManager &&
              userWorkspace.lectureApproval.courseApprover &&
              userWorkspace.lectureApproval.courseApproverName ? (
                <span>{`(${userWorkspace.lectureApproval.courseApproverName}) `}</span>
              ) : null}
              {userWorkspace.lectureApproval.courseApproverType === LectureApproverType.HrManager ? (
                <ManagerListModal
                  handleOk={(member, memberList) => handleManagerModalOk(member, 'paid')}
                  buttonName="승인자 선택"
                  multiSelect={false}
                />
              ) : null}
            </Form.Group>
          ) : (
            <span>
              {this.getApproverNode(
                userWorkspace.lectureApproval.courseApproverType,
                userWorkspace.lectureApproval.courseApproverName
              )}
            </span>
          )}
        </FormTable.Row>
        {roles.includes('SuperManager') || roles.includes('CollegeManager') ? (
          <FormTable.Row name="유료과정 블랙리스트 규칙">
            {/*<SelectedItem item={} onClick={} />*/}
            <Grid className="list-info">
              <Grid.Row>
                <Grid.Column width={8}>
                  <div>{makeUserGroupsNode(userWorkspace.blacklistAccessRuleForPaidLecture.groupSequences)}</div>
                </Grid.Column>
                <Grid.Column width={8}>
                  {updatable ? (
                    <div className="right">
                      <UserGroupSelectModal
                        multiple
                        initialize={() =>
                          initialModifyAccessRuleValue(userWorkspace.blacklistAccessRuleForPaidLecture.groupSequences)
                        }
                        // onCloseModal={() => console.log('창 닫음')}
                        onConfirm={() => onModifyAccessRule('blacklistAccessRuleForPaidLecture.groupSequences')}
                        button="수정"
                        modSuper={false}
                        title="유료과정 블랙리스트 설정"
                        description="유료과정 블랙리스트를 추가해주세요"
                        cineroomId={userWorkspace.id}
                      />
                    </div>
                  ) : null}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </FormTable.Row>
        ) : null}
      </FormTable>
    );
  }
}

export default UserWorkspaceLearningInfoView;
