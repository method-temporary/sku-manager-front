import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { SemanticWIDTHS, Grid } from 'semantic-ui-react';
import SubActionsContext from './context/SubActionsContext';

interface Props {
  children: React.ReactNode;
  form?: boolean;
}

@observer
@reactAutobind
class SubActionsContainer extends React.Component<Props> {
  //
  static defaultProps = {
    form: false,
  };

  getContext() {
    //
    const { form } = this.props;

    return {
      form: form as boolean,
    };
  }

  render() {
    //
    const { form, children } = this.props;
    const childrenCount = React.Children.count(children) as SemanticWIDTHS;
    let element;

    if (form) {
      element = <div className="btn-group">{children}</div>;
    } else {
      element = (
        <Grid columns={childrenCount} className="list-info">
          <Grid.Row>{children}</Grid.Row>
        </Grid>
      );
    }

    return <SubActionsContext.Provider value={this.getContext()}>{element}</SubActionsContext.Provider>;
  }
}

export default SubActionsContainer;
