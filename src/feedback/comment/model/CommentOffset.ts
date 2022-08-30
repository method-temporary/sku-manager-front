import { decorate, observable } from 'mobx';
import { Offset } from '@nara.platform/accent';
import { NewDatePeriod, PageModel } from 'shared/model';
import { CommentRdo } from './CommentRdo';

export class CommentOffset implements Offset {
  //
  offset: number = 0;
  limit: number = 10;
  feedbackId: string = '';
  denizenKeyStrings: string[] = [];
  period: NewDatePeriod = new NewDatePeriod();
  name: string = '';
  email: string = '';
  companyName: string = '';
  departmentName: string = '';
  searchPart: string = '전체';
  searchWord: string = '';

  static asCommentRdo(commentOffset: CommentOffset, pageModel: PageModel): CommentRdo {
    let companyName = '';
    let departmentName = '';
    let name = '';
    let email = '';
    if (commentOffset.searchPart === '소속사') {
      companyName = commentOffset.searchPart;
    }
    if (commentOffset.searchPart === '소속 조직(팀)') {
      departmentName = commentOffset.searchPart;
    }
    if (commentOffset.searchPart === '성명') {
      name = commentOffset.searchPart;
    }
    if (commentOffset.searchPart === 'E-mail') {
      email = commentOffset.searchPart;
    }

    // console.log('commentOffset:', commentOffset);

    return {
      startDate: commentOffset.period.startDateLong,
      endDate: commentOffset.period.endDateLong,
      feedbackId: commentOffset.feedbackId,
      denizenKeyStrings: commentOffset.denizenKeyStrings,
      offset: pageModel.offset,
      limit: pageModel.limit,
      name: name !== '' ? commentOffset.searchWord : commentOffset.name,
      email: email !== '' ? commentOffset.searchWord : commentOffset.email,
      companyName: companyName !== '' ? commentOffset.searchWord : commentOffset.companyName,
      departmentName: departmentName !== '' ? commentOffset.searchWord : commentOffset.departmentName,
    };
  }
}

decorate(CommentOffset, {
  offset: observable,
  limit: observable,
  denizenKeyStrings: observable,
  period: observable,
  name: observable,
  email: observable,
  companyName: observable,
  departmentName: observable,
});
