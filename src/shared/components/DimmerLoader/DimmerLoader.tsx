import React from 'react';
import { observer } from 'mobx-react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  active: boolean;
  children?: React.ReactNode;
  loadingContents?: React.ReactNode;
  page?: boolean;
}

const DimmerLoader = observer(({ active, children, loadingContents, page }: Props) => {
  //
  return (
    <Dimmer.Dimmable>
      <Dimmer active={active} inverted page={page}>
        <Loader active={active} inverted>
          {loadingContents ? loadingContents : 'Loading...'}
        </Loader>
      </Dimmer>
      {children && children}
    </Dimmer.Dimmable>
  );
});

export default DimmerLoader;
