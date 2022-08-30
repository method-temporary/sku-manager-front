import * as React from 'react';
import { observer } from 'mobx-react';
import { SubActions } from 'shared/components';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

interface Props {
  index: number;
}

@observer
@reactAutobind
class ElementManagementButtonView extends ReactComponent<Props> {
  //
  componentDidMount(): void {}

  render() {
    const { index } = this.props;

    return (
      <>
        <SubActions>
          <SubActions.Left>
            <SubActions.Count number={index} text="개" />
          </SubActions.Left>
        </SubActions>
      </>
    );
  }
}

export default ElementManagementButtonView;
