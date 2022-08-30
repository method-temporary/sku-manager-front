export default class CardInstructorsModel {
  //
  instructorId: string = '';
  name: string = '';
  company: string = '';
  email: string = '';
  representative: boolean = false;

  constructor(cardInstructorsModel?: CardInstructorsModel) {
    //
    if (cardInstructorsModel) {
      Object.assign(this, { ...cardInstructorsModel });
    }
  }

  static asCardInstructorsModel(
    instructorId: string,
    name: string,
    company: string,
    email: string,
    representative: boolean
  ): CardInstructorsModel {
    //
    return {
      instructorId,
      name,
      company,
      email,
      representative,
    };
  }
}
