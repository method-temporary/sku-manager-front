import React from 'react';
import { useAvailableWorkspaces } from 'shared/hooks';
import { onCheckCineroom, onCheckAll } from './cineroomCheckbox.events';
import { useInitCheckedCinerooms } from './cineroomCheckbox.services';
import { useCheckedCinerooms } from './cineroomCheckbox.stores';
import { CineroomCheckboxView } from './CineroomCheckboxView';

export function CineroomCheckboxContainer() {
  useInitCheckedCinerooms();
  const availableWorkspaces = useAvailableWorkspaces();
  const checkedCinerooms = useCheckedCinerooms() || [];

  return (
    <CineroomCheckboxView
      workspaces={availableWorkspaces}
      checkedCinerooms={checkedCinerooms}
      onCheckAll={onCheckAll}
      onCheckCineroom={onCheckCineroom}
    />
  );
}
