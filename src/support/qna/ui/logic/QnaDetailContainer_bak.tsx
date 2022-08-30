import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import depot from '@nara.drama/depot';
import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { Language, getPolyglotToAnyString } from 'shared/components/Polyglot';
import { PolyglotModel } from 'shared/model';

import { serviceManagementUrl } from 'Routes';
import { CubeService } from 'cube/cube';
import PostService from 'cube/board/post/present/logic/PostService';
import CategoryService from 'cube/board/category/present/logic/CategoryService';
import AnswerService from 'cube/board/post/present/logic/AnswerService';
import { AnswerModel } from 'cube/board/post/model/AnswerModel';
import { QnAFunnelModel } from 'cube/board/board/model/vo/QnAFunnelModel';
import { CardService } from 'card';
import { divisionCategories } from 'card/card/ui/logic/CardHelper';
import { CollegeService } from 'college';

import QnaDetailView from '../view/QnaDetailView_bak';

interface Props extends RouteComponentProps<{ cineroomId: string; postId: string }> {}

interface States {
  alertWinOpen: boolean;
  confirmWinOpen: boolean;
  confirmWinForDeleteOpen: boolean;
  isBlankTarget: string;
  editorOpen: boolean;
  alertIcon: string;
  type: string;
  title: string;
  filesMap: Map<string, any>;
  filesMapForAnswer: Map<string, any>;
  name: string;
  email: string;
  qnaFunnel: QnAFunnelModel;
}

interface Injected {
  postService: PostService;
  categoryService: CategoryService;
  answerService: AnswerService;
  cardService: CardService;
  cubeService: CubeService;
  collegeService: CollegeService;
}

@inject('postService', 'categoryService', 'answerService', 'cardService', 'cubeService', 'collegeService')
@observer
@reactAutobind
class QnaDetailContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      confirmWinOpen: false,
      confirmWinForDeleteOpen: false,
      isBlankTarget: '',
      editorOpen: false,
      alertIcon: '',
      type: '',
      title: '',
      filesMap: new Map<string, any>(),
      filesMapForAnswer: new Map<string, any>(),
      name: '',
      email: '',
      qnaFunnel: new QnAFunnelModel(),
    };
  }

  componentDidMount() {
    //
    this.init();
  }

  init() {
    //
    const { postService, categoryService, answerService } = this.injected;
    const { postId } = this.props.match.params;
    const names = JSON.parse(patronInfo.getPatronName() || '') || '';
    const email = patronInfo.getPatronEmail() || '';
    if (postService && categoryService && answerService) {
      postService.changePostProps('boardId', 'FAQ');
      categoryService.findCategoriesByBoardId('QNA');
      postService
        .findPostByPostId(postId)
        .then((post) => {
          const copiedValue = new PolyglotModel(post.writer.name);
          copiedValue.setValue(Language.En, names?.en);
          copiedValue.setValue(Language.Ko, names?.ko);
          copiedValue.setValue(Language.Zh, names?.zh);
          if (!post.answered) {
            //answerService.changeAnswerProps('writer.name', name);
            answerService.changeAnswerProps('writer.name', copiedValue);
            answerService.changeAnswerProps('writer.email', email);
            answerService.initAnswer();
            this.getFileIds();
          } else {
            answerService.findAnswerByPostId(postId).then(() => {
              if (postService) {
                //answerService.changeAnswerProps('updater.name', name);
                answerService.changeAnswerProps('updater.name', copiedValue);
                answerService.changeAnswerProps('updater.email', email);
              }
            });
          }

          if (post.config.sourceType === 'cube') {
            this.setCube();
          } else if (post.config.sourceType === 'course') {
            this.setCard();
          }
        })
        .then(() => {
          postService
            .findPostByPostId(postId)
            .then(() => this.getFileIds())
            .then(() => this.getFileIdsForAnswer());
        });
    }
  }

  async setCube() {
    //
    const { post } = this.injected.postService;
    const { cubeService, collegeService } = this.injected;
    const { collegesMap, channelMap } = collegeService;

    const cubeDetail = await cubeService.findCubeDetail(post.config.sourceId);

    const { cube, cubeContents } = cubeDetail;

    const { mainCategory } = divisionCategories(cube.categories);

    const qnaFunnel = new QnAFunnelModel({
      id: cube.id,
      name: getPolyglotToAnyString(cube.name),
      type: cube.type,
      channel: `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`,
      time: cube.registeredTime,
      creatorName: getPolyglotToAnyString(cubeContents.registrantName),
    });

    this.setState({ qnaFunnel });
  }

  async setCard() {
    const { post } = this.injected.postService || ({} as PostService);
    const { cardService, collegeService } = this.injected;
    const { collegesMap, channelMap } = collegeService;

    const cardWithContents = await cardService.findCardById(post.config.sourceId);

    const { card, cardContents } = cardWithContents;
    const { mainCategory } = divisionCategories(card.categories);

    const qnaFunnel = new QnAFunnelModel({
      id: card.id,
      name: getPolyglotToAnyString(card.name),
      type: 'Card',
      channel: `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(mainCategory.channelId)}`,
      time: cardContents.registeredTime,
      creatorName: getPolyglotToAnyString(cardContents.registrantName),
    });

    this.setState({ qnaFunnel });
  }

  getFileIds() {
    //
    const { post } = this.injected.postService || ({} as PostService);
    const referenceFileBoxId = post && post.contents && post.contents.depotId;
    if (referenceFileBoxId) this.findFiles('reference', referenceFileBoxId);
  }

  getFileIdsForAnswer() {
    //
    const { answer } = this.injected.answerService || ({} as AnswerService);
    const referenceFileBoxId = answer && answer.contents && answer.contents.depotId;
    if (referenceFileBoxId) this.findFilesForAnswer('referenceForAnswer', referenceFileBoxId);
  }

  findFiles(type: string, fileBoxId: string) {
    const { filesMap } = this.state;
    return depot.getDepotFiles(fileBoxId).then((files) => {
      filesMap.set(type, files);
      const newMap = new Map(filesMap.set(type, files));
      this.setState({ filesMap: newMap });
    });
  }

  findFilesForAnswer(type: string, fileBoxId: string) {
    const { filesMapForAnswer } = this.state;
    return depot.getDepotFiles(fileBoxId).then((files) => {
      filesMapForAnswer.set(type, files);
      const newMap = new Map(filesMapForAnswer.set(type, files));
      this.setState({ filesMapForAnswer: newMap });
    });
  }

  onChangerContentsProps(name: string, value: string | PolyglotModel) {
    //
    // console.log(value);
    const { answerService } = this.injected;
    if (name === 'title' && value.length > 51) {
      alert('제목은 50자를 넘을 수 없습니다.');
    }
    if (answerService) {
      answerService.changeAnswerProps(name, value);
    }
  }

  onChangePostProps(name: string, value: string) {
    //
    const { postService } = this.injected;
    if (postService) {
      postService.changePostProps(name, value);
    }
  }

  routeToPostList() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/qna-list`);
  }

  routeToPostDetail(postId: string) {
    //
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/qna-detail/${postId}`
    );
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleCloseConfirmWin() {
    //
    this.setState({
      confirmWinForDeleteOpen: false,
      confirmWinOpen: false,
    });
  }

  handleOKConfirmWin() {
    //
    // first answer
    const { answerService, postService } = this.injected;
    const { postId } = this.props.match.params;
    Promise.resolve()
      .then(() => this.onChangerContentsProps('postId', postId))
      .then(() => {
        const { answer } = this.injected.answerService || ({} as AnswerService);
        if (answerService) {
          answerService
            .createAnswer(answer)
            .then(() => postService && postService.initPostContents())
            .then(() => this.routeToPostList());
        }
      });
  }

  handleOKConfirmWinForDelete() {
    //
    const { postService } = this.injected;
    const { postId } = this.props.match.params;
    Promise.resolve()
      .then(() => postService && postService.changePostProps('deleted', String(true)))
      .then(() => postService && postService.modifyPost(postId, postService.post))
      .then(() => this.routeToPostList());
  }

  handleOKForModificationConfirmWin() {
    //
    // modify answer
    const { answerService } = this.injected;
    const { postId } = this.props.match.params;
    const { post } = this.injected.postService || ({} as PostService);
    const { answer } = this.injected.answerService!;
    Promise.resolve().then(() => {
      if (answerService) {
        answerService
          .updateAnswer(post.answer.id, answer)
          .then(() => answerService && answerService.initAnswerContents())
          .then(() => this.routeToPostDetail(postId));
      }
    });
  }

  routeToModifyQNA() {
    //
    this.setState({
      editorOpen: true,
    });
  }

  handleDelete() {
    //
    this.setState({ confirmWinForDeleteOpen: true });
  }

  handleSave() {
    //
    const { post } = this.injected.postService || ({} as PostService);
    const { answer } = this.injected.answerService || ({} as AnswerService);
    if (AnswerModel.isBlank(post, answer) === 'success') {
      this.setState({ confirmWinOpen: true });
    } else {
      this.setState({
        isBlankTarget: AnswerModel.isBlank(post, answer),
        alertWinOpen: true,
      });
    }
  }

  handleOk() {
    //
  }

  getFileBoxIdForReference(fileBoxId: string) {
    //
    const { answerService } = this.injected;
    const { answer } = answerService || ({} as AnswerService);
    if (answerService && answer.contents) answerService.changeAnswerProps('contents.depotId', fileBoxId);
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

  render() {
    const { post } = this.injected.postService || ({} as PostService);
    const { answer } = this.injected.answerService || ({} as AnswerService);
    const {
      alertWinOpen,
      isBlankTarget,
      confirmWinOpen,
      confirmWinForDeleteOpen,
      editorOpen,
      alertIcon,
      type,
      title,
      filesMap,
      filesMapForAnswer,
      name,
      email,
    } = this.state;

    return (
      <Container fluid>
        <QnaDetailView
          post={post}
          answer={answer}
          onChangerContentsProps={this.onChangerContentsProps}
          handleDelete={this.handleDelete}
          handleSave={this.handleSave}
          routeToPostList={this.routeToPostList}
          routeToModifyQNA={this.routeToModifyQNA}
          handleCloseAlertWin={this.handleCloseAlertWin}
          handleCloseConfirmWin={this.handleCloseConfirmWin}
          handleOKConfirmWin={this.handleOKConfirmWin}
          handleOKConfirmWinForDelete={this.handleOKConfirmWinForDelete}
          handleOKForModificationConfirmWin={this.handleOKForModificationConfirmWin}
          confirmWinForDeleteOpen={confirmWinForDeleteOpen}
          isBlankTarget={isBlankTarget}
          editorOpen={editorOpen}
          alertWinOpen={alertWinOpen}
          handleOk={this.handleOk}
          alertIcon={alertIcon}
          type={type}
          title={title}
          confirmWinOpen={confirmWinOpen}
          getFileBoxIdForReference={this.getFileBoxIdForReference}
          filesMap={filesMap}
          filesMapForAnswer={filesMapForAnswer}
          changeDateToString={this.changeDateToString}
          name={name}
          email={email}
          qnaFunnel={this.state.qnaFunnel}
        />
      </Container>
    );
  }
}

export default withRouter(QnaDetailContainer);
