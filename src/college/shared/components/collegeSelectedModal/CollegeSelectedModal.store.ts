import { action, observable } from 'mobx';
import { ChannelWithAnotherInfo, getInitChannelWithMain } from './model/ChannelWithAnotherInfo';

class CollegeSelectedModalStore {
  //
  static instance: CollegeSelectedModalStore;

  @observable
  selectedMainChannel: ChannelWithAnotherInfo = getInitChannelWithMain();

  @observable
  selectedSubChannels: ChannelWithAnotherInfo[] = [];

  @observable
  selectedCollegeId: string = '';

  @observable
  collegeChannel: ChannelWithAnotherInfo[] = [];

  @action.bound
  setSelectedMainChannel(selectMainChannel: ChannelWithAnotherInfo) {
    this.selectedMainChannel = selectMainChannel;
  }

  @action.bound
  setSelectedSubChannels(selectedCubChannels: ChannelWithAnotherInfo[]) {
    this.selectedSubChannels = selectedCubChannels;
  }

  @action.bound
  setSelectedCollegeId(selectedCollegeId: string) {
    this.selectedCollegeId = selectedCollegeId;
  }

  @action.bound
  setCollegeChannel(collegeChannel: ChannelWithAnotherInfo[]) {
    this.collegeChannel = collegeChannel;
  }

  @action.bound
  reset() {
    this.selectedMainChannel = getInitChannelWithMain();
    this.selectedSubChannels = [];
    this.selectedCollegeId = '';
    this.collegeChannel = [];
  }

  @action.bound
  clearChannel() {
    this.selectedMainChannel = getInitChannelWithMain();
  }
}

CollegeSelectedModalStore.instance = new CollegeSelectedModalStore();
export default CollegeSelectedModalStore;
