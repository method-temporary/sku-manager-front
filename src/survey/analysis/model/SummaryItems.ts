import AnswerModel from '../../answer/model/AnswerModel';

export default interface SummaryItems {
  getAnswerType: () => string;
  addAnswer:(answer: AnswerModel) => void;
};
