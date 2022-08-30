import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { reactAutobind, Offset, reactConfirm, ReactComponent } from '@nara.platform/accent';
import { SharedService } from 'shared/present';
import { CommentService } from '../../index';
import { UserService } from '../../../../user';
import { CommentModel } from '../../model/CommentModel';
import { CommentXlsxModel } from '../../model/CommentXlsxModel';
import XLSX from 'xlsx';
import CommentSearchBox from '../view/CommentSearchBox';
import { Pagination, SubActions, Loader } from 'shared/components';
import CommentListView from '../view/CommentListView';
import SearchBoxService from 'shared/components/SearchBox/logic/SearchBoxService';
import { setCommentMemberInfo, setCommentMemberInfoForExcel } from './CommentHelper';
import { MemberService } from '../../../../approval';
import { LoaderService } from 'shared/components/Loader/present/logic/LoaderService';

interface Props extends RouteComponentProps {
  feedbackId: string;
}

interface States {
  pageIndex: number;
  currentPage: number;
}

interface Injected {
  commentService: CommentService;
  userService: UserService;
  sharedService: SharedService;
  searchBoxService: SearchBoxService;
  memberService: MemberService;
  loaderService: LoaderService;
}

@inject('commentService', 'userService', 'sharedService', 'searchBoxService', 'memberService', 'loaderService')
@observer
@reactAutobind
class CommentListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'commentList';

  constructor(props: Props) {
    super(props);
    this.state = {
      pageIndex: 0,
      currentPage: 0,
    };
    this.init();
  }

  componentDidMount(): void {
    //
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const { feedbackId } = this.props;
    const { feedbackId: prevFeedbackId } = prevProps;

    if (feedbackId !== prevFeedbackId) {
      this.init();
    }
  }

  async init() {
    const { commentService, searchBoxService, sharedService } = this.injected;
    const { feedbackId } = this.props;
    commentService!.setCommentOffset('feedbackId', feedbackId);
    searchBoxService.changePropsFn('feedbackId', feedbackId);
    //this.onSetSearchWeek(7);
    this.onSetSearchYear(2);
    // await this.findComments();
  }

  async findComments() {
    const { commentService, userService, sharedService, memberService } = this.injected;
    const { userQuery } = userService!;
    // let offset = 0;
    // if (page) {
    //   sharedService!.setPage('comments', page);
    //   offset = (page - 1) * commentService!.commentOffset.limit;
    //   this.setState({ pageIndex: (page - 1) * 10, currentPage: page });
    // } else {
    //   // pageIndex 초기화
    //   this.setState({ pageIndex: 0, currentPage: 0 });
    //   sharedService!.setPageMap('comments', 0, commentService!.commentOffset.limit);
    // }

    // this.setCommentOffset('offset', offset);
    // this.setCommentOffset('searchPart', skProfileQuery.searchPart);
    // this.setCommentOffset('searchWord', skProfileQuery.searchWord);

    if (userQuery.searchPart && userQuery.searchWord) {
      userService!.onChangeUserQueryProp('datePeriod.startDateSub', null);
      userService!.onChangeUserQueryProp('datePeriod.endDateSub', null);

      // 조회 조건에 skProfileQuery.searchPart, skProfileQuery.searchWord 얘네 둘이 들어가는데
      // findComments 에서 조회할때 조건에 넣어서 요청해야함.
      // 아래 넷중에 하나 아니면 전부 넣어서 있는값만 채우고 나머지 '' 하던지
      // name, email, companyName, departmentName
      // findAllSkProfilesBySearchKey 는 안쓸거야
      // userService!.onChangeSkQueryProfileProp('signed', 'Y'); // true 로 잘못되어 있어서 Y 로 바꿈
      // userService!.onChangeSkQueryProfileProp('offset', 0);
      // userService!.onChangeSkQueryProfileProp('limit', 1000000);
      // const skProfiles = await userService!.findAllSkProfilesBySearchKey();
      // const denizenKeyStrings = skProfiles.results.map(
      //   (skProfile) => skProfile.patronKey.keyString
      // );
      // commentService!.setCommentOffset('denizenKeyStrings', denizenKeyStrings);
    }
    this.injected.loaderService.openLoader(true);

    await commentService!.findComments(sharedService.getPageModel(this.paginationKey));
    await setCommentMemberInfo(commentService.comments.results, commentService, memberService);

    sharedService!.setCount(this.paginationKey, commentService!.comments.totalCount);

    this.injected.loaderService.closeLoader(true);
  }

  async findAllCommentsExcel(): Promise<string> {
    const { commentService, userService, memberService } = this.injected;
    const { userQuery } = userService!;

    this.setCommentOffset('searchPart', userQuery.searchPart);
    this.setCommentOffset('searchWord', userQuery.searchWord);

    if (userQuery.searchPart && userQuery.searchWord) {
      userService!.onChangeUserQueryProp('datePeriod.startDateSub', null);
      userService!.onChangeUserQueryProp('datePeriod.endDateSub', null);

      // 조회 조건에 skProfileQuery.searchPart, skProfileQuery.searchWord 얘네 둘이 들어가는데
      // findComments 에서 조회할때 조건에 넣어서 요청해야함.
      // 아래 넷중에 하나 아니면 전부 넣어서 있는값만 채우고 나머지 '' 하던지
      // name, email, companyName, departmentName
      // findAllSkProfilesBySearchKey 는 안쓸거야
      // userService!.onChangeSkQueryProfileProp('signed', 'Y'); // true 로 잘못되어 있어서 Y 로 바꿈
      // userService!.onChangeSkQueryProfileProp('offset', 0);
      // userService!.onChangeSkQueryProfileProp('limit', 1000000);
      // const skProfiles = await userService!.findAllSkProfilesBySearchKey();
      // const denizenKeyStrings = skProfiles.results.map(
      //   (skProfile) => skProfile.patronKey.keyString
      // );
      // commentService!.setCommentOffset('denizenKeyStrings', denizenKeyStrings);
    }
    const comments = await commentService!.findCommentsForExcel();
    await setCommentMemberInfoForExcel(commentService.commentsForExcel, commentService, memberService);

    const commentXlsxList: CommentXlsxModel[] = [];
    comments.map((comment, index) => {
      commentXlsxList.push(CommentModel.asXLSX(comment, index));
    });
    const commentExcel = XLSX.utils.json_to_sheet(commentXlsxList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, commentExcel, 'Comments');

    const fileName = `comments.xlsx`;
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  setCommentOffset(name: string, value: any) {
    //
    const { commentService } = this.injected;
    commentService!.setCommentOffset(name, value);
  }

  toggleCommentExpanded(commentId: string, expanded: boolean) {
    const { commentService } = this.injected;

    if (commentService) {
      commentService.setCommentsProp(commentId, 'expanded', expanded);
      if (expanded) this.addSubComments(commentId);
    }
  }

  addSubComments(commentId: string) {
    const { commentService } = this.injected;

    if (commentService) {
      const { subCommentOffsetMap } = commentService;
      let subCommentOffset = subCommentOffsetMap.get(commentId);
      if (!subCommentOffset) {
        commentService.initSubCommentOffset(commentId);
        subCommentOffset = subCommentOffsetMap.get(commentId) || ({} as Offset);
      }
      if (subCommentOffset && subCommentOffset.offset !== 0) {
        const offset = subCommentOffset.offset;
        const limit = subCommentOffset.limit;
        commentService.setSubCommentOffset(commentId, 'offset', 0);
        commentService.setSubCommentOffset(commentId, 'limit', offset + limit);
        commentService.findSubComments(commentId, subCommentOffset).then(() => {
          commentService.setSubCommentOffset(commentId, 'offset', offset);
          commentService.setSubCommentOffset(commentId, 'limit', limit);
        });
      } else commentService.findSubComments(commentId, subCommentOffset);
    }
  }

  onAddSubComments(commentId: string) {
    const { commentService } = this.injected;

    if (commentService) {
      const { subCommentOffsetMap } = commentService;
      let subCommentOffset = subCommentOffsetMap.get(commentId);
      if (!subCommentOffset) {
        commentService.initSubCommentOffset(commentId);
        subCommentOffset = subCommentOffsetMap.get(commentId) || ({} as Offset);
      }
      if (subCommentOffset) {
        commentService.setSubCommentOffset(commentId, 'limit', subCommentOffset.limit + subCommentOffset.limit);
        commentService.findSubComments(commentId, commentService.subCommentOffsetMap.get(commentId) || ({} as Offset));
      } else commentService.findSubComments(commentId, subCommentOffset);
    }
  }

  setSkProfileQueryProps(name: string, data: any) {
    //
    const { userService } = this.injected;
    userService!.onChangeUserQueryProp(name, data.value);
  }

  onSetSearchDate(day?: number) {
    //
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    if (day) startDate = startDate.subtract(day, 'd');

    this.setCommentOffset('period.endDateMoment', endDate);
    this.setCommentOffset('period.startDateMoment', startDate);
  }

  onSetSearchWeek(week?: number) {
    //
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    const period = 7;
    let day = 0;
    if (week !== undefined) {
      if (week === 1) {
        day = period - 1;
      } else if (week > 1) {
        day = period * (week - 1) + 6;
      } else {
        day = period * week;
      }
    }

    if (week) startDate = startDate.subtract(day, 'd');

    this.setCommentOffset('period.endDateMoment', endDate);
    this.setCommentOffset('period.startDateMoment', startDate);
  }

  onSetSearchMon(mon?: number) {
    //
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (mon) startDate = startDate.subtract(mon, 'M');

    this.setCommentOffset('period.endDateMoment', endDate);
    this.setCommentOffset('period.startDateMoment', startDate);
  }

  onSetSearchYear(year?: number) {
    //
    const endDate = moment().endOf('day');
    let startDate = moment().startOf('day');
    startDate = startDate.subtract(-1, 'day');
    if (year) startDate = startDate.subtract(year, 'y');

    this.setCommentOffset('period.endDateMoment', endDate);
    this.setCommentOffset('period.startDateMoment', startDate);
  }

  removeComment(commentId: string) {
    const { commentService } = this.injected;

    if (commentService) {
      reactConfirm({
        title: '삭제',
        message: '댓글을 삭제 하시겠습니까?',
        onOk: () => {
          commentService.removeComment(commentId).then(() => this.findComments());
        },
      });
    }
  }

  removeSubComment(commentId: string, subCommentId: string | number) {
    const { commentService } = this.injected;

    if (commentService) {
      reactConfirm({
        title: '삭제',
        message: '댓글을 삭제 하시겠습니까?',
        onOk: () => {
          commentService
            .removeSubComment(commentId, subCommentId)
            .then(() => this.toggleCommentExpanded(commentId, true))
            .then(() => this.addSubComments(commentId));
        },
      });
    }
  }

  render() {
    //
    const { commentService } = this.injected;
    const { commentOffset, comments, subCommentsMap } = commentService!;
    const { results } = comments;
    const { count, offset } = this.injected.sharedService.getPageModel(this.paginationKey);

    return (
      <>
        <CommentSearchBox
          onChangeCommentProp={this.setCommentOffset}
          findComments={this.findComments}
          commentQuery={commentOffset}
          paginationKey={this.paginationKey}
        />
        <SubActions>
          <SubActions.Left>
            <SubActions.Count text="개 댓글 등록" number={count} />
          </SubActions.Left>
          <SubActions.Right>
            <SubActions.ExcelButton download onClick={this.findAllCommentsExcel} />
          </SubActions.Right>
        </SubActions>
        <Pagination name={this.paginationKey} onChange={this.findComments}>
          <Loader>
            <CommentListView
              removeComment={this.removeComment}
              toggleCommentExpanded={this.toggleCommentExpanded}
              removeSubComment={this.removeSubComment}
              onAddSubComments={this.onAddSubComments}
              comments={results}
              subCommentsMap={subCommentsMap}
              startNo={count - offset}
            />
          </Loader>
          <Pagination.Navigator />
        </Pagination>

        {/*<div className="center">*/}
        {/*  <Pagination*/}
        {/*    activePage={pageMap.get('comments') ? pageMap.get('comments').page : 1}*/}
        {/*    totalPages={pageMap.get('comments') ? pageMap.get('comments').totalPages : 1}*/}
        {/*    onPageChange={(e, data) => this.findComments(data.activePage as number)}*/}
        {/*  />*/}
        {/*</div>*/}
      </>
    );
  }
}

export default withRouter(CommentListContainer);
