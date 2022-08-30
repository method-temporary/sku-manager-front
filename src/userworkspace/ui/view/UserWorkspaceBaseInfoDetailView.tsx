import * as React from 'react';
import { observer } from 'mobx-react';
import moment from 'moment';

import { MemberViewModel } from '@nara.drama/approval';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import { SelectTypeModel } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import UserWorkspaceModel from '../../model/UserWorkspaceModel';
import { getUserWorkspaceStateValue } from '../../model/vo/UserWorkspaceState';

interface Props {
  getParentWorkspaceName: (id: string) => string;
  handleManagerModalOk: (member: MemberViewModel, propertyName: string) => void;
  onChangeUserWorkspaceProps: (name: string, value: any) => void;

  userWorkspace: UserWorkspaceModel;
  updatable: boolean;
  parentWorkspaceOptions: SelectTypeModel[];
}

interface States {}

@observer
@reactAutobind
class UserWorkspaceBaseInfoDetailView extends ReactComponent<Props, States> {
  //

  render() {
    //
    const { getParentWorkspaceName } = this.props;
    const { userWorkspace } = this.props;

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="사용자 소속 명">
          <span>{getPolyglotToAnyString(userWorkspace.name)}</span>
        </FormTable.Row>
        <FormTable.Row name="USID">
          <span>{userWorkspace.usid}</span>
        </FormTable.Row>
        <FormTable.Row name="사용 여부" required>
          <span>{getUserWorkspaceStateValue(userWorkspace.state)}</span>
        </FormTable.Row>
        <FormTable.Row name="상위 사용자 소속">
          <span>{getParentWorkspaceName(userWorkspace.parentId)}</span>
        </FormTable.Row>
        <FormTable.Row name="SK 그룹사 여부">
          <span>{userWorkspace.skGroup ? 'SK 그룹사' : '-'}</span>
        </FormTable.Row>
        <FormTable.Row name="GDI 계정 동기화">
          <span>{userWorkspace.syncWithGdi ? '동기화 사용' : '-'}</span>
        </FormTable.Row>

        <FormTable.Row name="등록/변경">
          <div>{`등록 : ${moment(userWorkspace.registeredTime).format('YYYY.MM.DD')} / ${
            userWorkspace.creatorName
          }`}</div>
          <div>{`변경 : ${moment(userWorkspace.modifiedTime).format('YYYY.MM.DD')} / ${getPolyglotToAnyString(
            userWorkspace.modifierName
          )}`}</div>
        </FormTable.Row>
      </FormTable>
    );
  }
}

export default UserWorkspaceBaseInfoDetailView;
