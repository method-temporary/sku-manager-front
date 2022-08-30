import { decorate, observable } from 'mobx';
import { LangStrings } from 'shared/model';

export class SuggestionModel {
  sequence: number = 0;
  number: string = '';
  sentences: LangStrings = new LangStrings();

  constructor(suggestion?: SuggestionModel) {
    //
    if (suggestion) {
      const sentences = (suggestion.sentences && new LangStrings(suggestion.sentences)) || this.sentences;
      Object.assign(this, { ...suggestion, sentences });
    }
  }
}

decorate(SuggestionModel, {
  sequence: observable,
  number: observable,
  sentences: observable,
});
