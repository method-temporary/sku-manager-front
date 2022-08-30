import { Channel, getInitChannel } from '_data/college/model';

export interface ChannelWithAnotherInfo extends Channel {
  //
  mainCategory: boolean;
  twoDepthChannelId: string | null;
}

export function getInitChannelWithMain(): ChannelWithAnotherInfo {
  //
  return {
    //
    ...getInitChannel(),
    mainCategory: false,
    twoDepthChannelId: '',
  };
}
