import { decorate, observable } from 'mobx';

export class FeedbackModel {
  surveyFeedbackId: string = '';
  reviewFeedbackId: string = '';

  constructor(feedback?: FeedbackModel) {
    if (feedback) {
      Object.assign(this, { ...feedback });
    }
  }
}

decorate(FeedbackModel, {
  surveyFeedbackId: observable,
  reviewFeedbackId: observable,
});
