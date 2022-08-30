import React from 'react';
import PolyglotContext from './context/PolyglotContext';
import LangSupport from './model/LangSupport';

interface Props {
  languages: LangSupport[];
  children: React.ReactNode;
}

class PolyglotView extends React.Component<Props> {
  //
  static defaultProps = {
    languages: [],
  };

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  getContext() {
    //
    const { languages } = this.props;
    const { names } = this.context;
    return { languages, names };
  }

  render() {
    //
    const { children } = this.props;

    return <PolyglotContext.Provider value={this.getContext()}>{children}</PolyglotContext.Provider>;
  }
}

export default PolyglotView;
