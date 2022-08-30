import React from 'react';
import { Grid, Form, Select, DropdownProps } from 'semantic-ui-react';
import { SelectOption } from 'shared/model';

interface SearchCineroomViewProps {
  cineroom: string;
  onChangeCineroom: (e: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => void;
  options: SelectOption[];
}

export function SearchCineroomView({ cineroom, onChangeCineroom, options }: SearchCineroomViewProps) {
  return (
    <Grid.Column width={16}>
      <Form.Group inline>
        <label>관계사</label>
        <Form.Field
          control={Select}
          placeholder="전체"
          value={cineroom}
          options={options}
          onChange={onChangeCineroom}
        />
      </Form.Group>
    </Grid.Column>
  );
}
