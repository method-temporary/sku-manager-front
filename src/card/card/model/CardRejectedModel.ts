import { decorate, observable } from 'mobx';
import { NameValueList } from 'shared/model';

export class CardRejectedModel {
  //
  id: string = '';
  remark: string = '';

  static asNameValues(remark: string): NameValueList {
    const asNameValues = {
      nameValues: [
        {
          name: 'remark',
          value: remark,
        },
      ],
    };

    return asNameValues;
  }
}

decorate(CardRejectedModel, {
  id: observable,
  remark: observable,
});
