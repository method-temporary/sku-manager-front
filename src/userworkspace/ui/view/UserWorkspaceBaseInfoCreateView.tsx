import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Input, Select } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { FormTable } from 'shared/components';

import UserWorkspaceModel from '../../model/UserWorkspaceModel';

interface Props {
  getParentWorkspaceName: (id: string) => string;
  userWorkspace: UserWorkspaceModel;
  updatable: boolean;
  parentWorkspaceOptions: SelectTypeModel[];
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceBaseInfoCreateView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { userWorkspace, parentWorkspaceOptions } = this.props;

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="사용자 소속 명" required>
          <Form.Field width={16} control={Input} />
        </FormTable.Row>
        <FormTable.Row name="USID" required>
          <Form.Field width={16} control={Input} />
        </FormTable.Row>
        <FormTable.Row name="사용 여부" required>
          <Form.Field control={Select} options={SelectType.userWorkspaceStateOptions} placeholder="사용 여부" />
        </FormTable.Row>
        <FormTable.Row name="상위 사용자 소속">
          <Form.Field control={Select} options={parentWorkspaceOptions} placeholder="상위 사용자 소속" />
        </FormTable.Row>
        <FormTable.Row name="SK 그룹사 여부">{userWorkspace.skGroup}</FormTable.Row>
        <FormTable.Row name="GDI 계정 동기화">{userWorkspace.syncWithGdi}</FormTable.Row>
        <FormTable.Row name="개인학습 사용 여부">{userWorkspace.useApl}</FormTable.Row>
        {/*팀 리더면 안보여줘도 되고 HR담당자면 보여줘야*/}
        <FormTable.Row name="개인학습 승인">{userWorkspace.lectureApproval.aplApproverType}</FormTable.Row>
        <FormTable.Row name="유료과정 승인">{userWorkspace.lectureApproval.courseApproverType}</FormTable.Row>
        {/*<FormTable.Row name="등록/변경">*/}
        {/*  <div>{`등록 : ${moment(userWorkspace.time).format('YYYY.MM.DD')} / ${userWorkspace.creator}`}</div>*/}
        {/*  <div>{`변경 : ${moment(userWorkspace.modifiedTime).format('YYYY.MM.DD')} / ${*/}
        {/*    userWorkspace.modifierName*/}
        {/*  }`}</div>*/}
        {/*</FormTable.Row>*/}
      </FormTable>
    );
  }
}

export default UserWorkspaceBaseInfoCreateView;
