import React from 'react';
import { observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { ButtonProps, Form } from 'semantic-ui-react';

interface Props extends ButtonProps {
  children?: React.ReactNode;
}

interface State {}

interface Injected {}

@observer
@reactAutobind
class FieldButtonView extends ReactComponent<Props, State, Injected> {
  //
  static defaultProps = {
    size: 'medium',
  };

  render() {
    //
    const { children, size, onClick, ...rest } = this.props;

    return (
      <Form.Button {...rest} size={size} onClick={onClick} type="button">
        {children}
      </Form.Button>
    );
  }
}

export default FieldButtonView;
