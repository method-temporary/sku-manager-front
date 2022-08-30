import { DataCardMappingListModel } from './DataCardMappingListModel';

class DataCardMappingListExcelModel {
  'Card ID': string = '';
  'Card 명': string = '';
  'Card College': string = '';
  'Card Channel(1depth)': string = '';
  'Card Channel(2depth)': string = '';
  'Card 유형': string = '';
  '카드 공개 여부': string = '';
  'Mapping Cube Count': number = 0;
  '정렬순서': string = '';
  'Cube ID': string = '';
  'Cube Name': string = '';
  'Cube 유형': string = '';
  'Cube Main College': string = '';
  'Cube Main Channel(1depth)': string = '';
  'Cube Main Channel(2depth)': string = '';
  'Cube Sub Category': string = '';
  'Mapping Card Count': number = 0;
  
  constructor(model?: DataCardMappingListModel) {
    if (model) {
      Object.assign(this, {
        'Card ID': model.cardId,
        'Card 명': model.cardName,
        'Card 유형': model.cardType,
        'Card College': model.cardCollegeName,
        'Card Channel(1depth)': model.cardChannelName,
        'Card Channel(2depth)': model.cardTwoDepthChannelName,
        '카드 공개 여부': model.cardSearchable,
        'Mapping Cube Count': model.mappingCubeCount,
        '정렬순서': model.listOrder,
        'Cube ID': model.cubeId,
        'Cube Name': model.cubeName,
        'Cube 유형': model.cubeType,
        'Cube Main College': model.cubeCollegeName,
        'Cube Main Channel(1depth)': model.cubeChannelName,
        'Cube Main Channel(2depth)': model.cubeTwoDepthChannelName,
        'Cube Sub Category': model.subCubeCategory,
        'Mapping Card Count': model.mappingCardCount,
      });
    }
  }
}

export default DataCardMappingListExcelModel;
