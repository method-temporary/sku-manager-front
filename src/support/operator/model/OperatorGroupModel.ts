import { decorate, observable } from 'mobx';
import { DramaEntityObservableModel, PolyglotModel } from 'shared/model';

export default class OperatorGroupModel extends DramaEntityObservableModel {
  //
  name: PolyglotModel = new PolyglotModel();
  displayOrder: number = 0;
}

decorate(OperatorGroupModel, {
  name: observable,
  displayOrder: observable,
});
