import React from 'react';
import { Button, ButtonProps, DropdownProps, Grid, Select } from 'semantic-ui-react';
import { SubActions } from 'shared/components';
import { SelectType } from 'shared/model';

interface SmsMainNumberListHeaderViewProps {
  totalCount: number;
  smsLimit: number;
  onChangeLimit: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  onClickCreateMainNumber: () => void;
}

export function SmsMainNumberListHeaderView({
  totalCount,
  smsLimit,
  onChangeLimit,
  onClickCreateMainNumber,
}: SmsMainNumberListHeaderViewProps) {
  return (
    <Grid className="list-info">
      <Grid.Row>
        <Grid.Column width={8}>
          <span>
            전체 <strong>{totalCount}</strong>개
          </span>
        </Grid.Column>
        <Grid.Column width={8}>
          <div className="right">
            <Select
              className="ui small-border dropdown m0"
              control={Select}
              options={SelectType.limit}
              value={smsLimit}
              onChange={onChangeLimit}
            />
            <SubActions.CreateButton onClick={onClickCreateMainNumber}>Create</SubActions.CreateButton>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
