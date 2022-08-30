import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';
import _ from 'lodash';
import SearchBoxQueryModel from '../model/SearchBoxQueryModel';

@autobind
class SearchBoxService {
  //
  static instance: SearchBoxService;

  @observable
  searchBoxKey: string = '';

  @observable
  searchBoxPrevKey: string = '';

  @observable
  searchBoxQueryModel: any = new SearchBoxQueryModel();

  @observable
  searchBoxQuery: Map<string, SearchBoxQueryModel> = new Map<string, SearchBoxQueryModel>();

  @observable
  searchBoxSearchFn: () => void = () => {};

  @action
  changePropsFn(name: string, value: any) {
    //
    this.searchBoxQueryModel = _.set(this.searchBoxQueryModel, name, value);
  }

  @action
  changeSearchBoxKey(key: string) {
    //
    this.searchBoxKey = key;
  }

  @action
  changeSearchBoxPrevKey(key: string) {
    //
    this.searchBoxPrevKey = key;
  }

  @action
  setSearchBoxQueryModel(key: string, model: any) {
    //
    if (key === '') return;

    if (this.searchBoxQuery.get(key) instanceof SearchBoxQueryModel) {
      this.searchBoxQueryModel = this.searchBoxQuery.get(key);
    } else {
      this.searchBoxQueryModel = { ...model };
      this.searchBoxQuery.set(key, this.searchBoxQueryModel);
    }
  }

  @action
  setSearchBoxQuery(key: string) {
    //
    this.searchBoxQuery.set(key, this.searchBoxQueryModel);
  }

  @action
  setSearchBoxSearchFn(searchFn: () => void) {
    //
    this.searchBoxSearchFn = searchFn;
  }

  @action
  getSearchBoxQueryModelInMap(key: string) {
    //
    return this.searchBoxQuery.get(key);
  }

  @action
  clearSearchBoxQueryModel() {
    //
    this.searchBoxQueryModel = new SearchBoxQueryModel();
  }

  @action
  clearSearchBoxPrevKey() {
    //
    this.searchBoxPrevKey = '';
  }
}

SearchBoxService.instance = new SearchBoxService();
export default SearchBoxService;
