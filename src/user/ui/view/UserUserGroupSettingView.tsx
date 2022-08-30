import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { UserGroupSelect } from 'shared/components';

interface Props {
  companyCode?: string;
  readonly?: boolean;
}

@observer
@reactAutobind
class UserUserGroupSettingView extends ReactComponent<Props> {
  //
  render() {
    //
    const { companyCode, readonly } = this.props;

    return (
      <>
        <UserGroupSelect readonly={readonly} multiple onChange={() => {}} companyCode={companyCode} />
      </>
    );
  }
}

export default UserUserGroupSettingView;
