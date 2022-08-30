import WaitingCount from './WaitingCount';
import ApprovalCount from './ApprovalCount';
import { LearningStateCount } from './LearningStateCount';
import ProposalStateCount from './ProposalStateCount';

export default class StudentCount {
  //
  totalStudentCount: number = 0;
  newStudentCount: number = 0;
  passedStudentCount: number = 0;
  waitingCount: WaitingCount = new WaitingCount();
  proposalStateCount: ProposalStateCount = new ProposalStateCount();
  learningStateCount: LearningStateCount = new LearningStateCount();

  constructor(studentCount?: StudentCount) {
    if (studentCount) {
      const waitingCount = new WaitingCount(studentCount.waitingCount);
      const proposalStateCount = new ApprovalCount(studentCount.proposalStateCount);
      const learningStateCount = new LearningStateCount(studentCount.learningStateCount);
      Object.assign(this, { ...studentCount, waitingCount, proposalStateCount, learningStateCount });
    }
  }
}
