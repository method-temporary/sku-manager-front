import { action, observable, runInAction } from 'mobx';
import autobind from 'autobind-decorator';
import _ from 'lodash';
import { Moment } from 'moment';
import ClassroomGroupFlowApi from '../apiclient/ClassroomGroupFlowApi';
import ClassroomGroupApi from '../apiclient/ClassroomGroupApi';
import { ClassroomGroupModel } from '../../model/sdo/ClassroomGroupModel';
import { ClassroomModel as CubeClassRoom } from 'cube/classroom';

@autobind
export default class ClassroomGroupService {
  //
  static instance: ClassroomGroupService;

  classroomGroupApi: ClassroomGroupApi;
  classroomGroupFlowApi: ClassroomGroupFlowApi;

  @observable
  classroom: CubeClassRoom = new CubeClassRoom();

  @observable
  classrooms: CubeClassRoom[] = [];

  @observable
  cubeClassrooms: CubeClassRoom[] = [new CubeClassRoom()];

  @observable
  cubeClassroom: CubeClassRoom = new CubeClassRoom();

  @observable
  classroomGroup: ClassroomGroupModel = new ClassroomGroupModel();

  constructor(classroomApi: ClassroomGroupApi, classroomGroupFlowApi: ClassroomGroupFlowApi) {
    this.classroomGroupApi = classroomApi;
    this.classroomGroupFlowApi = classroomGroupFlowApi;
  }

  @action
  async findClassroom(classroomId: string) {
    //
    const classroom = await this.classroomGroupApi.findClassroom(classroomId);
    return runInAction(() => (this.classroom = new CubeClassRoom(classroom)));
  }

  @action
  async findClassrooms(classroomIds: string[]) {
    //
    const classrooms = await this.classroomGroupApi.findClassrooms(classroomIds);
    return runInAction(() => (this.classrooms = classrooms.results.map((classroom) => new CubeClassRoom(classroom))));
  }

  @action
  async findClassroomGroup(classroomGroupId: string) {
    //
    const classroomGroup = await this.classroomGroupApi.findClassroomGroup(classroomGroupId);
    return runInAction(() => (this.classroomGroup = new ClassroomGroupModel(classroomGroup)));
  }

  @action
  clearClassroom() {
    //
    this.classroom = new CubeClassRoom();
  }

  @action
  clearClassroomGroup() {
    //
    this.classroomGroup = new ClassroomGroupModel();
  }

  @action
  addClassroom() {
    //
    const addedClassroom = new CubeClassRoom();
    addedClassroom.round = this.classroomGroup.classroomCdos.length + 1;
    this.classroomGroup = _.set(
      this.classroomGroup,
      'classroomCdos',
      [...this.classroomGroup.classroomCdos].concat([addedClassroom])
    );
  }

  @action
  findAndAddClassroom(classroom: CubeClassRoom) {
    //
    this.classroomGroup = _.set(
      this.classroomGroup,
      'classroomCdos',
      [...this.classroomGroup.classroomCdos].concat([classroom])
    );
  }

  @action
  setClassroomCdos(classrooms: CubeClassRoom[]) {
    classrooms.sort(this.compare);
    this.classroomGroup = _.set(this.classroomGroup, 'classroomCdos', classrooms);
    return this.classroomGroup.classroomCdos;
  }

  compare(classroom1: CubeClassRoom, classroom2: CubeClassRoom) {
    if (classroom1.round > classroom2.round) return 1;
    return -1;
  }

  @action
  changeClassroomCdoProps(index: number, name: string, value: any) {
    //
    this.classroomGroup = _.set(this.classroomGroup, `classroomCdos[${index}].${name}`, value);
  }

  @action
  changeClassroomCdoPeriodProps(index: number, name: string, value: Moment) {
    //
    const stringDate = value.format('YYYY-MM-DD');
    this.classroomGroup = _.set(this.classroomGroup, `classroomCdos[${index}].${name}`, value);
    this.classroomGroup = _.set(
      this.classroomGroup,
      `classroomCdos[${index}].${name.replace('Moment', '')}`,
      stringDate
    );
  }

  @action
  changeClassroomProps(name: string, value: string | number) {
    //
    this.classroom = _.set(this.classroom, name, value);
  }

  @action
  removeClassroom(index: number) {
    const classroomCdos = this.classroomGroup.classroomCdos
      .slice(0, index)
      .concat(this.classroomGroup.classroomCdos.slice(1 + index));
    this.classroomGroup = _.set(this.classroomGroup, 'classroomCdos', classroomCdos);
  }

  //// for Cube ClassRooms
  @action
  setCubeClassrooms(classRooms: CubeClassRoom[]): void {
    this.cubeClassrooms = classRooms;
  }

  @action
  setCubeClassroom(classRoom: CubeClassRoom): void {
    this.cubeClassroom = classRoom;
  }

  @action
  addCubeClassrooms(classroom: CubeClassRoom): void {
    this.cubeClassrooms = [...this.cubeClassrooms, classroom];
  }

  @action
  changeTargetCubeClassroomProps(index: number, name: string, value: any): void {
    this.cubeClassrooms = _.set(this.cubeClassrooms, `[${index}].${name}`, value);
  }

  @action
  changeCubeClassroomProps(name: string, value: string | number) {
    //
    this.cubeClassroom = _.set(this.cubeClassroom, name, value);
  }

  @action
  removeTargetCubeClassroom(index: number): void {
    this.cubeClassrooms.splice(index, 1);
  }

  @action
  clearCubeClassrooms(): void {
    this.cubeClassrooms = [new CubeClassRoom()];
  }

  @action
  clearCubeClassroom(): void {
    this.cubeClassroom = new CubeClassRoom();
  }
}

Object.defineProperty(ClassroomGroupService, 'instance', {
  value: new ClassroomGroupService(ClassroomGroupApi.instance, ClassroomGroupFlowApi.instance),
  writable: false,
  configurable: false,
});
