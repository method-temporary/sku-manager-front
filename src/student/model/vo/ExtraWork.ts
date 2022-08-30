import { decorate, observable } from 'mobx';
import { ExtraWorkState } from './ExtraWorkState';

export default class ExtraWork {
  //
  testStatus: ExtraWorkState = ExtraWorkState.Empty;
  reportStatus: ExtraWorkState = ExtraWorkState.Empty;
  surveyStatus: ExtraWorkState = ExtraWorkState.Empty;
  discussionStatus: ExtraWorkState = ExtraWorkState.Empty;
}

decorate(ExtraWork, {
  testStatus: observable,
  reportStatus: observable,
  surveyStatus: observable,
  discussionStatus: observable,
});
