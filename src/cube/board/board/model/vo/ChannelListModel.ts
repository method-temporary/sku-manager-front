export class ChannelListModel {
  //
  id: string = '';
  name: string = '';
  description: string = '';
  open: boolean = true;

  constructor(channelList?: ChannelListModel) {
    //
    if (channelList) {
      Object.assign(this, { ...channelList });
    }
  }
}
