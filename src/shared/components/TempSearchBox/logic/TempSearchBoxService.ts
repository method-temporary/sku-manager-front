import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';

@autobind
class TempSearchBoxService {
  //
  static instance: TempSearchBoxService;

  @observable
  isSearch: boolean = false;

  @observable
  searchBoxSearchFn: () => void = () => {};

  @observable
  changePropsFn: (name: string, value: any) => void = () => {};

  @action
  setIsSearch(isSearch: boolean) {
    this.isSearch = isSearch;
  }

  @action
  setSearchBoxSearchFn(searchFn: () => void) {
    //
    this.searchBoxSearchFn = searchFn;
  }

  @action
  setChangePropsFn(changeProps: (name: string, value: any) => void) {
    this.changePropsFn = changeProps;
  }
}

TempSearchBoxService.instance = new TempSearchBoxService();
export default TempSearchBoxService;
