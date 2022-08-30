import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { FormFieldProps, Form, RadioProps } from 'semantic-ui-react';

type RadioValue = RadioProps['value'];

interface Props extends RadioProps {
  values: RadioValue[];
  value: RadioValue;
  as?: React.ElementType;
  control?: FormFieldProps['control'];
  labels?: RadioValue[];
  onChange?: (event: React.FormEvent<HTMLInputElement>, data: RadioProps) => void;
}

@reactAutobind
@observer
class RadioGroupView extends ReactComponent<Props> {
  //
  static defaultProps = {
    as: Form.Radio,
    labels: [],
    onChange: () => {},
  };

  render() {
    //
    const { as: Component, values, value, labels, onChange, label, checked, ...rest } = this.propsWithDefault;

    return values.map((radioValue, index) => (
      <Component
        key={`radio-${index}`}
        label={labels[index] || radioValue}
        value={radioValue}
        checked={value === radioValue}
        onChange={onChange}
        {...rest}
      />
    ));
  }
}

export default RadioGroupView;
