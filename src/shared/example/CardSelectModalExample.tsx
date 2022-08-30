import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';

import { Container } from 'semantic-ui-react';
import { CardSelectModal } from 'card/card';

@reactAutobind
@observer
class CardSelectModalExample extends ReactComponent {
  //
  render() {
    //
    return (
      <Container>
        <CardSelectModal />
      </Container>
    );
  }
}

export default CardSelectModalExample;
