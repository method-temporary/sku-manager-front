import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Container, Pagination } from 'semantic-ui-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Moment } from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { Language, getPolyglotToString } from 'shared/components/Polyglot';

import { serviceManagementUrl } from '../../../../Routes';
import PostService from '../../../../cube/board/post/present/logic/PostService';
import { PostQueryModel } from '../../../../cube/board/post/model/PostQueryModel';
import AlertWinForSearchBox from '../../../../cube/board/board/ui/logic/AlertWinForSearchBox';
import { CategoryService } from '../../../category';
import { SupportType } from '../../../category/model/vo/SupportType';
import FaqListView from '../view/FaqListView';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  pageIndex: number;
  mode: string;
  alertWinForSearchBoxOpen: boolean;
}

interface Injected {
  postService: PostService;
  categoryService: CategoryService;
  sharedService: SharedService;
}

@inject('postService', 'categoryService', 'sharedService')
@observer
@reactAutobind
class FaqListContainer extends ReactComponent<Props, States, Injected> {
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
    if (postService === undefined) {
      return;
    }
    postService.clearPostQuery();
  }

  init() {
    const { postService, categoryService } = this.injected;
    if (this.state.mode === 'default') {
      this.findFaqsByDefault();
    } else if (this.state.mode === 'search') {
      this.findFaqsBySearch();
    }

    categoryService.findPrevAll(SupportType.FAQ);
  }

  routeToCreatePost() {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/supports/faq-create/`
    );
  }

  handleClickPostRow(postId: string) {
    //ss
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/supports/faq-detail/${postId}`
    );
  }

  addCategoryList() {
    //
    const { categories } = this.injected.categoryService || ({} as CategoryService);
    const list: any = [{ key: 0, text: '전체', value: 'All' }];

    if (categories) {
      if (categories && categories.length) {
        categories.forEach((category, index) => {
          list.push({
            key: index + 1,
            text: getPolyglotToString(category.name, Language.Korean),
            value: getPolyglotToString(category.name, Language.Korean),
          });
        });
      }
    }
    return list;
  }

  onChangePostQueryProps(name: string, value: string | Moment | number) {
    //
    const { postService } = this.injected;
    postService!.changePostQueryProps(name, value);
  }

  onClearPostQueryProps() {
    //
    const { postService } = this.injected;
    postService!.clearPostQuery();
  }

  onSearchPostsBySearchBox(page?: number) {
    //
    const { postService } = this.injected;
    if (postService) {
      const postQueryObject = PostQueryModel.isBlank(postService.postQuery);
      if (postQueryObject === 'success') {
        this.setState({ mode: 'search' });
        this.findFaqsBySearch(page);
        return;
      }
      if (postQueryObject !== 'success') {
        this.setState({ alertWinForSearchBoxOpen: true });
      }
    }
  }

  findFaqsByDefault(page?: number) {
    const { sharedService, postService } = this.injected;
    if (sharedService && postService) {
      let offset = 0;
      const limit = 20;
      if (page) {
        this.setState({ pageIndex: (page - 1) * limit });
        sharedService.setPage('faq', page);
        offset = (page - 1) * limit;
      } else {
        sharedService.setPageMap('faq', 0, limit);
      }

      postService.findFaqsByBoardIdAndDefaultPeriod('FAQ', offset, limit).then(() => {
        sharedService.setCount('faq', postService.faqs.totalCount);
      });
    }
  }

  findFaqsBySearch(page?: number) {
    const { sharedService, postService } = this.injected;
    if (sharedService && postService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('faq', page);
        offset = (page - 1) * postService.postQuery.limit;
      } else {
        sharedService.setPageMap('faq', 0, postService.postQuery.limit);
      }

      postService.changePostQueryProps('offset', offset);

      postService
        .findFaqsForAdminByQuery('FAQ')
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * 20 });
        })
        .then(() => sharedService.setCount('faq', postService.faqs.totalCount));
    }
  }

  handleCloseAlertForSearchBoxWin() {
    //
    this.setState({
      alertWinForSearchBoxOpen: false,
    });
  }

  changeDateToString(date: Date) {
    //
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('.');
  }

  getPinnedName(pinned: boolean) {
    //
    if (pinned) {
      return '주요';
    }
    return '일반';
  }

  render() {
    const { faqs, postQuery } = this.injected.postService!;
    const result = faqs.results;
    const totalCount = faqs.totalCount;
    const { pageMap } = this.injected.sharedService!;
    const { pageIndex, mode, alertWinForSearchBoxOpen } = this.state;

    return (
      <Container fluid>
        <FaqListView
          postQuery={postQuery}
          onChangePostQueryProps={this.onChangePostQueryProps}
          addCategoryList={this.addCategoryList}
          findPostsBySearch={this.findFaqsBySearch}
          onClearPostQuery={this.onClearPostQueryProps}
          result={result}
          totalCount={totalCount}
          routeToCreatePost={this.routeToCreatePost}
          handleClickPostRow={this.handleClickPostRow}
          onSearchPostsBySearchBox={this.onSearchPostsBySearchBox}
          pageIndex={pageIndex}
          state={mode}
          changeDateToString={this.changeDateToString}
          getPinnedName={this.getPinnedName}
        />
        {(this.state.mode === 'default' && (
          <div className="center">
            <Pagination
              activePage={pageMap.get('faq') ? pageMap.get('faq').page : 1}
              totalPages={pageMap.get('faq') ? pageMap.get('faq').totalPages : 1}
              onPageChange={(e, data) => this.findFaqsByDefault(data.activePage as number)}
            />
          </div>
        )) ||
          (this.state.mode === 'search' && faqs && faqs.results.length !== 0 && (
            <div className="center">
              <Pagination
                activePage={pageMap.get('faq') ? pageMap.get('faq').page : 1}
                totalPages={pageMap.get('faq') ? pageMap.get('faq').totalPages : 1}
                onPageChange={(e, data) => this.findFaqsBySearch(data.activePage as number)}
              />
            </div>
          ))}
        <AlertWinForSearchBox handleClose={this.handleCloseAlertForSearchBoxWin} open={alertWinForSearchBoxOpen} />
      </Container>
    );
  }
}

export default withRouter(FaqListContainer);
