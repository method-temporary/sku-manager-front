import React from 'react';
import { observer } from 'mobx-react';
import { Checkbox, Form, Grid } from 'semantic-ui-react';

import { UserWorkSpace } from '_data/user/useWorkspaces/model/UserWorkSpace';

import { getUserWorkSpaceName } from 'userworkspace/userWorkSpace.util';

import { isRequiredChecked } from '../PermittedCineroomModal.event';
import PermittedCineroomModalStore from '../PermittedCineroomModal.store';
import { PermittedCineroomWithParentId } from '../../../model';

interface Props {
  userWorkspaces: UserWorkSpace[];
  permittedCinerooms: PermittedCineroomWithParentId[];
  onCheckOne: (check: boolean, selectCineroomId: string, selectCineroomParentId: string, required?: boolean) => void;
}

const PermittedListByPC = observer(({ userWorkspaces, permittedCinerooms, onCheckOne }: Props) => {
  //
  const { isRequireAll } = PermittedCineroomModalStore.instance;

  return (
    <>
      {permittedCinerooms.map((permittedCineroom, index) => (
        <Grid.Column key={index}>
          <Form.Field
            key={index}
            disabled={isRequireAll}
            control={Checkbox}
            label={getUserWorkSpaceName(userWorkspaces, permittedCineroom.cineroomId)}
            value={permittedCineroom.cineroomId}
            checked={isRequiredChecked(permittedCineroom.cineroomId, permittedCineroom.parentId)}
            onChange={(e: any, data: any) => onCheckOne(data.checked, data.value, permittedCineroom.parentId, true)}
          />
        </Grid.Column>
      ))}
    </>
  );
});

export default PermittedListByPC;
