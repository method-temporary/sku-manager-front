import React, { ComponentType } from 'react';

interface State {
  component: ComponentType | null
}

const withSplitting = (getComponent: Function) => {

  class WithSplitting extends React.Component<{}, State> {

    constructor(props: any) {
      super(props);

      this.state = {
        component: null,
      };
    }

    componentDidMount() {
      getComponent().then((component: any) => {
        this.setState({ component: component.default });
      });
    }

    render() {

      const ImportComponent = this.state.component;

      if (!ImportComponent) return null;

      return (
        <ImportComponent
          {...this.props}
        />
      );
    }
  }

  return WithSplitting;
};

export default withSplitting;
