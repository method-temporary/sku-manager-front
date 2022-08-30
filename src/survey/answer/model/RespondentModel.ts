
export default class RespondentModel {

  usid: string = '';
  email: string = '';
  title: string = '';
  company: string = '';

  constructor(respondent?: RespondentModel) {
    if (respondent) {
      Object.assign(this, respondent);
    }
  }
}
