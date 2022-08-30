import { ChannelWithAnotherInfo } from '../../../college/shared/components/collegeSelectedModal/model/ChannelWithAnotherInfo';

export interface Category {
  channelId: string;
  collegeId: string;
  twoDepthChannelId: string | null;
  mainCategory: boolean;
}

function fromChannelWithAnotherInfo(channel: ChannelWithAnotherInfo): Category {
  return {
    channelId: channel.id,
    collegeId: channel.collegeId,
    twoDepthChannelId: channel.twoDepthChannelId,
    mainCategory: channel.mainCategory,
  };
}

function initialize(): Category {
  return {
    channelId: '',
    collegeId: '',
    twoDepthChannelId: null,
    mainCategory: false,
  };
}

export const CategoryFunc = { fromChannelWithAnotherInfo, initialize };
