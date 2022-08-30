import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Container, Pagination } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import XLSX from 'xlsx';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { Language, getPolyglotToString } from 'shared/components/Polyglot';

import QnaListView from '../view/QnaListView_bak';
import { serviceManagementUrl } from '../../../../Routes';
import PostService from '../../../../cube/board/post/present/logic/PostService';
import CategoryService from '../../../../cube/board/category/present/logic/CategoryService';
import { PostQueryModel } from '../../../../cube/board/post/model/PostQueryModel';
import AlertWinForSearchBox from '../../../../cube/board/board/ui/logic/AlertWinForSearchBox';
import AnswerService from '../../../../cube/board/post/present/logic/AnswerService';
import { PostModel } from '../../../../cube/board/post/model/PostModel';
import { PostListViewXlsxModel } from '../../../../cube/board/post/model/PostListViewXlsxModel';
import { UserWorkspaceService } from '../../../../userworkspace';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  pageIndex: number;
  mode: string;
  alertWinForSearchBoxOpen: boolean;
}

interface Injected {
  postService: PostService;
  userWorkspaceService: UserWorkspaceService;
  categoryService: CategoryService;
  sharedService: SharedService;
  answerService: AnswerService;
}

@inject('postService', 'categoryService', 'sharedService', 'answerService', 'userWorkspaceService')
@observer
@reactAutobind
class QnaListContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      pageIndex: 0,
      mode: 'search',
      alertWinForSearchBoxOpen: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    const { postService } = this.injected;
    postService.clearPostQuery();
  }

  async init() {
    const { postService, categoryService, userWorkspaceService } = this.injected;
    if (postService) {
      //if (this.state.mode === 'default') {
      //  this.findQnasByDefault();
      //} else if (this.state.mode === 'search') {
      this.findQnasBySearch();
      //}
    }

    if (userWorkspaceService.userWorkspaceSelectUsId.length === 0) {
      await userWorkspaceService.findAllUserWorkspacesMap();
    }

    categoryService.findCategoriesByBoardId('QNA');
  }

  routeToCreatePost() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/post/`);
  }

  getCategoryOptions() {
    //
    const { categories } = this.injected.categoryService;
    const list: SelectTypeModel[] = [new SelectTypeModel('All', '전체', 'All')];
    if (categories && categories.length) {
      categories?.forEach((category, index) => {
        list.push(
          new SelectTypeModel(
            String(index + 1),
            getPolyglotToString(category.name, Language.Korean),
            getPolyglotToString(category.name, Language.Korean)
          )
        );
      });
    }
    return list;
  }

  getCompanyOptions() {
    //
    const { userWorkspaceSelectUsId } = this.injected.userWorkspaceService;
    return [new SelectTypeModel('All', '전체', 'All'), ...userWorkspaceSelectUsId];
  }

  handleClickPostRow(postId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/qna-detail/${postId}`
    );
  }

  onChangePostQueryProps(name: string, value: string | number) {
    //
    const { postService } = this.injected;
    postService!.changePostQueryProps(name, value);
  }

  onSearchPostsBySearchBox(page?: number) {
    //
    const { postService } = this.injected;
    const postQueryObject = PostQueryModel.isBlank(postService.postQuery);
    if (postQueryObject === 'success' && postService.postQuery) {
      this.setState({ mode: 'search' });
      this.findQnasBySearch(page);
      return;
    }
    if (postQueryObject !== 'success') {
      this.setState({ alertWinForSearchBoxOpen: true });
    }
  }

  findQnasByDefault(page?: number) {
    const { sharedService, postService } = this.injected;
    let offset = 0;
    const limit = 20;
    if (page) {
      this.setState({ pageIndex: (page - 1) * limit });
      sharedService.setPage('qna', page);
      offset = (page - 1) * limit;
    } else {
      sharedService.setPageMap('qna', 0, limit);
    }

    postService.findQnasByBoardIdAndDefaultPeriod('QNA', offset, limit).then(() => {
      sharedService.setCount('qna', postService.qnas.totalCount);
    });
  }

  async findQnasBySearch(page?: number) {
    const { sharedService, postService, userWorkspaceService } = this.injected;
    const userWorkspaceId = patronInfo.getCineroomId();
    const usid = await userWorkspaceService.getWorkSpaceByCineroomId(userWorkspaceId || '');

    let offset = 0;
    if (page) {
      sharedService.setPage('qna', page);
      offset = (page - 1) * postService.postQuery.limit;
    } else {
      sharedService.setPageMap('qna', 0, postService.postQuery.limit);
    }

    postService.changePostQueryProps('offset', offset);

    postService
      .findQnasForAdminByQuery('QNA', userWorkspaceId !== 'ne1-m2-c2' ? usid.usid : undefined)
      .then(() => {
        if (page) this.setState({ pageIndex: (page - 1) * 20 });
      })
      .then(() => sharedService.setCount('qna', postService.qnas.totalCount));
  }

  handleCloseAlertForSearchBoxWin() {
    //
    this.setState({
      alertWinForSearchBoxOpen: false,
    });
  }

  onClearPostQueryProps() {
    //
    const { postService } = this.injected;
    postService!.clearPostQuery();
  }

  async findAllQnaExcel() {
    const fileName = `qnas.xlsx`;
    //TODO.엑셀 다운로드 api 완료 후 추가 작업 필요
    const { postService } = this.injected;
    await postService!.findAllQnaForExcel().then((qnas: any[]) => {
      const qnaXlsxList: PostListViewXlsxModel[] = [];
      qnas.map((cube, index) => {
        qnaXlsxList.push(PostModel.asXLSX(cube, index));
      });
      const qnaExcel = XLSX.utils.json_to_sheet(qnaXlsxList);
      const temp = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(temp, qnaExcel, 'qnas');
      XLSX.writeFile(temp, fileName, { compression: true });
    });
    return fileName;
  }

  render() {
    //
    const { postService, sharedService } = this.injected;
    const { qnas, postQuery } = postService;
    const result = qnas.results;
    const totalCount = qnas.totalCount;
    const { pageMap } = sharedService;
    const { pageIndex, mode } = this.state;
    const { alertWinForSearchBoxOpen } = this.state;

    return (
      <Container fluid>
        <QnaListView
          findAllQnaExcel={this.findAllQnaExcel}
          postQuery={postQuery}
          onChangePostQueryProps={this.onChangePostQueryProps}
          onClearPostQuery={this.onClearPostQueryProps}
          categoryList={this.getCategoryOptions()}
          result={result}
          totalCount={totalCount}
          routeToCreatePost={this.routeToCreatePost}
          handleClickPostRow={this.handleClickPostRow}
          onSearchPostsBySearchBox={this.onSearchPostsBySearchBox}
          pageIndex={pageIndex}
          state={mode}
          companyOptions={this.getCompanyOptions()}
        />
        {(this.state.mode === 'default' && (
          <div className="center">
            <Pagination
              activePage={pageMap.get('qna') ? pageMap.get('qna').page : 1}
              totalPages={pageMap.get('qna') ? pageMap.get('qna').totalPages : 1}
              onPageChange={(e, data) => this.findQnasByDefault(data.activePage as number)}
            />
          </div>
        )) ||
          (this.state.mode === 'search' && qnas && qnas.results.length !== 0 && (
            <div className="center">
              <Pagination
                activePage={pageMap.get('qna') ? pageMap.get('qna').page : 1}
                totalPages={pageMap.get('qna') ? pageMap.get('qna').totalPages : 1}
                onPageChange={(e, data) => this.findQnasBySearch(data.activePage as number)}
              />
            </div>
          ))}
        <AlertWinForSearchBox handleClose={this.handleCloseAlertForSearchBoxWin} open={alertWinForSearchBoxOpen} />
      </Container>
    );
  }
}

export default withRouter(QnaListContainer);
