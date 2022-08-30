import React from 'react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Dimmer, Loader as SemanticLoader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { LoaderService } from './present/logic/LoaderService';

interface Props {
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  name?: string;
  loaderText?: React.ReactNode;
}

interface Injected {
  loaderService: LoaderService;
}

@inject('loaderService')
@observer
@reactAutobind
class Loader extends ReactComponent<Props, {}, Injected> {
  //

  componentDidMount() {
    //
    const { addLoaderNames } = this.injected.loaderService;
    const { name } = this.props;

    if (name) {
      addLoaderNames(name);
    }
  }

  getActive(): boolean {
    const { name } = this.props;
    const { active, loaderNames, closeLoaderName } = this.injected.loaderService;

    let result = active;

    if (name && loaderNames.includes(name)) {
      result = !(closeLoaderName === 'ALL' || name === closeLoaderName);
    }

    return result;
  }

  render() {
    //
    const { pageLoader } = this.injected.loaderService;
    const { className, children, disabled = false, loaderText } = this.props;

    const active = this.getActive();

    return (
      <>
        {disabled ? (
          <>{children && children}</>
        ) : (
          <>
            <Dimmer.Dimmable dimmed={active} className={className}>
              <Dimmer active={active} inverted={!pageLoader} page={pageLoader}>
                <SemanticLoader>{loaderText || 'Loading'}</SemanticLoader>
              </Dimmer>
              {children && children}
            </Dimmer.Dimmable>
          </>
        )}
      </>
    );
  }
}

export default Loader;
