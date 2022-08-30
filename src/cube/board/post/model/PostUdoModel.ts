import { IdName } from 'shared/model';

import { PostContentsModel } from './PostContentsModel';
import { PostConfigModel } from './PostCofigModel';
import { OpenState } from './OpenState';
import { WriterModel } from './WriterModel';

export class PostUdoModel {
  //
  title: string = '';
  writer: WriterModel = new WriterModel();
  contents: PostContentsModel = new PostContentsModel();
  config: PostConfigModel = new PostConfigModel();
  category: IdName = new IdName();
  pinned: boolean = false;
  deleted: boolean = false;
  answered: boolean = false;
  answerId: string = '';
  openState: OpenState = OpenState.Created;

  // constructor(postUdo?: PostUdoModel) {
  //   //
  //   if (postUdo) {
  //     const writer = postUdo.writer && new WriterModel(postUdo.writer) || this.writer;
  //     const contents = postUdo.contents && new PostContentsModel(postUdo.contents) || this.contents;
  //     const config = postUdo.config && new PostConfigModel(postUdo.config) || this.config;
  //     const category = postUdo.category && new IdName(postUdo.category) || this.category;
  //     const openState = postUdo.openState && postUdo.openState;
  //
  //     Object.assign(this, { ...postUdo, writer, contents, config, category, openState });
  //   }
  // }
}

// decorate(PostUdoModel, {
//   title: observable,
//   writer: observable,
//   contents: observable,
//   config: observable,
//   category: observable,
//   pinned: observable,
//   deleted: observable,
//   answered: observable,
//   answerId: observable,
//   openState: observable,
// });
//
