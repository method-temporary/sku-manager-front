import { action, observable } from 'mobx';
import { DatePeriod, DatePeriodFunc, DEFAULT_DATE_FORMAT } from '../../../_data/shared';
import dayjs from 'dayjs';
import { InstructorWithOptional } from '../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import { YesNo } from '../../../shared/model';
import { checkAndChangeRoundDateValidation } from './Learning.util';
import { EnrollmentCardWithOptional, getInitEnrollmentCardWithOptional } from './model/EnrollmentCardWithOptional';
import { StudentEnrollmentType } from '../../../_data/lecture/cards/model/vo/StudentEnrollmentType';

class LearningStore {
  static instance: LearningStore;

  // 과정 기간 정보
  @observable
  studentEnrollmentType: StudentEnrollmentType = 'Anyone'; // Card 유형

  @observable
  enrollingAvailable: YesNo = 'No'; // 수강신청 유무

  @observable
  restrictLearningPeriod: boolean = false; // 교육기간 일정제한

  @observable
  learningPeriod: DatePeriod = DatePeriodFunc.initialize();

  @observable
  validLearningDateCheck: boolean = false; // 참여 기간 설정

  @observable
  validLearningDate: number = 0;

  @action.bound
  setStudentEnrollmentType(studentEnrollmentType: StudentEnrollmentType) {
    this.studentEnrollmentType = studentEnrollmentType;
  }

  @action.bound
  setEnrollingAvailable(enrollingAvailable: YesNo) {
    this.enrollingAvailable = enrollingAvailable;
  }

  @action.bound
  setRestrictLearningPeriod(restrictLearningPeriod: boolean) {
    this.restrictLearningPeriod = restrictLearningPeriod;
  }

  @action.bound
  setLearningPeriod(period: DatePeriod) {
    this.learningPeriod = period;
  }

  @action.bound
  setValidLearningDateCheck(value: boolean) {
    this.validLearningDateCheck = value;
  }

  @action.bound
  setValidLearningDate(date: number) {
    this.validLearningDate = date;
  }

  // 차수 운영 정보
  @observable
  approvalProcess: YesNo = 'No';

  @observable
  sendingMail: YesNo = 'No';

  @observable
  cancellationPenalty: string = '';

  @observable
  enrollmentCards: EnrollmentCardWithOptional[] = [] as EnrollmentCardWithOptional[];

  @action.bound
  setApprovalProcess(approvalProcess: YesNo) {
    this.approvalProcess = approvalProcess;
  }

  @action.bound
  setSendingMail(sendingMail: YesNo) {
    this.sendingMail = sendingMail;
  }

  @action.bound
  setCancellationPenalty(value: string) {
    this.cancellationPenalty = value;
  }

  @action.bound
  setEnrollmentCards(enrollmentCards: EnrollmentCardWithOptional[]) {
    this.enrollmentCards = enrollmentCards;
  }

  @action.bound
  onChangeEnrollmentCardDate = (enrollmentCard: EnrollmentCardWithOptional, date: Date, type: string) => {
    //
    const next = { ...enrollmentCard };

    if (type === 'applyingPeriod.startDate') {
      //
      next.applyingPeriod.startDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
      next.cancellablePeriod.startDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    } else if (type === 'applyingPeriod.endDate') {
      //
      next.applyingPeriod.endDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
      next.cancellablePeriod.endDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    } else if (type === 'cancellablePeriod.startDate') {
      //
      next.cancellablePeriod.startDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    } else if (type === 'cancellablePeriod.endDate') {
      //
      next.cancellablePeriod.endDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    } else if (type === 'learningPeriod.startDate') {
      //
      next.learningPeriod.startDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    } else if (type === 'learningPeriod.endDate') {
      //
      next.learningPeriod.endDate = dayjs(date).format(DEFAULT_DATE_FORMAT);
    }

    checkAndChangeRoundDateValidation(next);
  };

  // Chapter / Cube / Talk List 정보
  @observable
  sequentialStudyRequired: boolean = false;

  @observable
  instructors: InstructorWithOptional[] = [];

  @observable
  totalLearningTime: number = 0;

  @observable
  additionalLearningTime: number = 0;

  @action.bound
  setSequentialStudyRequired(value: boolean) {
    this.sequentialStudyRequired = value;
  }

  @action.bound
  setInstructors(instructors: InstructorWithOptional[]) {
    this.instructors = instructors;
  }

  @action.bound
  setTotalLearningTime(learningTime: number) {
    this.totalLearningTime = learningTime;
  }

  @action.bound
  setAdditionalLearningTime(time: number) {
    this.additionalLearningTime = time;
  }

  @action.bound
  reset() {
    this.studentEnrollmentType = 'Anyone';
    this.restrictLearningPeriod = false;
    this.learningPeriod = {
      startDate: dayjs().add(1, 'day').format(DEFAULT_DATE_FORMAT),
      endDate: dayjs().add(1, 'day').add(1, 'month').format(DEFAULT_DATE_FORMAT),
    };

    this.validLearningDateCheck = false;
    this.validLearningDate = 0;
    this.approvalProcess = 'No';
    this.sendingMail = 'No';
    this.cancellationPenalty = '';
    this.enrollmentCards = [getInitEnrollmentCardWithOptional()];

    this.instructors = [];
    this.totalLearningTime = 0;
    this.additionalLearningTime = 0;
  }
}

LearningStore.instance = new LearningStore();
export default LearningStore;
