import { PolyglotModel } from 'shared/model';
import { LangSupport } from 'shared/components/Polyglot';

export interface CardPolyglotUdo {
  //
  cardId: string;
  langSupports: LangSupport[];
  name: PolyglotModel;
  simpleDescription: PolyglotModel;
  tags: PolyglotModel;
  description: PolyglotModel;
  reportName: PolyglotModel;
  reportQuestion: PolyglotModel;
}

export function getInitCardPolyglotUdo(): CardPolyglotUdo {
  //
  return {
    cardId: '',
    langSupports: [],
    name: new PolyglotModel(),
    simpleDescription: new PolyglotModel(),
    tags: new PolyglotModel(),
    description: new PolyglotModel(),
    reportName: new PolyglotModel(),
    reportQuestion: new PolyglotModel(),
  };
}
