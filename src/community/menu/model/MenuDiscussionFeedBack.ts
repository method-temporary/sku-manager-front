import MenuType from './MenuType';
import { decorate, observable } from 'mobx';

export default class MenuDiscussionFeedBack {
  anonymous: boolean =false;
  deletable: boolean=false;
  embeddedSubComment: boolean=false;
  eventable: boolean=false;
  managerPatronKeys : string[] = [];
  maxCommentCount: number =0;
  maxCommentMessageLength: number=0;
  maxEmbeddedSubCommentCount: number=0;
  maxEmbeddedSubCommentMessageLength: number=0;
  maxSubCommentCount: number=0;
  maxSubCommentMessageLength: number=0;
  privateComment: boolean=false;

}

decorate(MenuDiscussionFeedBack, {
  anonymous:observable,
  deletable: observable,
  embeddedSubComment:observable,
  eventable: observable,
  managerPatronKeys :observable,
  maxCommentCount: observable,
  maxCommentMessageLength: observable,
  maxEmbeddedSubCommentCount: observable,
  maxEmbeddedSubCommentMessageLength: observable,
  maxSubCommentCount: observable,
  maxSubCommentMessageLength: observable,
  privateComment: observable,

});

export function getEmptyMenuDiscussionFeedBack(): MenuDiscussionFeedBack {
  return {
  anonymous: false,
  deletable:false,
  embeddedSubComment: false,
  eventable: false,
  managerPatronKeys : [],
  maxCommentCount:0,
  maxCommentMessageLength: 0,
  maxEmbeddedSubCommentCount: 0,
  maxEmbeddedSubCommentMessageLength: 0,
  maxSubCommentCount: 0,
  maxSubCommentMessageLength: 0,
  privateComment: false,

  }
}


