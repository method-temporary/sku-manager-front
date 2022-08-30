import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';

import { SearchBoxExampleQueryModel } from '../model/SearchBoxExampleQueryModel';

@autobind
class SearchBoxExampleService {
  //
  static instance: SearchBoxExampleService;

  @observable
  searchBoxExampleQueryModel: SearchBoxExampleQueryModel = new SearchBoxExampleQueryModel();

  @action
  changeSearchBoxExampleQueryModelProp(name: string, value: any) {
    //
    this.searchBoxExampleQueryModel = _.set(this.searchBoxExampleQueryModel, name, value);
  }
}

SearchBoxExampleService.instance = new SearchBoxExampleService();
export default SearchBoxExampleService;
