import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { ButtonProps, Button, Icon } from 'semantic-ui-react';

interface Props extends ButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

@observer
@reactAutobind
class CreateButtonView extends React.Component<Props> {
  //
  static defaultProps = {};

  render() {
    //
    const { children, onClick, ...rest } = this.props;

    return (
      <Button {...rest} type="button" onClick={onClick}>
        <Icon name="plus" />
        {children || 'Create'}
      </Button>
    );
  }
}

export default CreateButtonView;
