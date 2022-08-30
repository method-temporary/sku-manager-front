import DramaEntityObservableModel from './DramaEntityObservableModel';
import {Category} from './Category';
import {decorate, observable} from 'mobx';

export class CardQM extends DramaEntityObservableModel {
  //
  name: string = '';
  category: Category = new Category();
  learningTime: number = 0;
  stampCount: number = 0;
  passedStudentCount: number = 0;
  description: string = '';

  constructor(cardQM?: CardQM) {
    //
    super();
    if(cardQM) {
      Object.assign(this, {...cardQM});
    }
  }
}

decorate(CardQM, {
  name: observable,
  category: observable,
  learningTime: observable,
  stampCount: observable,
  passedStudentCount: observable,
  description: observable,
});
