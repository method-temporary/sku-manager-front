import { autobind } from '@nara.platform/accent';
import { action, observable } from 'mobx';

@autobind
export class LoaderService {
  //
  static instance: LoaderService;

  @observable
  active: boolean = false;

  @observable
  multiLoader: boolean = false;

  @observable
  pageLoader: boolean = false;

  @observable
  loaderNames: string[] = [];

  @observable
  closeLoaderName: string = '';

  @action
  openLoader(multiLoader?: boolean) {
    //
    if (multiLoader) {
      this.multiLoader = true;
    }

    this.active = true;
  }

  @action
  openPageLoader(multiLoader?: boolean) {
    //
    if (multiLoader) {
      this.multiLoader = true;
    }

    this.active = true;
    this.pageLoader = true;
  }

  @action
  closeLoader(multiLoader?: boolean, name?: string) {
    //
    if (name) {
      this.closeLoaderName = name;

      this.removeLoaderNames(name);

      if (name === 'ALL') {
        this.loaderNames = [];
      }
    } else {
      this.closeLoaderName = '';
    }

    // Multi Loader 이고 Multi Loader 종료일 경우
    if (this.multiLoader && multiLoader) {
      this.multiLoader = false;
      this.active = false;
      this.pageLoader = false;
    } else if (!this.multiLoader || multiLoader) {
      // Multi Loader 가 아니거나, Multi Loader 가 아닌데 Multi 종료 하라고 들어 왔을 경우
      this.active = false;
      this.pageLoader = false;
    }
  }

  @action
  async loadingCallback(fn: () => Promise<any>): Promise<void> {
    //
    this.openPageLoader();
    await fn();
    this.closeLoader();
  }

  @action
  async excelDownloadloadingCallback(fn: () => Promise<any>, handleDownloadHistory: Function): Promise<void> {
    //
    this.openPageLoader();
    const fileName = await fn();
    handleDownloadHistory(fileName);
    this.closeLoader();
  }

  @action
  addLoaderNames(name: string) {
    //
    if (!this.loaderNames.includes(name)) {
      this.loaderNames.push(name);
    }
  }

  @action
  removeLoaderNames(name: string) {
    //
    this.loaderNames = this.loaderNames.filter((loaderName) => loaderName !== name);
  }
}

LoaderService.instance = new LoaderService();
export default LoaderService;
