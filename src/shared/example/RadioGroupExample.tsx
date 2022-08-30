import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { RadioProps, Container, Header, Form, Radio, Divider } from 'semantic-ui-react';
import { RadioGroup } from '../components';

interface State {
  value?: string;
  booleanValue?: boolean;
}

@reactAutobind
@observer
class RadioGroupExample extends ReactComponent<{}, State> {
  //
  state: State = {
    booleanValue: undefined,
  };

  onChange(e: React.SyntheticEvent<HTMLInputElement>, { value }: RadioProps) {
    //
    this.setState({ value: value as string });
  }

  onChangeBoolean(e: React.SyntheticEvent, { value }: RadioProps) {
    //
    const valueAsBoolean = typeof value === 'string' ? value === 'true' : undefined;

    this.setState({ booleanValue: valueAsBoolean });
  }

  renderBasic() {
    //
    const { value } = this.state;

    return (
      <Form>
        <Form.Group>
          <RadioGroup values={['value1', 'value2']} value={value} onChange={this.onChange} />
        </Form.Group>
      </Form>
    );
  }

  renderWithoutFormGroup() {
    //
    const { value } = this.state;

    return (
      <Form>
        <RadioGroup values={['value1', 'value2']} value={value} onChange={this.onChange} />
      </Form>
    );
  }

  renderAsRadio() {
    //
    const { value } = this.state;

    return <RadioGroup as={Radio} values={['value1', 'value2']} value={value} onChange={this.onChange} />;
  }

  renderLabel() {
    //
    const { value } = this.state;

    return (
      <Form>
        <RadioGroup
          values={['value1', 'value2']}
          labels={['First Value', 'Second Value']}
          value={value}
          onChange={this.onChange}
        />
      </Form>
    );
  }

  renderBoolean() {
    //
    const { booleanValue } = this.state;
    const valueAsString = typeof booleanValue === 'boolean' ? String(booleanValue) : booleanValue;

    return (
      <Form>
        <RadioGroup values={['true', 'false']} value={valueAsString} onChange={this.onChangeBoolean} />
      </Form>
    );
  }

  render() {
    //
    return (
      <Container fluid>
        <Header size="large">Pattern</Header>

        <Header size="small">basic use (Form.Group)</Header>
        {this.renderBasic()}

        <Header size="small">Form.Group Unused</Header>
        {this.renderWithoutFormGroup()}

        <Header size="small">as={'{Radio}'}</Header>
        {this.renderAsRadio()}

        <Divider />
        <Header size="large">Props</Header>

        <Header size="small">In case value and label are different</Header>
        {this.renderLabel()}

        <Header size="small">use boolean type</Header>
        {this.renderBoolean()}
      </Container>
    );
  }
}

export default RadioGroupExample;
