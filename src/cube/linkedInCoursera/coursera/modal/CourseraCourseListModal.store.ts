import { action, observable } from 'mobx';
import { ContentProviderContentQdo } from '../../../../_data/cube/contentProviderAdmin/model/ContentProviderContentQdo';

interface SearchBoxParams extends ContentProviderContentQdo {}

class CourseraCourseListModalStore {
  static instance: CourseraCourseListModalStore;

  @observable
  isOpen: boolean = false;

  @observable
  title: string = '';

  @observable
  offset: number = 1;

  @observable
  params: SearchBoxParams = {
    offset: 0,
    limit: 10,
    contentProviderId: '',
    title: '',
  };

  @observable
  selectedContentId: string = '';

  // actions
  @action.bound
  setIsOpenCourseraCourseListModal(isOpen: boolean): void {
    this.isOpen = isOpen;
  }

  @action.bound
  setTitle(title: string): void {
    this.title = title;
  }

  @action.bound
  setOffset(offset: number): void {
    this.offset = offset;
  }

  @action.bound
  setParams(contentProviderId: string): void {
    this.params = {
      offset: (this.offset - 1) * 10,
      limit: 10,
      contentProviderId,
      title: this.title,
    };
  }

  @action.bound
  setSelectedContentId(contentId: string): void {
    this.selectedContentId = contentId;
  }
}

CourseraCourseListModalStore.instance = new CourseraCourseListModalStore();
export default CourseraCourseListModalStore;
