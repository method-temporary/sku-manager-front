import React from 'react';
import { Checkbox, CheckboxProps, Form, Grid } from 'semantic-ui-react';
import { FormTable } from 'shared/components';
import UserWorkspaceModel from 'userworkspace/model/UserWorkspaceModel';

interface CineroomCheckboxViewProps {
  workspaces?: UserWorkspaceModel[];
  checkedCinerooms: string[];
  onCheckAll: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
  onCheckCineroom: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void;
}

export function CineroomCheckboxView({
  workspaces,
  checkedCinerooms,
  onCheckAll,
  onCheckCineroom,
}: CineroomCheckboxViewProps) {
  /* All 체크박스 주석 해지 시, 다시 사용할 예정 */
  const visibleAll = workspaces?.length !== 1;
  const allChecked = workspaces?.length === checkedCinerooms.length;

  return (
    <FormTable.Row name="멤버사 적용 범위" required>
      <div className="check-group">
        <div className="table-inner">
          {/* 우선 All 체크박스 주석 처리 */}
          {/* {visibleAll === true && (
            <Grid.Column>
            <Form.Field
              control={Checkbox}
              label="All"
              checked={allChecked}
              onChange={onCheckAll}
            />
            </Grid.Column>
          )} */}
          {workspaces !== undefined &&
            workspaces.map((workspace, index) => {
              const cineroomName = workspace.id === 'ne1-m2-c2' ? 'toktok' : workspace.name.ko;
              const checkboxDisabled = workspace.id !== 'ne1-m2-c2' && checkedCinerooms.includes('ne1-m2-c2');

              return (
                <Grid.Column key={index}>
                  <Form.Field
                    control={Checkbox}
                    key={workspace.id}
                    value={workspace.id}
                    label={cineroomName}
                    checked={checkedCinerooms.includes(workspace.id)}
                    onChange={onCheckCineroom}
                    disabled={checkboxDisabled}
                  />
                </Grid.Column>
              );
            })}
        </div>
      </div>
    </FormTable.Row>
  );
}
