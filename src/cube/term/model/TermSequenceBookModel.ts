import { decorate, observable } from 'mobx';

export class TermSequenceBookModel {
  //
  static SINGLETON_ID: string = '1';
  private static CAPABILITY_PREFIX: string = 'CAPABILITY';
  private static SKILL_PREFIX: string = 'SKILL';
  private static CONCEPT_PREFIX: string = 'CONCEPT';
  private static TERM_PREFIX: string = 'TERM';

  id: string = '';
  capabilitySequence: number = 0;
  skillSequence: number = 0;
  conceptSequence: number = 0;
  termSequence: number = 0;

  constructor(termSequenceBook?: TermSequenceBookModel) {
    if (termSequenceBook) {
      Object.assign(this, { ...termSequenceBook });
    }
  }
}

decorate(TermSequenceBookModel, {
  id: observable,
  capabilitySequence: observable,
  skillSequence: observable,
  conceptSequence: observable,
  termSequence: observable,
});
