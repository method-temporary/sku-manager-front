import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  active: boolean;
}

export const CardStudentResultLoader = observer((props: PropsWithChildren<Props>) => {
  //
  return (
    <Dimmer.Dimmable>
      <Dimmer active={props.active} inverted={true}>
        <Loader />
      </Dimmer>
      {props.children}
    </Dimmer.Dimmable>
  );
});
