import DataMetaBadgeModel from './DataMetaBadgeModel';

class DataMetaBadgeExcelModel {
  BadgeID: string = '';
  Badge명: string = '';
  정렬순서: number = 0;
  레벨: string = '';
  생성일: string = '';
  CardID: string = '';
  Card명: string = '';
  CollegeId: string = '';
  CollegeName: string = '';
  ChannelId: string = '';
  ChannelName: string = '';
  twoDepthChannelID: string = '';
  twoDepthChannelName: string = '';

  constructor(model?: DataMetaBadgeModel) {
    if (model) {
      Object.assign(this, {
        BadgeID: model.badgeId,
        Badge명: model.badgeName,
        정렬순서: model.order,
        레벨: model.level,
        생성일: model.createdTime,
        CardID: model.cardId,
        Card명: model.cardName,
        CollegeId: model.collegeId,
        CollegeName: model.collegeName,
        ChannelId: model.channelId,
        ChannelName: model.channelName,
        twoDepthChannelID: model.twoDepthChannelId,
        twoDepthChannelName: model.twoDepthChannelName,
      });
    }
  }
}

export default DataMetaBadgeExcelModel;
