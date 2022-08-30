import React from 'react';
import { observer } from 'mobx-react';
import { useParams } from 'react-router-dom';
import { Checkbox, Form, Grid } from 'semantic-ui-react';

import { Params } from 'shared/model';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { UserWorkSpace } from '_data/user/useWorkspaces/model/UserWorkSpace';

import { getUserWorkSpaceName } from 'userworkspace/userWorkSpace.util';

import {
  isPermittedCineroomChecked,
  isPermittedCineroomDisabled,
  isRequiredChecked,
  isRequiredDisabled,
} from '../PermittedCineroomModal.event';
import PermittedCineroomModalStore from '../PermittedCineroomModal.store';

interface Props {
  required?: boolean;
  cineroomId: string;
  userWorkspaces: UserWorkSpace[];
  onCheckAll: (check: boolean, required?: boolean) => void;
  onCheckOne: (check: boolean, selectCineroomId: string, selectCineroomParentId: string, required?: boolean) => void;
}

const PermittedListByUWS = observer(({ required, cineroomId, userWorkspaces, onCheckAll, onCheckOne }: Props) => {
  //
  const { isAll, isRequireAll } = PermittedCineroomModalStore.instance;

  return (
    <div className="scrolling-30vh">
      <div className="check-group">
        <div className="table-inner-modal">
          {
            <Grid.Column>
              <Form.Field
                control={Checkbox}
                label={userWorkspaces.length > 1 ? 'ALL' : getUserWorkSpaceName(userWorkspaces, cineroomId)}
                checked={required ? isRequireAll : isAll}
                onChange={(_: any, data: any) => onCheckAll(data.checked, required)}
              />
            </Grid.Column>
          }
          {userWorkspaces.length > 1 &&
            userWorkspaces &&
            userWorkspaces.length &&
            userWorkspaces
              .filter((userWorkspace) => {
                if (userWorkspaces.length > 1 && userWorkspace.id !== cineroomId) {
                  return userWorkspace;
                } else if (userWorkspaces.length === 1) {
                  return userWorkspace;
                }
                return null;
              })
              .map((userWorkspace, index) => (
                <Grid.Column key={index}>
                  <Form.Field
                    key={index}
                    disabled={required ? isRequiredDisabled(userWorkspace) : isPermittedCineroomDisabled(userWorkspace)}
                    control={Checkbox}
                    label={getPolyglotToAnyString(userWorkspace.name)}
                    value={userWorkspace.id}
                    checked={
                      required
                        ? isRequiredChecked(userWorkspace.id, userWorkspace.parentId)
                        : isPermittedCineroomChecked(userWorkspace)
                    }
                    onChange={(e: any, data: any) =>
                      onCheckOne(data.checked, data.value, userWorkspace.parentId, required)
                    }
                  />
                </Grid.Column>
              ))}
        </div>
      </div>
    </div>
  );
});

export default PermittedListByUWS;
