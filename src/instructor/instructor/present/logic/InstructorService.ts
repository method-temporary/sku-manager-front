import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';

import InstructorApi from '../apiclient/InstructorApi';
import { InstructorQueryModel } from '../../model/InstructorQueryModel';
import { InstructorSdoModel } from '../../model/InstructorSdoModel';
import { InstructorWithUserIdentity } from '../../model/InstructorWithUserIdentity';
import { ObservableArray } from 'mobx/lib/types/observablearray';
import { PageModel } from 'shared/model';
import { InstructorCdoModel } from '../../model/InstructorCdoModel';

@autobind
class InstructorService {
  //
  static instance: InstructorService;

  instructorApi: InstructorApi;

  @observable
  instructorSdo: InstructorSdoModel = new InstructorSdoModel();

  @observable
  instructorSdoForModal: InstructorSdoModel = new InstructorSdoModel();

  @observable
  instructorCdo: InstructorCdoModel = new InstructorCdoModel();

  @observable
  instructor: InstructorWithUserIdentity = new InstructorWithUserIdentity();

  @observable
  selectedInstructors: InstructorWithUserIdentity[] = [];

  @observable
  instructors: InstructorWithUserIdentity[] = [];

  @observable
  instructorsForExcel: InstructorWithUserIdentity[] = [];

  @observable
  instructorQuery: InstructorQueryModel = new InstructorQueryModel();

  constructor(instructorApi: InstructorApi) {
    this.instructorApi = instructorApi;
  }

  // Find Function
  @action
  async findInstructorById(instructorId: string) {
    //
    const instructor = await this.instructorApi.findInstructorsById(instructorId);

    return runInAction(() => (this.instructor = new InstructorWithUserIdentity(instructor)));
  }

  @action
  async findInstructors(pageModel: PageModel): Promise<number> {
    //
    const instructors = await this.instructorApi.findInstructors(
      InstructorSdoModel.asInstructorSdo(this.instructorSdo, pageModel)
    );

    runInAction(() => {
      this.instructors = instructors.results.map((instructor) => new InstructorWithUserIdentity(instructor));
    });

    return instructors.totalCount;
  }

  @action
  async findAllInstructors(pageModel: PageModel, instructorSdo?: InstructorSdoModel) {
    //
    const instructors = await this.instructorApi.findAllInstructors(
      InstructorSdoModel.asInstructorSdoNoDate(instructorSdo || this.instructorSdo, pageModel)
    );

    runInAction(() => {
      this.instructors = instructors.results.map((instructor) => new InstructorWithUserIdentity(instructor));
    });

    return instructors.totalCount;
  }

  @action
  async findInstructorsByIds(ids: string[]): Promise<InstructorWithUserIdentity[]> {
    //
    const instructors = await this.instructorApi.findInstructorsByIds(ids);
    // 중복 제거
    const idsResultArr: InstructorWithUserIdentity[] = [];
    ids &&
      ids.forEach((id) => {
        idsResultArr.push(instructors.filter((item) => id === item.instructor.id)[0]);
      });

    return runInAction(
      () => (this.instructors = idsResultArr.map((instructor) => new InstructorWithUserIdentity(instructor)))
    );
  }

  // 2021-05-27 박종유 email 중복 체크 backend
  @action
  async findInstructorByEmail(value: string) {
    //
    const instructor = await this.instructorApi.findInstructorByEmail(value);

    return runInAction(() => (this.instructor = new InstructorWithUserIdentity(instructor)));
  }

  @action
  async findInstructorExcel() {
    //
    const instructors = await this.instructorApi.findAllInstructorsForExcel(
      InstructorSdoModel.asInstructorSdoExcel(this.instructorSdo)
    );

    return runInAction(
      () =>
        (this.instructorsForExcel = instructors.results.map((instructor) => new InstructorWithUserIdentity(instructor)))
    );
  }

  @action
  changeTargetInstructorProps(index: number, name: string, value: any) {
    //
    this.instructors = _.set(this.instructors, `[${index}].${name}`, value);
  }

  //----------------------------------------------------------------------------

  // Register Function
  @action
  registerInstructor(): Promise<string> {
    //
    return this.instructorApi.registerInstructor(InstructorCdoModel.asInstructorCdo(this.instructorCdo));
  }
  //----------------------------------------------------------------------------

  // Modify Function
  @action
  modifyInstructor(instructorId: string) {
    //
    return this.instructorApi.modifyInstructor(instructorId, InstructorCdoModel.asInstructorCdo(this.instructorCdo));
  }
  //----------------------------------------------------------------------------

  // Remove Function
  @action
  removeInstructor(instructorId: string) {
    //
    return this.instructorApi.removeInstructor(instructorId);
  }
  //----------------------------------------------------------------------------

  // Account Function
  @action
  accountInstructor(instructorId: string, password: string) {
    //
    return this.instructorApi.accountInstructor(instructorId, password);
  }
  //----------------------------------------------------------------------------

  // InstructorSdo Function
  @action
  changeInstructorSdoProp(name: string, value: any) {
    //
    this.instructorSdo = _.set(this.instructorSdo, name, value);
  }
  //----------------------------------------------------------------------------

  // Instructor Function
  @action
  changeInstructorProps(name: string, value: string | boolean | number) {
    //
    this.instructor = _.set(this.instructor, name, value);
  }

  @action
  clearInstructor() {
    //
    this.instructor = new InstructorWithUserIdentity();
  }
  //----------------------------------------------------------------------------

  // InstructorSdoForModal Function
  @action
  changeInstructorSdoForModalProps(name: string, value: string | boolean | number | undefined) {
    //
    this.instructorSdoForModal = _.set(this.instructorSdoForModal, name, value);
  }

  @action
  clearInstructorSdoForModal() {
    //
    this.instructorSdoForModal = new InstructorSdoModel();
  }
  //----------------------------------------------------------------------------

  // InstructorQuery Function
  @action
  changeInstructorQueryProps(name: string, value: string | number) {
    //
    this.instructorQuery = _.set(this.instructorQuery, name, value);
  }

  @action
  clearInstructorQuery() {
    //
    this.instructorQuery = new InstructorQueryModel();
  }
  //----------------------------------------------------------------------------

  // SelectedInstructors Function
  @action
  appendSelectedInstructor(selectedInstructor: InstructorWithUserIdentity) {
    //
    this.selectedInstructors.push(selectedInstructor);
  }

  @action
  setSelectedInstructors(selectedInstructors: InstructorWithUserIdentity[]) {
    //
    this.selectedInstructors = selectedInstructors;
  }

  @action
  removeSelectedInstructor(id: String) {
    //
    const selectedInstructor = this.selectedInstructors.find((c) => c.instructor.id === id);
    if (selectedInstructor !== undefined) {
      (this.selectedInstructors as unknown as ObservableArray<InstructorWithUserIdentity>).remove(selectedInstructor);
    }
  }
  //----------------------------------------------------------------------------

  // InstructorCdo Function
  @action
  setInstructorCdo(instructorCdo: InstructorCdoModel) {
    //
    this.instructorCdo = new InstructorCdoModel(instructorCdo);
  }

  @action
  changeInstructorCdoProps(name: string, value: any) {
    //
    this.instructorCdo = _.set(this.instructorCdo, name, value);
  }

  @action
  clearInstructorCdo() {
    //
    this.instructorCdo = new InstructorCdoModel();
  }
  //----------------------------------------------------------------------------
}

InstructorService.instance = new InstructorService(InstructorApi.instance);
export default InstructorService;
