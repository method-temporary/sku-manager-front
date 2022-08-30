import { decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PageModel, QueryModel } from 'shared/model';
import OperatorRdo from './sdo/OperatorRdo';

export default class OperatorQueryModel extends QueryModel {
  //
  operatorGroupId: string = '';

  name: string = '';
  company: string = '';
  department: string = '';
  email: string = '';

  static asRdo(query: OperatorQueryModel, pageModel: PageModel): OperatorRdo {
    //

    return {
      operatorGroupId: query.operatorGroupId,

      name: query.searchPart === 'name' ? query.searchWord : '',
      company: query.searchPart === 'company' ? query.searchWord : '',
      department: query.searchPart === 'department' ? query.searchWord : '',
      email: query.searchPart === 'email' ? query.searchWord : '',

      offset: pageModel.offset,
      limit: pageModel.limit,
    };
  }
}

decorate(OperatorQueryModel, {
  name: observable,
  company: observable,
  department: observable,
  email: observable,
});
