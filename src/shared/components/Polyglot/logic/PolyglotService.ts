import { action, observable } from 'mobx';
import { autobind } from '@nara.platform/accent';
import { Language } from '../model/Language';

@autobind
class PolyglotService {
  //
  static instance: PolyglotService;

  @observable
  activeLanMap: Map<string, Language> = new Map<string, Language>();

  @action
  setActiveLan(key: string, lang: Language) {
    //
    this.activeLanMap.set(key, lang);
  }

  @action
  getActiveLan(key: string) {
    //
    if (this.isKeyInActiveMap(key)) {
      return this.activeLanMap.get(key);
    }

    return null;
  }

  @action
  removeActiveLan(key: string) {
    //
    this.activeLanMap.delete(key);
  }

  private isKeyInActiveMap(key: string) {
    //
    return !!this.activeLanMap.get(key);
  }
}

PolyglotService.instance = new PolyglotService();
export default PolyglotService;
