import { action, decorate, observable } from 'mobx';

export default class StudentDeleteResultModel {
  //
  id: string = '';
  cubeIds: string[] = [];
  removed: boolean = false;
  name: string = '';

  constructor(deleteModel?: StudentDeleteResultModel) {
    //
    if (deleteModel) {
      Object.assign(this, { ...deleteModel });
      this.cubeIds = (deleteModel.cubeIds && deleteModel.cubeIds.length > 0 && deleteModel.cubeIds) || [];
    }
  }

  static addNameModel(deleteModel: StudentDeleteResultModel, name: string): StudentDeleteResultModel {
    const obj = new StudentDeleteResultModel(deleteModel);
    obj.name = name;

    return obj;
  }
}

decorate(StudentDeleteResultModel, {
  cubeIds: observable,
  id: observable,
  removed: observable,
  name: observable,
});
