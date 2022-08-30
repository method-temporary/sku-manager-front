import ProposalModel from './ProposalModel';

export default class SuggestionSheetModel {
  //
  proposals: ProposalModel[] = [];

  constructor(suggestionSheet?: SuggestionSheetModel) {
    if (suggestionSheet) {
      this.proposals = suggestionSheet.proposals
        && suggestionSheet.proposals.map((proposal: any) => new ProposalModel(proposal));
    }
  }

}
