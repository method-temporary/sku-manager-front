import WaitingCount from './WaitingCount';
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

  // homeworkWaitingCount: number = 0;
  // testWaitingCount: number = 0;
  // approvalWaitingCount: number = 0;
  // resultWaitingCount: number = 0;
  // approvedCount: number = 0;

  constructor(studentCount?: StudentCount) {
    if (studentCount) {
      const waitingCount = new WaitingCount(studentCount.waitingCount);
      const proposalStateCount = new ProposalStateCount(studentCount.proposalStateCount);
      const learningStateCount = new LearningStateCount(studentCount.learningStateCount);
      Object.assign(this, { ...studentCount, waitingCount, proposalStateCount, learningStateCount });
    }
  }
}
