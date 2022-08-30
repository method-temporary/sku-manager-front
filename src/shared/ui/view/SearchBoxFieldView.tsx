import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { Form, Grid, Select } from 'semantic-ui-react';

interface Props {
  fieldTitle: string;
  fieldOption: any;
  onChangeQueryProps: (name: string, value: any) => void;
  queryFieldName: string;
  targetValue: string | boolean | {};
  placeholder?: string;
}

@observer
@reactAutobind
class SearchBoxFieldView extends React.Component<Props> {
  //
  render() {
    const { fieldOption, fieldTitle, onChangeQueryProps, queryFieldName, targetValue, placeholder } = this.props;
    return (
      <Grid.Column width={8}>
        <Form.Group inline>
          <label>{fieldTitle}</label>
          <Form.Field
            control={Select}
            placeholder={placeholder ? placeholder : 'Select'}
            options={fieldOption}
            value={targetValue}
            onChange={(e: any, data: any) => onChangeQueryProps(`${queryFieldName}`, data.value)}
          />
        </Form.Group>
      </Grid.Column>
    );
  }
}

export default SearchBoxFieldView;
