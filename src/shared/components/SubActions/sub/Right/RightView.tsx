import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { Grid, GridColumnProps } from 'semantic-ui-react';
import SubActionsContext from '../../context/SubActionsContext';

interface Props extends GridColumnProps {
  children: React.ReactNode;
}

@observer
@reactAutobind
class RightView extends React.Component<Props> {
  //
  static defaultProps = {};

  static contextType = SubActionsContext;

  context!: React.ContextType<typeof SubActionsContext>;

  render() {
    //
    const { children, ...rest } = this.props;
    const { form } = this.context;

    if (form) {
      return <div className="fl-right">{children}</div>;
    } else {
      return (
        <Grid.Column {...rest}>
          <div className="right">{children}</div>
        </Grid.Column>
      );
    }
  }
}

export default RightView;
