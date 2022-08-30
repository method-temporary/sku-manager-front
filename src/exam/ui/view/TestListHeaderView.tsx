import React from 'react';
import { Button, ButtonProps, DropdownProps, Grid, Select } from 'semantic-ui-react';
import { SelectType } from 'shared/model';

interface TestListHeaderViewProps {
  testLimit: number;
  onChangeLimit: (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  onClickCreate: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
}

export function TestListHeaderView({ testLimit, onChangeLimit, onClickCreate }: TestListHeaderViewProps) {
  return (
    <Grid className="list-info">
      <Grid.Row>
        <Grid.Column width={8}></Grid.Column>
        <Grid.Column width={8}>
          <div className="right">
            <Select
              className="ui small-border dropdown m0"
              control={Select}
              options={SelectType.limit}
              value={testLimit}
              onChange={onChangeLimit}
            />
            <Button onClick={onClickCreate}>시험지 등록</Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
