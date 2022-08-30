import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
// import { inject, observer } from 'mobx-react';
// import { reactAutobind, reactAlert } from '@nara.platform/accent';
// import { Container, Pagination } from 'semantic-ui-react';
// import PostService from '../../../post/present/logic/PostService';
// import AttendListView from '../view/AttendListView';
// import { PostQueryModel } from '../../../post/model/PostQueryModel';
// import { PostModel } from '../../../post/model/PostModel';
// import { PostListViewXlsxModel } from '../../../post/model/PostListViewXlsxModel';
// import XLSX from 'xlsx';
//
interface Props extends RouteComponentProps<{ cineroomId: string }> {
  // postService?: PostService;
}

// @inject('postService')
// @observer
// @reactAutobind
class AttendListContainer extends React.Component<Props> {
  //   //
  //   constructor(props: Props) {
  //     super(props);
  //   }
  //
  //   componentDidMount() {
  //     const { clearResult } = this.props.postService || ({} as PostService);
  //     clearResult();
  //   }
  //
  //   onChangePostQueryProps(name: string, value: string | number) {
  //     //
  //     const { postService } = this.props;
  //     postService!.changePostQueryProps(name, value);
  //   }
  //
  //   onSearchPostsBySearchBox() {
  //     //
  //     const { postService } = this.props;
  //     if (
  //       postService?.postQuery.searchWord === null ||
  //       postService?.postQuery.searchWord === ''
  //     ) {
  //       reactAlert({ title: '안내', message: '검색어를 입력해주세요..' });
  //       return;
  //     }
  //     if (postService) {
  //       const postQueryObject = PostQueryModel.isBlank(postService.postQuery);
  //       if (postQueryObject === 'success' && postService.postQuery) {
  //         this.findPostsBySearch();
  //       }
  //     }
  //   }
  //
  //   findPostsBySearch() {
  //     const { postService } = this.props;
  //     if (postService) {
  //       postService.findAttend();
  //     }
  //   }
  //
  //   onClearPostQueryProps() {
  //     //
  //     const { postService } = this.props;
  //     postService!.clearPostQuery();
  //   }
  //
  //   findAllAttendExcel() {
  //     //TODO.엑셀 다운로드 api 완료 후 추가 작업 필요
  //     const { postService } = this.props;
  //     postService!.findAllAttendExcel().then((attende: any[]) => {
  //       const qnaXlsxList: any[] = [];
  //       attende.map((cube, index) => {
  //         qnaXlsxList.push(PostModel.attendXLSX(cube, index));
  //       });
  //       const qnaExcel = XLSX.utils.json_to_sheet(qnaXlsxList);
  //       const temp = XLSX.utils.book_new();
  //
  //       XLSX.utils.book_append_sheet(temp, qnaExcel, 'attende');
  //
  //       XLSX.writeFile(temp, `attende.xlsx`);
  //     });
  //   }
  //
  render() {
    //     const { posts, postQuery } = this.props.postService || ({} as PostService);
    //     const result = posts.results;
    //     const totalCount = posts.totalCount;
    //
    return <></>;
    //     return (
    //       <Container fluid>
    //         <AttendListView
    //           findAllAttendExcel={this.findAllAttendExcel}
    //           postQuery={postQuery}
    //           onChangePostQueryProps={this.onChangePostQueryProps}
    //           result={result}
    //           totalCount={totalCount}
    //           onSearchPostsBySearchBox={this.onSearchPostsBySearchBox}
    //         />
    //       </Container>
    //     );
  }
}

export default withRouter(AttendListContainer);
