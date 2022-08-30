import moment from 'moment';
import { DataCommunityModel } from './DataCommunityModel';
import { observable } from 'mobx';

class DataCommunityExcelModel {
  //
  '커뮤니티명': string = '';
  회원명: string = '';
  email: string = '';
  회사: string = '';
  부서: string = '';
  닉네임: string = '';

  constructor(community?: DataCommunityModel) {
    //
    if (community) {
      Object.assign(this, {
        email: community.email,
        커뮤니티명: community.title,
        회원명: community.userName,
        회사: community.companyName,
        부서: community.departmentName,
        닉네임: community.nickname,
      });
    }
  }
}

export default DataCommunityExcelModel;
