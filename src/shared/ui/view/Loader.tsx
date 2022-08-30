import React from 'react';
import { observer } from 'mobx-react';
import { Dimmer, Loader as SemanticLoader } from 'semantic-ui-react';

interface Props {
  active: boolean;
  inverted?: boolean;
  children: React.ReactNode;
}

const Loader = observer(({ active, inverted, children }: Props) => {
  //
  return (
    <Dimmer active={active}>
      <SemanticLoader inverted={inverted}>{children}</SemanticLoader>
    </Dimmer>
  );
});

export default Loader;
