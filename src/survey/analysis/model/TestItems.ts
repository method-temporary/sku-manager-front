import { decorate, observable } from 'mobx';

export class TestItems {
  //
  sentences: Map<string, number> = new Map<string, number>();

  constructor(items?: any) {
    if (items) {
      Object.assign(this, items);
      //this.sentencesMap = items.sentencesMap && new Map(Object.entries(items.sentencesMap)) || new Map<string, number>();
    }
  }
}
decorate(TestItems, {
  sentences: observable,
});
