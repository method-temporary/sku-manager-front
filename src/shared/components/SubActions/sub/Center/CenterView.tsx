import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { GridColumnProps, Grid } from 'semantic-ui-react';

import { observer } from 'mobx-react';
import SubActionsContext from '../../context/SubActionsContext';

interface Props extends GridColumnProps {
  children: React.ReactNode;
}

@observer
@reactAutobind
class CenterView extends React.Component<Props> {
  //
  static defaultProps = {};

  static contextType = SubActionsContext;

  context!: React.ContextType<typeof SubActionsContext>;

  render() {
    //
    const { children, ...rest } = this.props;
    const { form } = this.context;

    const style = {
      margin: '0, auto',
    };

    if (form) {
      return (
        <div className="center" style={style}>
          {children}
        </div>
      );
    } else {
      return (
        <Grid.Column {...rest}>
          <div className="center">{children}</div>
        </Grid.Column>
      );
    }
  }
}

export default CenterView;
