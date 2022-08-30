import React from 'react';
import { Form, Grid } from 'semantic-ui-react';
import { CalendarView } from './CalendarView';

interface SearchDateViewProps {
  startDate: Date;
  endDate: Date;
  selectedDate: string;
  onChangeStartDate: (date: Date) => void;
  onChangeEndDate: (date: Date) => void;
  onClickDate: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SearchDateView({
  startDate,
  endDate,
  selectedDate,
  onChangeStartDate,
  onChangeEndDate,
  onClickDate,
}: SearchDateViewProps) {
  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>등록일자</label>
        <CalendarView
          startDate={startDate}
          endDate={endDate}
          selectedDate={selectedDate}
          onChangeStartDate={onChangeStartDate}
          onChangeEndDate={onChangeEndDate}
          onClickDate={onClickDate}
        />
      </Form.Group>
    </Grid.Column>
  );
}
