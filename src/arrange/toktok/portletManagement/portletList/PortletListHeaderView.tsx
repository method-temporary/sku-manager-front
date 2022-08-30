import React from 'react';
import { Button, ButtonProps, DropdownProps, Grid, Select, Icon } from 'semantic-ui-react';
import { SelectType } from 'shared/model';

interface PortletListHeaderViewProps {
  totalCount: number;
  limit: number;
  onChangeLimit: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  onClickCreate: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void;
}

export function PortletListHeaderView({
  totalCount,
  limit,
  onChangeLimit,
  onClickCreate,
}: PortletListHeaderViewProps) {
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
              value={limit}
              onChange={onChangeLimit}
            />
            <Button onClick={onClickCreate}>
              <Icon name="plus" />
              Create
            </Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}