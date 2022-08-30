import React from 'react';
import { observer } from 'mobx-react';
import { ReactComponent, reactAutobind } from '@nara.platform/accent';
import { Grid, Form, GridColumnProps } from 'semantic-ui-react';

interface Props extends GridColumnProps {
  name?: string;
  children?: React.ReactNode;
  subGroup?: boolean;
}

@observer
@reactAutobind
class GroupView extends ReactComponent<Props> {
  //
  renderToChildren() {
    //
    const { name, children, rest, subGroup } = this.props;

    if (name) {
      //
      return (
        <Grid.Column {...rest} width={16}>
          <Form.Group inline className={subGroup ? 'subGroup' : ''}>
            {name && <label>{name}</label>}
            {children}
          </Form.Group>
        </Grid.Column>
      );
    } else {
      return React.Children.map(children, (child) =>
        child ? (
          <Grid.Column {...rest} width={8}>
            <Form.Group inline className={subGroup ? 'subGroup' : ''}>
              {child}
            </Form.Group>
          </Grid.Column>
        ) : null
      );
    }
  }

  render() {
    //
    return this.renderToChildren();
  }
}

export default GroupView;
