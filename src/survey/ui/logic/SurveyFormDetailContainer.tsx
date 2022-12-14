import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Container } from 'semantic-ui-react';

import { reactAutobind, reactAlert, reactConfirm } from '@nara.platform/accent';
import { fileUtil } from '@nara.drama/depot';

import { SharedService, depotService, DepotUploadType } from 'shared/present';
import { PageTitle } from 'shared/components';
import { Language, getDefaultLanguage } from 'shared/components/Polyglot';
import { AlertWin } from 'shared/ui';

import { ChoiceQuestionItems } from 'survey/form/model/ChoiceQuestionItems';
import { AnswerImageUrlModel } from 'survey/form/model/AnswerImageUrlModel';

import { SurveyFormModel } from '../../form/model/SurveyFormModel';
import { SurveyFormService } from '../../index';
import { SurveyFormEditableView } from '../view/SurveyFormEditableView';
import { QuestionItemType } from '../../form/model/QuestionItemType';
import { SurveyFormReadOnlyView } from '../view/SurveyFormReadOnlyView';
import { NumberValue } from '../../form/model/NumberValue';
import { DesignState } from '../../form/model/DesignState';
import { QuestionModel } from '../../form/model/QuestionModel';
import SurveyFormApi from '../../form/present/apiclient/SurveyFormApi';
import { EssayQuestionItems } from '../../form/model/EssayQuestionItems';

interface Params {
  surveyFormId: string;
}

interface Props extends RouteComponentProps<Params> {
  //
  sharedService?: SharedService;
  surveyFormService?: SurveyFormService;
}

interface States {
  alertWinOpen: boolean;
  alertIcon: string;
  alertTitle: string;
  alertType: string;
  alertMessage: string;
}

const ICON_EXTENSION = {
  IMAGE: 'jpg|png|jpeg|svg|JPG|PNG|JPEG|SVG',
};

const defaultLanguage = Language.Ko;

@inject('sharedService', 'surveyFormService')
@reactAutobind
@observer
class SurveyFormDetailContainer extends React.Component<Props, States> {
  //
  breadcrumb = [
    { key: 'Home', content: 'HOME', active: false, link: true },
    { key: 'Survey', content: '?????? ??????', active: false, link: true },
    { key: 'SurveyCase', content: '???????????? ??????', active: true },
  ];

  constructor(props: Props) {
    super(props);
    this.state = {
      alertWinOpen: false,
      alertMessage: '',
      alertIcon: '',
      alertTitle: '',
      alertType: '',
    };
  }

  componentDidMount(): void {
    const surveyFormId = this.props.match.params.surveyFormId;

    if (surveyFormId && surveyFormId !== 'new') {
      this.addCommonChoiceQuestion(1, '??? ????????? ?????? ?????????????????? ???????????? ??????.');
      this.addCommonChoiceQuestion(2, '??? ????????? ?????? ????????? ?????? ??? ?????? ??????. (?????? ????????? ?????? ?????? ??????.)');
      this.addCommonChoiceQuestion(3, '??? ????????? ????????? ????????? ???????????? ?????? ????????????.');
      this.addCommonEssayQuestion(4, '?????? ??????(????????? ??????, ?????? ????????? ??????)??? ?????? ?????????.(?????????)', 100);
      this.props.surveyFormService!.changeCommonSurveyFormProps();

      this.props.surveyFormService!.findSurveyForm(surveyFormId);
    } else {
      this.props.surveyFormService!.clear();

      Promise.resolve()
        .then(() => this.props.surveyFormService!.addQuestion(QuestionItemType.Review))
        .then(() => this.props.surveyFormService!.addQuestion(QuestionItemType.ChoiceFixed))
        .then(() => {
          this.props.surveyFormService!.changeQuestionLangString(
            1,
            'sentences',
            Language.Ko,
            '??? ????????? ?????? ????????? ?????? ????????? ?????? ?????? ??????.'
          );
          this.props.surveyFormService!.changeQuestionLangString(
            1,
            'sentences',
            Language.En,
            'I???ve learned or felt something new from the course.'
          );
          this.props.surveyFormService!.changeQuestionLangString(
            1,
            'sentences',
            Language.Zh,
            '???????????????????????????????????????'
          );
        })
        .then(() => this.props.surveyFormService!.addQuestion(QuestionItemType.ChoiceFixed))
        .then(() => {
          this.props.surveyFormService!.changeQuestionLangString(
            2,
            'sentences',
            Language.Ko,
            '??? ????????? ????????? ????????? ???????????? ?????? ????????????.'
          );
          this.props.surveyFormService!.changeQuestionLangString(
            2,
            'sentences',
            Language.En,
            'This course taught me something useful for my work or life.'
          );
          this.props.surveyFormService!.changeQuestionLangString(
            2,
            'sentences',
            Language.Zh,
            '???????????????????????????????????????????????????????????????'
          );
        });
    }
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    const surveyFormId = this.props.match.params.surveyFormId;
    const prevSurveyFormId = prevProps.match.params.surveyFormId;

    if (surveyFormId !== prevSurveyFormId) {
      if (surveyFormId && surveyFormId !== 'new') {
        this.props.surveyFormService!.findSurveyForm(surveyFormId);
      } else {
        this.props.surveyFormService!.clear();
      }
    }
  }

  componentWillUnmount(): void {
    this.props.surveyFormService!.clear();
  }

  handleChangeSurveyFormProp(prop: keyof SurveyFormModel, value: any) {
    this.props.surveyFormService!.changeSurveyFormProp(prop, value);
  }

  handleChangeQuestionProp(index: number, prop: string, value: any) {
    this.props.surveyFormService!.changeQuestionProp(index, prop, value);
  }

  handleCreateCriterion() {
    this.props.surveyFormService!.addNewCriterion();
  }

  handleChangeCriterion(number: string, prop: string, value: any) {
    this.props.surveyFormService!.changeCriterionProp(number, prop, value);
  }

  handleCriterionItems(number: string) {
    this.props.surveyFormService!.calculateCriterionItems(number);
  }

  handleSaveSurveyForm(gubun?: string) {
    const surveyFormId = this.props.match.params.surveyFormId;
    const title = this.props.surveyFormService!.surveyForm.titles.langStringMap.get(
      getDefaultLanguage(this.props.surveyFormService!.surveyForm.langSupports)
    );
    const surveyForm = this.props.surveyFormService!.surveyForm;

    if (surveyForm) {
      if (surveyForm.questions.find((question) => (question.answerItems as EssayQuestionItems).maxLength === 0)) {
        this.setState({
          alertMessage: '?????? ???????????? 0 ??????????????? ?????????.',
          alertWinOpen: true,
          alertTitle: '?????? ?????????',
          alertIcon: 'triangle',
          alertType: 'justOk',
        });
        return;
      }
    }

    if (!title || title === '') {
      this.setState({
        alertMessage: '???????????? ????????? ??????????????????.',
        alertWinOpen: true,
        alertTitle: '???????????? ?????? ?????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
    } else {
      if (surveyFormId && surveyFormId !== 'new') {
        if (gubun === 'confirmed') {
          this.handleChangeSurveyFormProp('designState', DesignState.Confirmed);

          const { surveyForm } = this.props.surveyFormService!;
          // ?????? ????????? ???????????? ?????? ????????? ?????? ???????????? ??????
          if (surveyForm.useCommon) {
            const { commonSurveyForm } = this.props.surveyFormService!;
            const newQuestions = [...commonSurveyForm.questions, ...surveyForm.questions];
            this.props.surveyFormService!.changeSurveyFormProp('questions', newQuestions);
          }
        }

        this.props.surveyFormService!.modifySurveyForm().then(() => {
          if (this.props.surveyFormService!.surveyForm.designState === DesignState.Confirmed) {
            reactAlert({ title: '??????', message: '?????????????????????.' });
          } else {
            reactAlert({ title: '??????', message: '?????????????????????.' });
          }
          this.props.history.push(`./${surveyFormId}`);
        });
      } else {
        SurveyFormApi.instance.countSurveyTitle(title).then((response) => {
          if (response > 0) {
            this.setState({
              alertMessage: '???????????? ????????? ?????????????????????.',
              alertWinOpen: true,
              alertTitle: '???????????? ?????? ?????? ??????',
              alertIcon: 'triangle',
              alertType: 'justOk',
            });
          } else {
            if (surveyFormId && surveyFormId == 'new') {
              if (gubun === 'confirmed') {
                this.handleChangeSurveyFormProp('designState', DesignState.Confirmed);

                const { surveyForm } = this.props.surveyFormService!;
                // ?????? ????????? ???????????? ?????? ????????? ?????? ???????????? ??????
                if (surveyForm.useCommon) {
                  const { commonSurveyForm } = this.props.surveyFormService!;
                  const newQuestions = [...commonSurveyForm.questions, ...surveyForm.questions];
                  this.props.surveyFormService!.changeSurveyFormProp('questions', newQuestions);
                }
              }

              this.props.surveyFormService!.registerSurveyForm().then((id) => {
                if (this.props.surveyFormService!.surveyForm.designState === DesignState.Confirmed) {
                  reactAlert({ title: '??????', message: '?????????????????????.' });
                } else {
                  reactAlert({ title: '??????', message: '?????????????????????.' });
                }
                this.props.history.push(`./${id}`);
              });
            }
          }
        });
      }
    }
  }

  onRemoveSurveyForm(surveyFormId: string) {
    Promise.resolve()
      .then(() => {
        this.props.surveyFormService!.removeSurveyForm(surveyFormId);
      })
      .then(() => this.props.history.replace(`../surveys`));
  }

  handleAddQuestion(questionItemType: QuestionItemType) {
    const { surveyFormService } = this.props;
    const { surveyForm } = surveyFormService!;

    if (
      questionItemType === QuestionItemType.Review &&
      surveyForm.questions.some((question) => question.questionItemType === QuestionItemType.Review)
    ) {
      this.setState({
        alertMessage: '???????????? ????????? ?????????????????????.',
        alertWinOpen: true,
        alertTitle: '????????? ??????',
        alertIcon: 'triangle',
        alertType: 'justOk',
      });
      return;
    }
    surveyFormService!.addQuestion(questionItemType);
    if (questionItemType === QuestionItemType.Review) {
      const lastIndex = surveyForm.questions.length - 1;
      surveyForm.questions.map((question, index) => {
        if (lastIndex !== index) {
          surveyFormService!.arrangeQuestionSequence(lastIndex, index);
        }
      });
    }
  }

  handleRemoveQuestion(index: number) {
    this.props.surveyFormService!.removeQuestion(index);
  }

  handleCopyQuestion(question: QuestionModel, index: number) {
    this.props.surveyFormService!.copyQuestion(question, index);
  }

  handleChangeQuestionSequence(index: number, targetIndex: number) {
    if (
      targetIndex === 0 &&
      this.props.surveyFormService!.surveyForm.questions[0].questionItemType === QuestionItemType.Review
    ) {
      this.props.surveyFormService!.arrangeQuestionSequence(index, 1);
    } else {
      this.props.surveyFormService!.arrangeQuestionSequence(index, targetIndex);
    }
  }

  handleChangeSurveyFormLangString(prop: string, lang: string, string: string) {
    this.props.surveyFormService!.changeSurveyFormLangStringProp(prop, lang, string);
  }

  handleChangeQuestionLangString(index: number, prop: string, lang: string, string: string) {
    this.props.surveyFormService!.changeQuestionLangString(index, prop, lang, string);
  }

  handleChangeCriterionLangString(number: string, prop: string, lang: string, string: string) {
    this.props.surveyFormService!.changeCriterionLangString(number, prop, lang, string);
  }

  handleRemoveAnswerItem(index: number, removedItem: NumberValue) {
    this.props.surveyFormService!.removeAnswerItem(index, removedItem);
  }

  handleRemoveRowItem(index: number, removedItem: NumberValue) {
    this.props.surveyFormService!.removeRowItem(index, removedItem);
  }

  handleRemoveColumnItem(index: number, removedItem: NumberValue) {
    this.props.surveyFormService!.removeColumnItem(index, removedItem);
  }

  handleMoveToList() {
    this.props.history.replace(`../surveys`);
  }

  handleCloseAlertWin() {
    //
    this.setState({
      alertWinOpen: false,
    });
  }

  handleAlertOk(type: string) {
    //
    const surveyFormId = this.props.match.params.surveyFormId;
    if (type === 'justOk') this.handleCloseAlertWin();
    if (type === 'remove') this.deleteSurveyForm(surveyFormId);
  }

  handleConfirmSurveyForm() {
    //
    reactConfirm({
      title: '??????',
      message: '?????? ?????? ????????? ??? ?????? ???????????? ??? ????????????. ?????????????????????????',
      onOk: async () => {
        Promise.resolve().then(() => this.handleSaveSurveyForm('confirmed'));
      },
    });
  }

  addCommonChoiceQuestion(sequence: number, sentence: string) {
    const { surveyForm } = this.props.surveyFormService!;

    this.props.surveyFormService!.addQuestion(QuestionItemType.Choice);
    const questions = surveyForm.questions;
    const qIndex = questions.length - 1;

    this.props.surveyFormService!.changeQuestionProp(qIndex, 'sequence.number', sequence);
    this.props.surveyFormService!.changeQuestionProp(qIndex, 'sentences.defaultLanguage', defaultLanguage);
    this.props.surveyFormService!.changeQuestionLangString(qIndex, 'sentences', defaultLanguage, sentence);
    this.addAnswerItem(qIndex, questions[qIndex], defaultLanguage, '?????? ????????? ??????.');
    this.addAnswerItem(qIndex, questions[qIndex], defaultLanguage, '????????? ??????.');
    this.addAnswerItem(qIndex, questions[qIndex], defaultLanguage, '????????????.');
    this.addAnswerItem(qIndex, questions[qIndex], defaultLanguage, '?????????.');
    this.addAnswerItem(qIndex, questions[qIndex], defaultLanguage, '?????? ?????????.');
  }

  addAnswerItem(qIndex: number, question: QuestionModel, lang: string, value: string) {
    const answerItems = { ...question.answerItems } as ChoiceQuestionItems;
    const aIndex = answerItems.items.length;

    const newAnswerItem = new NumberValue();
    newAnswerItem.number = `${aIndex + 1}`;
    newAnswerItem.values.defaultLanguage = lang;
    newAnswerItem.values.langStringMap.set(lang, value);

    answerItems.items = [...answerItems.items, newAnswerItem];

    const newAnswerImageUrl = new AnswerImageUrlModel();
    newAnswerImageUrl.number = `${aIndex + 1}`;
    newAnswerImageUrl.imageUrl = question.answerImageUrl;
    answerItems.imageUrls = [...answerItems.imageUrls, newAnswerImageUrl];
    this.props.surveyFormService!.changeQuestionProp(qIndex, 'answerItems', answerItems);
  }

  addCommonEssayQuestion(sequence: number, sentence: string, maxLength: number) {
    const { surveyForm } = this.props.surveyFormService!;

    this.props.surveyFormService!.addQuestion(QuestionItemType.Essay);
    const questions = surveyForm.questions;
    const qIndex = questions.length - 1;

    this.props.surveyFormService!.changeQuestionProp(qIndex, 'sequence.number', sequence);
    this.props.surveyFormService!.changeQuestionProp(qIndex, 'sentences.defaultLanguage', defaultLanguage);
    this.props.surveyFormService!.changeQuestionLangString(qIndex, 'sentences', defaultLanguage, sentence);

    this.props.surveyFormService!.changeQuestionProp(qIndex, 'answerItems.maxLength', maxLength);
    this.props.surveyFormService!.changeQuestionProp(qIndex, 'visible', true);
  }

  handleRemoveSurveyForm() {
    const message = '????????? ????????? ????????????????????????? ???????????? ????????? ???????????? ??? ????????????.';
    this.setState({
      alertMessage: message,
      alertWinOpen: true,
      alertTitle: '?????? ??????',
      alertIcon: 'circle',
      alertType: 'remove',
    });
  }

  deleteSurveyForm(surveyFormId: string) {
    //
    Promise.resolve()
      .then(() => {
        this.props.surveyFormService!.removeSurveyForm(surveyFormId);
      })
      .then(() => this.props.history.replace(`../surveys`));
  }

  uploadFile(file: File, uploadImageQuestionType: string, question: QuestionModel) {
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      return;
    }
    const { surveyFormService } = this.props;

    if (file.size >= 1024 * 1024 * 0.3) {
      alert('300KB ????????? ????????? ???????????????.');
      return;
    }
    //this.changeFileName(file.name);

    depotService
      .uploadFile(file, DepotUploadType.Question)
      .then((url) => {
        if (!url) {
          reactAlert({ title: '??????', message: '???????????? ??????????????????.' });
        } else {
          if (uploadImageQuestionType === 'question') {
            surveyFormService!.changeSurveyFormQuestionProps(question, 'sentencesImageUrl', url);
          } else {
            surveyFormService!.changeSurveyFormQuestionProps(question, 'answerImageUrl', url);
          }
        }
      })
      .catch(() => {
        reactAlert({ title: '??????', message: '???????????? ??????????????????.' });
      });
  }

  validatedAll(file: File) {
    const validations = [
      { type: 'Extension', validValue: ICON_EXTENSION.IMAGE },
      //{ type: ValidationType.MaxSize, validValue: 30 * 1024 }, // 30k
    ] as any[];
    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations??? type??? validValue?????? ?????????????????? validator??? ??????????????????.');
          return false;
        }

        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  //changeFileName(fileName: string) {
  //this.setState({ fileName });
  //}

  resetImage(uploadImageQuestionType: string, question: QuestionModel) {
    const { surveyFormService } = this.props;

    if (uploadImageQuestionType === 'question') {
      surveyFormService!.changeSurveyFormQuestionProps(question, 'sentencesImageUrl', '');
    } else {
      surveyFormService!.changeSurveyFormQuestionProps(question, 'answerImageUrl', '');
    }
  }

  render() {
    const { computedSurveyForm, questions, commonSurveyForm } = this.props.surveyFormService!;

    const { alertWinOpen, alertMessage, alertIcon, alertTitle, alertType } = this.state;

    return (
      <Container fluid className="survey-style">
        <PageTitle breadcrumb={this.breadcrumb} />

        {((DesignState.Published === computedSurveyForm.designState ||
          DesignState.Confirmed === computedSurveyForm.designState) && (
          <SurveyFormReadOnlyView surveyForm={computedSurveyForm} onMoveToList={this.handleMoveToList} />
        )) || (
          <SurveyFormEditableView
            surveyForm={computedSurveyForm}
            commonSurveyForm={commonSurveyForm}
            questions={questions}
            onChangeSurveyFormProp={this.handleChangeSurveyFormProp}
            onChangeSurveyFormLangStringProp={this.handleChangeSurveyFormLangString}
            onRemoveSurveyForm={this.handleRemoveSurveyForm}
            onSaveSurveyForm={this.handleSaveSurveyForm}
            onAddQuestion={this.handleAddQuestion}
            onRemoveQuestion={this.handleRemoveQuestion}
            onCopyQuestion={this.handleCopyQuestion}
            onChangeQuestionProp={this.handleChangeQuestionProp}
            onChangeQuestionLangString={this.handleChangeQuestionLangString}
            onChangeQuestionSequence={this.handleChangeQuestionSequence}
            onConfirmSurveyForm={this.handleConfirmSurveyForm}
            onMoveToList={this.handleMoveToList}
            onCreateCriterion={this.handleCreateCriterion}
            onChangeCriterion={this.handleChangeCriterion}
            onChangeCriterionLangString={this.handleChangeCriterionLangString}
            onRemoveAnswerItem={this.handleRemoveAnswerItem}
            onRemoveRowItem={this.handleRemoveRowItem}
            onRemoveColumnItem={this.handleRemoveColumnItem}
            calculateCriterionItems={this.handleCriterionItems}
            uploadFile={this.uploadFile}
            resetImage={this.resetImage}
          />
        )}
        <AlertWin
          message={alertMessage}
          handleClose={this.handleCloseAlertWin}
          open={alertWinOpen}
          alertIcon={alertIcon}
          title={alertTitle}
          type={alertType}
          handleOk={this.handleAlertOk}
        />
      </Container>
    );
  }
}
export default withRouter(SurveyFormDetailContainer);
