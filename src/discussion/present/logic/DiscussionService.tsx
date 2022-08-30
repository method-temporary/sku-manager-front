import { autobind } from '@nara.platform/accent';
import { action, observable, runInAction } from 'mobx';
import _ from 'lodash';

import Discussion from '../../model/Discussion';
import DiscussionApi from '../apiclient/discussionApi';

@autobind
class DiscussionService {
  //
  static instance: DiscussionService;

  discussionApi: DiscussionApi;

  @observable
  discussion: Discussion = new Discussion();

  @observable
  discussions: Discussion[] = [];

  constructor(discussionApi: DiscussionApi) {
    //
    this.discussionApi = discussionApi;
  }

  @action
  async findDiscussion(feedbackId: string) {
    //
    const discussion = await this.discussionApi.findDiscussion(feedbackId);

    runInAction(() => {
      this.discussion = new Discussion(discussion);
    });

    return discussion;
  }

  @action
  registerDiscussion(discussion?: Discussion): Promise<string> {
    //
    return this.discussionApi.registerDiscussion(discussion ? discussion : this.discussion);
  }

  @action
  modifyDiscussion(feedbackId: string, discussion?: Discussion) {
    //
    return this.discussionApi.modifyDiscussion(feedbackId, discussion ? discussion : this.discussion);
  }

  @action
  setDiscussion(discussion: Discussion) {
    //
    this.discussion = { ...discussion };
  }

  @action
  changeDiscussionProp(name: string, value: any) {
    //
    this.discussion = _.set(this.discussion, name, value);
  }

  @action
  clearDiscussion() {
    //
    this.discussion = new Discussion();
  }
}

DiscussionService.instance = new DiscussionService(DiscussionApi.instance);
export default DiscussionService;
