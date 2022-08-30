import { decorate, observable } from 'mobx';

export class InstructorQueryModel {
  offset: number = 0;
  limit: number = 10;
  name: string = '';
  internal: string = '';
}

decorate(InstructorQueryModel, {
  offset: observable,
  limit: observable,
  name: observable,
  internal: observable,
});
