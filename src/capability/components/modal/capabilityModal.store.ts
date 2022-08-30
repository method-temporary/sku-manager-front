import { action, observable } from 'mobx';

class CapabilityModalStore {
  static instance: CapabilityModalStore;

  @observable
  testVisible: boolean = false;

  @observable
  resetVisible: boolean = false;

  @observable
  testAssessmentResultId: string = '';

  @observable
  resetAssessmentResultId: string = '';


  @action.bound
  setTestVisible() {
    this.testVisible = !this.testVisible;
  }

  @action.bound
  setResetVisible() {
    this.resetVisible = !this.resetVisible;
  }

  @action.bound
  setTestAssessmentResultId(assessmentResultId: string) {
    this.testAssessmentResultId = assessmentResultId;
  }

  @action.bound
  setResetAssessmentResultId(assessmentResultId: string) {
    this.resetAssessmentResultId = assessmentResultId;
  }
}

CapabilityModalStore.instance = new CapabilityModalStore();
export default CapabilityModalStore;
