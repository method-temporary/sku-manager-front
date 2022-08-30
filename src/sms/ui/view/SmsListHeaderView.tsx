import React from 'react';
import { Button, ButtonProps, DropdownProps, Grid, Select } from 'semantic-ui-react';
import { SelectType } from 'shared/model';

interface SmsListHeaderViewProps {
  totalCount: number,
  smsLimit: number,
  onChangeLimit: (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void,
  onClickSendSms: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => void,
}

export function SmsListHeaderView({
  totalCount,
  smsLimit,
  onChangeLimit,
  onClickSendSms,
}: SmsListHeaderViewProps) {
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
            <Button onClick={onClickSendSms}>
              SMS 보내기
            </Button>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}