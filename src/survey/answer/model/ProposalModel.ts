
export default class ProposalModel {

  suggestionSequence: string = '';
  sentence: string = '';

  constructor(proposal?: ProposalModel) {
    if (proposal) {
      Object.assign(this, proposal);
    }
  }
}
