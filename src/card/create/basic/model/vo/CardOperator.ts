import { PolyglotModel } from 'shared/model';

export interface CardOperator {
  id: string;
  email: string;
  name: PolyglotModel;
  companyCode: string;
  companyName: PolyglotModel;
}

export function getInitCardOperator(): CardOperator {
  //
  return {
    id: '',
    email: '',
    name: new PolyglotModel(),
    companyCode: '',
    companyName: new PolyglotModel(),
  };
}
