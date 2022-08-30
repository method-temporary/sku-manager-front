import React from 'react';
import LangSupport from '../model/LangSupport';

export interface PolyglotContextModel {
  languages: LangSupport[];
  names: string[];
}

const PolyglotContext = React.createContext<PolyglotContextModel>({
  languages: [],
  names: [],
});

export default PolyglotContext;
