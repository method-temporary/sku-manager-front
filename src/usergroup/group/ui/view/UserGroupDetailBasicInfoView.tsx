import React from 'react';
import moment from 'moment';

import { FormTable, Polyglot } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserGroupModel } from '../../model';

interface Props {
  userGroup: UserGroupModel;
  userWorkspaceMap: Map<string, string>;
}

class UserGroupDetailBasicInfoView extends React.Component<Props> {
  //
  render() {
    //
    const { userGroup, userWorkspaceMap } = this.props;

    return (
      <FormTable title="기본 정보">
        <FormTable.Row name="사용자 그룹명">
          <Polyglot.Input name="name" languageStrings={userGroup.name} readOnly />
        </FormTable.Row>
        <FormTable.Row name="사용처">{userWorkspaceMap.get(userGroup.cineroomId)}</FormTable.Row>
        <FormTable.Row name="사용여부">{userGroup.enabled ? '사용' : '사용중지'}</FormTable.Row>
        <FormTable.Row name="사용자 그룹 분류">{getPolyglotToAnyString(userGroup.categoryName)}</FormTable.Row>
        <FormTable.Row name="생성자">{getPolyglotToAnyString(userGroup.registrantName)}</FormTable.Row>
        <FormTable.Row name="등록일자">{moment(userGroup.registeredTime).format(`YYYY.MM.DD HH:mm:ss`)}</FormTable.Row>
      </FormTable>
    );
  }
}

export default UserGroupDetailBasicInfoView;
