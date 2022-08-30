import { observable, action, computed } from 'mobx';
import Home, { getEmptyHome } from '../model/Home';
import HomeType from '../model/HomeType';

class HomeStore {
  static instance: HomeStore;

  constructor() {
    this.select = this.select.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeIntroduce = this.changeIntroduce.bind(this);
    this.changeThumbnailId = this.changeThumbnailId.bind(this);
    this.changeHtml = this.changeHtml.bind(this);
    this.pushNameValue = this.pushNameValue.bind(this);
  }

  @observable
  innerSelected: Home = getEmptyHome();

  @action
  select(next: Home) {
    this.innerSelected = next;
  }

  @computed
  get selected() {
    return this.innerSelected;
  }

  @action
  changeType(next: HomeType) {
    this.innerSelected.type = next;
    this.pushNameValue('type', next)
  }

  @action
  changeIntroduce(next: string) {
    this.innerSelected.introduce = next;
    this.pushNameValue('introduce', next)
  }

  @action
  changeThumbnailId(next: string) {
    this.innerSelected.thumbnailId = next;
    this.pushNameValue('thumbnailId', next)
  }

  @action
  changeHtml(next: string) {
    this.innerSelected.html = next;
    this.pushNameValue('html', next)
  }

  @action
  changeColor(next: string) {
    this.innerSelected.color = next;
    this.pushNameValue('color', next)
  }

  nameValueMap: Map<string, string> = new Map();

  pushNameValue(name: string, value: string) {
    if (this.innerSelected.id !== undefined) {
      this.nameValueMap.set(name, value);
    }
  }
}

HomeStore.instance = new HomeStore();

export default HomeStore;