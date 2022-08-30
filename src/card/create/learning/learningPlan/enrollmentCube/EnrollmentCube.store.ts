import { action, observable } from 'mobx';
import { EnrollmentCubeType } from './model/CubeType';
import { Category, CategoryFunc } from '../../../../../_data/college/model';
import { PolyglotModel } from '../../../../../shared/model';
import { DifficultyLevel } from '../../../../../_data/cube/model/DifficultyLevel';
import { ClassroomSdo, ClassroomSdoFunc } from '../../../../../_data/cube/model/material';
import { InstructorWithOptional } from '../../../../../instructor/instructor/shared/components/instructorModal/model/InstructorWithOptional';
import { MemberViewModel } from '@nara.drama/approval';

class EnrollmentCubeStore {
  static instance: EnrollmentCubeStore;

  @observable
  type: EnrollmentCubeType = 'ELearning';

  @observable
  mainCategory: Category = CategoryFunc.initialize();

  @observable
  sharingCineroomIds: string[] = [];

  @observable
  name: PolyglotModel = new PolyglotModel();

  @observable
  goal: PolyglotModel = new PolyglotModel();

  @observable
  applicants: PolyglotModel = new PolyglotModel();

  @observable
  description: PolyglotModel = new PolyglotModel();

  @observable
  completionTerms: PolyglotModel = new PolyglotModel();

  @observable
  guide: PolyglotModel = new PolyglotModel();

  @observable
  tags: PolyglotModel = new PolyglotModel();

  @observable
  learningTime: number = 0;

  @observable
  difficultyLevel: DifficultyLevel = 'Basic';

  @observable
  organizerId: string = '';

  @observable
  otherOrganizerName: string = '';

  @observable
  instructors: InstructorWithOptional[] = [];

  @observable
  isInstructorNullCheck: boolean = false;

  @observable
  operator: MemberViewModel = new MemberViewModel();

  @observable
  classroomSdos: ClassroomSdo[] = [{ ...ClassroomSdoFunc.initialize() }];
  // classroomSdos: ClassroomSdo[] = [{ ...ClassroomSdoFunc.initialize() }];

  @observable
  isApplyToAllLocation: boolean = true;

  @observable
  isApplyToAllUrl: boolean = true;

  @observable
  isApplyToCharge: boolean = true;

  @action.bound
  setType(type: EnrollmentCubeType) {
    this.type = type;
  }

  @action.bound
  setMainCategory(category: Category) {
    this.mainCategory = category;
  }

  @action.bound
  setSharingCineroomIds(ids: string[]) {
    this.sharingCineroomIds = ids;
  }

  @action.bound
  setName(name: PolyglotModel) {
    this.name = name;
  }

  @action.bound
  setGoal(text: PolyglotModel) {
    this.goal = text;
  }

  @action.bound
  setApplicants(text: PolyglotModel) {
    this.applicants = text;
  }

  @action.bound
  setDescription(text: PolyglotModel) {
    this.description = text;
  }

  @action.bound
  setCompletionTerms(text: PolyglotModel) {
    this.completionTerms = text;
  }

  @action.bound
  setGuide(text: PolyglotModel) {
    this.guide = text;
  }

  @action.bound
  setTags(tags: PolyglotModel) {
    this.tags = tags;
  }

  @action.bound
  setLearningTime(minutes: number) {
    this.learningTime = minutes;
  }

  @action.bound
  setDifficultyLevel(level: DifficultyLevel) {
    this.difficultyLevel = level;
  }

  @action.bound
  setOrganizerId(organizerId: string) {
    this.organizerId = organizerId;
  }

  @action.bound
  setOtherOrganizerName(name: string) {
    this.otherOrganizerName = name;
  }

  @action.bound
  setInstructor(instructors: InstructorWithOptional[]) {
    this.instructors = instructors;
  }

  @action.bound
  setIsInstructorNullCheck(value: boolean) {
    this.isInstructorNullCheck = value;
  }

  @action.bound
  setOperator(operator: MemberViewModel) {
    this.operator = operator;
  }

  @action.bound
  setClassroomSdos(classrooms: ClassroomSdo[]) {
    this.classroomSdos = classrooms;
  }

  @action.bound
  setClassroomSdo(index: number, addClassroom: ClassroomSdo) {
    this.classroomSdos.splice(index, 1, addClassroom);
  }

  @action.bound
  setIsApplyToAllLocation(value: boolean) {
    this.isApplyToAllLocation = value;
  }

  @action.bound
  setIsApplyToAllUrl(value: boolean) {
    this.isApplyToAllUrl = value;
  }

  @action.bound
  setIsApplyToAllCharge(value: boolean) {
    this.isApplyToCharge = value;
  }

  @observable
  createMode: boolean = false;

  @observable
  selectedCubeId: string = '';

  @action.bound
  setCreateMode(value: boolean) {
    this.createMode = value;
  }

  @action.bound
  setSelectedCubeId(cubeId: string) {
    this.selectedCubeId = cubeId;
  }

  @action.bound
  reset() {
    this.type = 'ELearning';
    this.mainCategory = CategoryFunc.initialize();
    this.sharingCineroomIds = [];
    this.name = new PolyglotModel();
    this.goal = new PolyglotModel();
    this.applicants = new PolyglotModel();
    this.description = new PolyglotModel();
    this.completionTerms = new PolyglotModel();
    this.guide = new PolyglotModel();
    this.tags = new PolyglotModel();
    this.learningTime = 0;
    this.difficultyLevel = 'Basic';
    this.organizerId = '';
    this.otherOrganizerName = '';
    this.instructors = [];
    this.isInstructorNullCheck = false;
    this.operator = new MemberViewModel();
    this.classroomSdos = [{ ...ClassroomSdoFunc.initialize() }];
    this.isApplyToAllLocation = true;
    this.isApplyToAllUrl = true;
    this.isApplyToCharge = true;

    this.createMode = false;
    this.selectedCubeId = '';
  }
}

EnrollmentCubeStore.instance = new EnrollmentCubeStore();
export default EnrollmentCubeStore;
