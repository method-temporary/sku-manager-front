import { action, observable } from 'mobx';
import { ContentProviderContentQdo } from '../../../../_data/cube/contentProviderAdmin/model/ContentProviderContentQdo';

interface ContentProviderContentsParams extends ContentProviderContentQdo {}
interface CpContentsParams {
  urn: string;
}

class LinkedInCourseListModalStore {
  static instance: LinkedInCourseListModalStore;

  @observable
  isOpen: boolean = false;

  @observable
  title: string = '';

  @observable
  urn: string = '';

  @observable
  offset: number = 1;

  @observable
  selectedContentId: string = '';

  @observable
  contentProviderContentsParams: ContentProviderContentsParams = {
    offset: 0,
    limit: 10,
    contentProviderId: '',
    title: '',
  };

  @observable
  cpContentsParams: CpContentsParams = {
    urn: '',
  };

  // actions
  @action.bound
  setIsOpenLinkedInCourseListModal(isOpen: boolean): void {
    this.isOpen = isOpen;
  }

  @action.bound
  setTitle(title: string): void {
    this.title = title;
  }

  @action.bound
  setUrn(urn: string): void {
    this.urn = urn;
  }

  @action.bound
  setOffset(offset: number): void {
    this.offset = offset;
  }

  @action.bound
  setSelectedContentId(contentId: string): void {
    this.selectedContentId = contentId;
  }

  @action.bound
  setContentProviderContentsParams(contentProviderId: string): void {
    this.contentProviderContentsParams = {
      offset: (this.offset - 1) * 10,
      limit: 10,
      contentProviderId,
      title: this.title,
    };
  }

  @action.bound
  setCpContentsParams(urn: string): void {
    this.cpContentsParams = {
      urn,
    };
  }
}

LinkedInCourseListModalStore.instance = new LinkedInCourseListModalStore();
export default LinkedInCourseListModalStore;
