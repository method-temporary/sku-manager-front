import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Button, Container, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import depot from '@nara.drama/depot';
import { MemberViewModel } from '@nara.drama/approval';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { Loader, PageTitle } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { AlertWin, ConfirmWin } from 'shared/ui';

import { CardService } from 'card';
import { CollegeService } from 'college';
import QnaRom from 'support/qna/model/sdo/QnaRom';
import { QuestionState } from 'support/qna/model/vo/QuestionState';
import { RequestChannel } from 'support/qna/model/vo/RequestChannel';
import OperatorRom from 'support/operator/model/sdo/OperatorRom';
import OperatorService from 'support/operator/present/logic/OperatorService';
import OperatorWithUserIdentity from 'support/operator/model/sdo/OperatorWithUserIdentity';
import { OperatorWithUserIdentityRom } from 'support/qna/model/sdo/OperatorWithUserIdentityRom';
import { UserService } from 'user';
import { UserModel } from 'user/model/UserModel';

import { CategoryService } from '../../../category';
import { SupportType } from '../../../category/model/vo/SupportType';
import { QnaService } from '../..';
import CreateQnaQuestionView from '../view/CreateQnaQuestionView';
import QnaDetailQuestionView from '../view/QnaDetailQuestionView';
import CreateQnaAnswerView from '../view/CreateQnaAnswerView';
import QnaDetailAnswerView from '../view/QnaDetailAnswerView';
import QnaDetailRelatedQuestionView from '../view/QnaDetailRelatedQuestionView';

interface Injected {
  qnaService: QnaService;
  categoryService: CategoryService;
  cardService: CardService;
  collegeService: CollegeService;
  operatorService: OperatorService;
  userService: UserService;
}

interface Params {
  cineroomId: string;
  qnaId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface States {
  alertOpenOnBlank: boolean;
  alertOpenOnDelete: boolean;
  // modalOpenOnSelectOperator: boolean;
  modalOpenOnCheckMail: boolean;
  modalOpenOnNonCheckMail: boolean;
  mainCategoryList: SelectTypeModel[];
  subCategoryList: SelectTypeModel[];
  questionUpdatable: boolean;
  answerUpdatable: boolean;
  isQna: boolean;
  modifyModeCheck: boolean;
  managerInfo: UserModel;
}

@inject('qnaService', 'categoryService', 'cardService', 'collegeService', 'operatorService', 'userService')
@observer
@reactAutobind
class CreateQnaContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      alertOpenOnBlank: false,
      alertOpenOnDelete: false,
      // modalOpenOnSelectOperator: false,
      modalOpenOnCheckMail: false,
      modalOpenOnNonCheckMail: false,
      mainCategoryList: [],
      subCategoryList: [],
      questionUpdatable: false,
      answerUpdatable: false,
      isQna: false,
      modifyModeCheck: false,
      managerInfo: new UserModel(),
    };

    this.init();
  }

  componentWillUnmount() {
    //
    this.onChangeCreateQnaProps('question.requestChannel', RequestChannel.PHONE);
    this.onChangeCreateQnaProps('question.depotId', '');
    this.onChangeCreateQnaProps('answer.depotId', '');
  }

  // componentDidMount() {
  //   //
  // }

  async init() {
    //
    const qnaId = this.props.match.params.qnaId;
    const { qnaService, cardService, operatorService, userService } = this.injected;

    await this.getMainCategoryList();
    await operatorService.clearOperatorIds();
    cardService.clearSingleSelectedCard();
    qnaService.clearRelatedQnaRdos();
    this.setState({ managerInfo: await userService.findUser() });

    if (qnaId) {
      await qnaService.findByQuestionId(qnaId);
      await qnaService.findRelatedQnasByQuestionId(qnaId);

      this.setState({ questionUpdatable: false });

      const { qnaRom } = qnaService;

      const card =
        qnaRom.question &&
        qnaRom.question.relatedCardId &&
        (await cardService.findCardById(qnaRom.question.relatedCardId));
      card && (await cardService.setSingleSelectedCards(card));

      if (qnaRom.question && qnaRom.question.mainCategoryId) {
        await this.getSubCategoryList(qnaRom && qnaRom.question.mainCategoryId);
      }

      if (qnaRom.question && qnaRom.question.requestChannel === RequestChannel.QNA) {
        this.setState({ isQna: true });

        if (qnaRom.answer && qnaRom.answer.id) {
          this.setState({ modifyModeCheck: true });
        }
      }

      if (qnaRom.answer && qnaRom.answer.modifier) {
        const tempOperator =
          (await operatorService.findOperatorByDenizenId(qnaRom.answer.modifier)) ||
          OperatorRom.fromUserDetailModel(await userService.findUserByUserId(qnaRom.answer.modifier));

        tempOperator && tempOperator.denizenId && (await qnaService.setOperator(tempOperator));
      }

      const tempMailSender =
        qnaRom.latestOperatorSentEmail &&
        qnaRom.latestOperatorSentEmail.sender &&
        (await userService.findUserByUserId(qnaRom.latestOperatorSentEmail.sender));

      tempMailSender && (await qnaService.setMailSender(tempMailSender));

      if (qnaRom.question && qnaRom.question.requestChannel === RequestChannel.QNA && !qnaRom.answer.content) {
        this.setState({ answerUpdatable: true });
      } else {
        this.setState({ answerUpdatable: false });
      }
    } else {
      this.setState({ questionUpdatable: true, answerUpdatable: true });
      qnaService.createPageInit();

      this.onChangeCreateQnaProps('question.requestChannel', RequestChannel.PHONE);
      this.onChangeCreateQnaProps('question.depotId', '');
      this.onChangeCreateQnaProps('answer.depotId', '');
    }
  }

  getFileBoxIdInQuestion(fileBoxId: string) {
    //
    const { qnaService } = this.injected;

    if (!fileBoxId) {
      depot.UNSAFE_clearLocalFileList();
    }

    qnaService.changeQnaRom('question.depotId', fileBoxId);
  }

  getFileBoxIdInAnswer(fileBoxId: string) {
    //
    const { qnaService } = this.injected;

    if (!fileBoxId) {
      depot.UNSAFE_clearLocalFileList();
    }

    qnaService.changeQnaRom('answer.depotId', fileBoxId);
  }

  getChannelList() {
    //
    const channelList: { key: string; text: string; value: string }[] = [];
    SelectType.qnaCreateChannel.map((channel) => channelList.push(channel));

    return channelList;
  }

  async getMainCategoryList() {
    //
    const { categoryService } = this.injected;

    const categoryList: SelectTypeModel[] = [];

    const originCategoryList = await categoryService.findMainCategories(SupportType.QNA);

    originCategoryList.map((category, idx) => {
      categoryList.push(new SelectTypeModel(idx.toString(), getPolyglotToAnyString(category.name), category.id));
    });

    await this.setState({ mainCategoryList: categoryList });
  }

  async getSubCategoryList(id: string) {
    //
    const { categoryService } = this.injected;

    const categoryList: SelectTypeModel[] = [];

    const originCategoryList = await categoryService.findSubCategories(SupportType.QNA, id);

    originCategoryList.map((category, idx) => {
      categoryList.push(new SelectTypeModel(idx.toString(), getPolyglotToAnyString(category.name), category.id));
    });

    await this.setState({ subCategoryList: categoryList });
  }

  getStateName(word: QuestionState) {
    //
    return SelectType.qnaState.find((state) => state.value === word)?.text;
  }

  getChannelName(word: RequestChannel | '') {
    return SelectType.qnaChannel.find((channel) => channel.value === word)?.text;
  }

  getCategoryName(word: string, subCheck?: boolean) {
    //
    const { mainCategoryList, subCategoryList } = this.state;

    if (subCheck) {
      return subCategoryList.find((category) => category.value === word)?.text;
    }

    return mainCategoryList.find((category) => category.value === word)?.text;
  }

  getOperatorGroupName(id: string) {
    const { operatorService } = this.injected;
    const { operatorGroups } = operatorService;
    const groupName = operatorGroups.find((group) => group.id === id)?.name;

    return groupName;
  }

  onChangeCreateQnaProps(name: string, value: any) {
    //
    const { qnaService } = this.injected;

    qnaService.changeQnaRom(name, value);

    if (name === 'question.mainCategoryId') {
      this.getSubCategoryList(value);
      qnaService.changeQnaRom('question.subCategoryId', '');
    }
  }

  onSelectedRequestUser(member: MemberViewModel) {
    //
    const { qnaService } = this.injected;

    qnaService.selectRequestUser(member);

    this.onChangeCreateQnaProps('question.denizenId', member.id);
  }

  async onClickOkButtonInOperatorModal(operatorList: OperatorWithUserIdentity[]) {
    //
    const { qnaService, cardService } = this.injected;
    const { qnaRom } = qnaService;
    const { singleSelectedCard } = cardService;

    this.onChangeCreateQnaProps('operatorsToSendMail', []);

    let selectedOperatorList: OperatorWithUserIdentityRom[] = [];

    const cardOperator =
      qnaRom.operators && qnaRom.operators.length > 0 && qnaRom.operators.find((operator) => operator.cardOperator);

    selectedOperatorList = operatorList.map((operator) => {
      const operatorGroupName = this.getOperatorGroupName(operator.operator.operatorGroupId);

      return OperatorWithUserIdentityRom.fromUserIdentityModel(
        operator.userIdentity,
        operatorGroupName && operatorGroupName
      );
    });

    cardOperator && selectedOperatorList.push(cardOperator);

    // selectedOperatorList &&
    //   selectedOperatorList.length > 0 &&
    //   this.setState({ selectedOperatorIds: selectedOperatorList.map((operator) => operator.denizenId) });

    await this.onChangeCreateQnaProps('operators', selectedOperatorList);

    if (qnaRom.question.state === QuestionState.QuestionReceived) {
      this.onChangeCreateQnaProps('question.state', QuestionState.AnswerWaiting);
    }

    if (qnaRom && qnaRom.question.requestChannel === RequestChannel.QNA) {
      this.onChangeCreateQnaProps('answer.content', '');
      this.onChangeCreateQnaProps('answer.depotId', '');
      this.onChangeCreateQnaProps('answer.checkMail', false);
    }
  }

  async onClickRemoveOperator(denizenId: string) {
    const { qnaService } = this.injected;
    const { qnaRom } = qnaService;

    const tempList = [...qnaRom.operators];

    await tempList.splice(
      qnaRom.operators.findIndex((operator) => operator.denizenId === denizenId),
      1
    );

    await this.onChangeCreateQnaProps('operators', tempList);
  }

  onClickRegisterButton() {
    //
    const { qnaService } = this.injected;
    const { qnaRom } = qnaService;
    const { isQna } = this.state;

    if (qnaRom.isBlank()) {
      this.setState({ alertOpenOnBlank: true });
      return;
    }

    // if (qnaRom.operators && qnaRom.operators.length > 0) {
    //   this.setState({ modalOpenOnSelectOperator: true });
    // } else {
    //   if (qnaRom && qnaRom.answer && qnaRom.answer.checkMail) {
    //     this.setState({ modalOpenOnCheckMail: true });
    //   } else {
    //     this.setState({ modalOpenOnNonCheckMail: true });
    //   }
    // }

    if (qnaRom && qnaRom.answer && qnaRom.answer.checkMail) {
      this.setState({ modalOpenOnCheckMail: true });
    } else {
      this.setState({ modalOpenOnNonCheckMail: true });
    }
  }

  onClickListButton() {
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/service-management/supports/qna-list`);
  }

  onClickDeleteButton() {
    //
    this.setState({ alertOpenOnDelete: true });
  }

  handleOkSelectedCardModal() {
    //
    const { cardService } = this.injected;
    const { singleSelectedCard } = cardService;

    this.onChangeCreateQnaProps('question.relatedCardId', singleSelectedCard.card.id);
    this.onChangeCreateQnaProps('question.relatedCardName', singleSelectedCard.card.name);
  }

  handleOkSelectedDeletedAlert() {
    //
    const { qnaService } = this.injected;
    this.setState({ alertOpenOnDelete: false });

    const qnaId = this.props.match.params.qnaId;
    qnaService.removeQna(qnaId);

    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/service-management/supports/qna-list`);
  }

  // handleOkSelectedOperatorModal() {
  //   //
  //   const { qnaService } = this.injected;
  //   const { qnaRom } = qnaService;

  //   if (qnaRom && qnaRom.answer && qnaRom.answer.checkMail) {
  //     this.setState({ modalOpenOnSelectOperator: false, modalOpenOnCheckMail: true });
  //   } else {
  //     this.setState({ modalOpenOnSelectOperator: false, modalOpenOnNonCheckMail: true });
  //   }
  // }

  handleOkCheckedMailModal() {
    //
    this.setState({
      // modalOpenOnSelectOperator: false,
      modalOpenOnCheckMail: false,
      modalOpenOnNonCheckMail: false,
    });
    this.mainRegisterLogic();
  }

  handleClickSendMailCheckBox(denizenId: string) {
    //
    const { qnaService } = this.injected;
    const { qnaRom } = qnaService;

    const sendMailList = [...qnaRom.operatorsToSendMail];

    if (sendMailList.some((userId) => userId === denizenId)) {
      sendMailList.splice(sendMailList.indexOf(denizenId, 1));
    } else {
      sendMailList.push(denizenId);
    }

    this.onChangeCreateQnaProps('operatorsToSendMail', sendMailList);
  }

  async mainRegisterLogic() {
    //
    const { qnaService } = this.injected;
    const { qnaRom, requestUser } = qnaService;

    const qnaCdo = QnaRom.asCdo(qnaRom, requestUser);

    const { isQna, modifyModeCheck } = this.state;

    // let goList = false;

    if (isQna && modifyModeCheck) {
      //
      await qnaService.modifyQna(qnaCdo);
    } else if (isQna) {
      await qnaService.registerQna(qnaCdo);
    } else if (modifyModeCheck) {
      await qnaService.modifyEtc(qnaCdo);
    } else {
      await qnaService.registerEtc(qnaCdo);
      // goList = true;
    }

    await this.onClickListButton();
    // if (goList) {
    //   await this.onClickListButton();
    // } else {
    //   await this.init();
    // }
  }

  async onClickModifyButton() {
    //
    const { isQna } = this.state;

    this.onChangeCreateQnaProps('question.state', QuestionState.AnswerWaiting);

    if (isQna) {
      this.setState({ questionUpdatable: false, answerUpdatable: true });
    } else {
      this.setState({ questionUpdatable: true, answerUpdatable: true });
    }

    this.setState({ modifyModeCheck: true });
  }

  closeAlert() {
    //
    this.setState({ alertOpenOnBlank: false, alertOpenOnDelete: false });
  }

  // closeSelectedOperatorModal() {
  //   this.setState({ modalOpenOnSelectOperator: false });
  // }

  closeCheckedMailModal() {
    this.setState({ modalOpenOnCheckMail: false, modalOpenOnNonCheckMail: false });
  }

  render() {
    const { qnaService, cardService, collegeService, userService } = this.injected;
    const { qnaRom, requestUser, operator, mailSender, relatedQnaRdos } = qnaService;
    const { singleSelectedCard } = cardService;
    const { collegesMap, channelMap } = collegeService;
    const {
      mainCategoryList,
      subCategoryList,
      alertOpenOnBlank,
      alertOpenOnDelete,
      // modalOpenOnSelectOperator,
      modalOpenOnCheckMail,
      modalOpenOnNonCheckMail,
      questionUpdatable,
      answerUpdatable,
      isQna,
      managerInfo,
    } = this.state;

    const loaderDisabled = true;

    return (
      <>
        <Container fluid>
          <PageTitle breadcrumb={SelectType.pathForQna} />
          <div className="contents">
            <Form>
              {/* 문의 정보 */}
              <Loader name="info" disabled={loaderDisabled}>
                {(questionUpdatable && (
                  <CreateQnaQuestionView
                    isQna={isQna}
                    qnaRom={qnaRom}
                    requestUser={requestUser}
                    card={singleSelectedCard}
                    collegesMap={collegesMap}
                    channelMap={channelMap}
                    channelList={this.getChannelList()}
                    mainCategoryList={mainCategoryList}
                    subCategoryList={subCategoryList}
                    // getChannel={this.getChannelName}
                    // getCategory={this.getCategoryName}
                    onChangeCreateQnaProps={this.onChangeCreateQnaProps}
                    onSelectedRequestUser={this.onSelectedRequestUser}
                    getFileBoxIdForReference={this.getFileBoxIdInQuestion}
                    onClickSelectedCardModal={this.handleOkSelectedCardModal}
                  />
                )) || (
                  <QnaDetailQuestionView
                    isQna={isQna}
                    qnaRom={qnaRom}
                    requestUser={requestUser}
                    card={singleSelectedCard}
                    collegesMap={collegesMap}
                    channelMap={channelMap}
                    mainCategoryList={mainCategoryList}
                    subCategoryList={subCategoryList}
                    getChannel={this.getChannelName}
                    getCategory={this.getCategoryName}
                    onChangeCreateQnaProps={this.onChangeCreateQnaProps}
                    onSelectedRequestUser={this.onSelectedRequestUser}
                    getFileBoxIdForReference={this.getFileBoxIdInQuestion}
                  />
                )}
              </Loader>
              {/* 연관 질문 정보 */}
              {relatedQnaRdos && relatedQnaRdos.length > 0 && (
                <Loader name="info" disabled={loaderDisabled}>
                  <QnaDetailRelatedQuestionView
                    relatedQnaRdos={relatedQnaRdos}
                    cineroomId={this.props.match.params.cineroomId}
                  />
                </Loader>
              )}

              {/* 답변 정보 */}
              <Loader name="info" disabled={loaderDisabled}>
                {(answerUpdatable && (
                  <CreateQnaAnswerView
                    isQna={isQna}
                    qnaRom={qnaRom}
                    managerInfo={managerInfo}
                    onClickOkButtonInOperatorModal={this.onClickOkButtonInOperatorModal}
                    onChangeCreateQnaProps={this.onChangeCreateQnaProps}
                    getFileBoxIdForReference={this.getFileBoxIdInAnswer}
                    onClickRemoveSelectedOperator={this.onClickRemoveOperator}
                    onClickSendMailCheckBox={this.handleClickSendMailCheckBox}
                  />
                )) || (
                  <QnaDetailAnswerView
                    isQna={isQna}
                    qnaRom={qnaRom}
                    getState={this.getStateName}
                    operator={operator}
                    mailSender={mailSender}
                    onChangeCreateQnaProps={this.onChangeCreateQnaProps}
                    getFileBoxIdForReference={this.getFileBoxIdInAnswer}
                  />
                )}
              </Loader>
              <div>
                <div className="btn-group">
                  {!questionUpdatable && <Button onClick={this.onClickDeleteButton}>삭제</Button>}
                  <div className="fl-right">
                    <Button onClick={this.onClickListButton}>목록</Button>
                    {(answerUpdatable && (
                      <Button primary onClick={this.onClickRegisterButton}>
                        등록
                      </Button>
                    )) || (
                      <Button primary onClick={this.onClickModifyButton}>
                        수정
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Form>
          </div>
          {/* <ConfirmWin
            message="선택한 담당자에게 문의 확인 요청 메일을 발송하시겠습니까?"
            open={modalOpenOnSelectOperator}
            handleClose={this.closeSelectedOperatorModal}
            handleOk={this.handleOkSelectedOperatorModal}
            title="발송 안내"
            buttonYesName="확인"
            buttonNoName="취소"
          /> */}
          <ConfirmWin
            message="문의자에게 메일을 발송 하시겠습니까?"
            open={modalOpenOnCheckMail}
            handleClose={this.closeCheckedMailModal}
            handleOk={this.handleOkCheckedMailModal}
            title="발송 안내"
            buttonYesName="확인"
            buttonNoName="취소"
          />
          <ConfirmWin
            message="답변 정보를 등록 하시겠습니까?"
            open={modalOpenOnNonCheckMail}
            handleClose={this.closeCheckedMailModal}
            handleOk={this.handleOkCheckedMailModal}
            title="등록 안내"
            buttonYesName="확인"
            buttonNoName="취소"
          />
          <AlertWin
            message={'필수 항목을 입력해주세요.'}
            handleClose={this.closeAlert}
            open={alertOpenOnBlank}
            alertIcon={'triangle'}
            title={'필수 정보 입력 안내'}
            type={'안내'}
            handleOk={this.closeAlert}
          />
          <AlertWin
            message={'문의를 삭제하시겠습니까?'}
            handleClose={this.closeAlert}
            open={alertOpenOnDelete}
            alertIcon={'triangle'}
            title={'문의 삭제 안내'}
            type={'알림'}
            handleOk={this.handleOkSelectedDeletedAlert}
          />
        </Container>
      </>
    );
  }
}

export default withRouter(CreateQnaContainer);
