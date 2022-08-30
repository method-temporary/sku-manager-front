import QuestionModel from '../QuestionModel';

export default class RelatedQnaRdo {
  question: QuestionModel = new QuestionModel();
  type: string = '';

  constructor(relatedQnaRda?: RelatedQnaRdo) {
    if (relatedQnaRda) {
      const question = new QuestionModel(relatedQnaRda.question);

      Object.assign(this, { ...relatedQnaRda });
    }
  }
}
