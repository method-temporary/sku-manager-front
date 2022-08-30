import React from 'react';
import { observer } from 'mobx-react';
import { Form } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import SurveyFormDetailView from './surveyForm/SurveyFormDetailView';
import QuestionEditableView from './question/QuestionEditableView';
import ButtonGroup from './surveyForm/ButtonGroup';
import { SurveyFormModel } from '../../form/model/SurveyFormModel';
import { QuestionModel } from '../../form/model/QuestionModel';
import { QuestionItemType } from '../../form/model/QuestionItemType';
import { NumberValue } from '../../form/model/NumberValue';
import { DesignState } from '../../form/model/DesignState';
import SurveyFormLanguageView from './surveyForm/SurveyFormLanguageView';

interface Props {
  //
  surveyForm: SurveyFormModel;
  commonSurveyForm: SurveyFormModel;
  questions: QuestionModel[];

  onChangeQuestionProp: (index: number, prop: string, value: any) => void;
  onChangeSurveyFormProp: (prop: keyof SurveyFormModel, value: any) => void;
  onChangeSurveyFormLangStringProp: (prop: string, language: string, value: string) => void;
  onChangeQuestionSequence: (index: number, targetIndex: number) => void;
  onRemoveAnswerItem: (index: number, item: NumberValue) => void;
  onRemoveRowItem: (index: number, item: NumberValue) => void;
  onRemoveColumnItem: (index: number, item: NumberValue) => void;

  onSaveSurveyForm: () => void;
  onAddQuestion: (questionItemType: QuestionItemType) => void;
  onRemoveQuestion: (index: number) => void;
  onCopyQuestion: (question: QuestionModel, index: number) => void;
  onChangeQuestionLangString: (index: number, prop: string, lang: string, string: string) => void;
  onCreateCriterion: () => void;
  onChangeCriterion: (number: string, prop: string, value: any) => void;
  calculateCriterionItems: (number: string) => void;
  onChangeCriterionLangString: (number: string, prop: string, lang: string, string: string) => void;
  onRemoveSurveyForm: () => void;

  onMoveToList: () => void;
  onConfirmSurveyForm: () => void;
  uploadFile: (file: File, uploadImageQuestionType: string, question: QuestionModel) => void;
  resetImage: (uploadImageQuestionType: string, question: QuestionModel) => void;
}

interface State {
  lang: string;
}

@observer
@reactAutobind
export class SurveyFormEditableView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      lang: '',
    };
  }

  componentDidUpdate() {
    const {
      surveyForm: { langSupports },
    } = this.props;
    if (!langSupports.some((c) => c.lang === this.state.lang) && langSupports.length > 0) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({ lang: langSupports[0].lang });
    }
  }

  //
  render() {
    const {
      surveyForm,
      commonSurveyForm,
      questions,
      onAddQuestion,
      onRemoveQuestion,
      onCopyQuestion,
      onSaveSurveyForm,
      onChangeSurveyFormProp,
      onChangeSurveyFormLangStringProp,
      onChangeQuestionProp,
      onChangeQuestionLangString,
      onRemoveAnswerItem,
      onRemoveRowItem,
      onRemoveColumnItem,
      onChangeQuestionSequence,
      onCreateCriterion,
      onChangeCriterion,
      onChangeCriterionLangString,
      calculateCriterionItems,
      onRemoveSurveyForm,

      onMoveToList,
      onConfirmSurveyForm,
      uploadFile,
      resetImage,
    } = this.props;

    return (
      <Polyglot languages={surveyForm.langSupports}>
        <Form>
          <SurveyFormLanguageView readonly={false} />
        </Form>

        <div className="styled-tab">
          <div className="ui pointing secondary menu">
            {surveyForm.langSupports.map(({ lang }) => {
              let language = lang;
              if (lang === 'Korean' || lang === 'ko') {
                language = Language.Korean;
              } else if (lang === 'English' || lang === 'en') {
                language = Language.English;
              } else if (lang === 'Chinese' || lang === 'zh') {
                language = Language.Chinese;
              }

              return (
                <a className={`item ${lang === this.state.lang && 'active'}`} onClick={() => this.setState({ lang })}>
                  {language}
                </a>
              );
            })}
          </div>

          <SurveyFormDetailView
            lang={this.state.lang}
            surveyForm={surveyForm}
            onChangeSurveyFormProp={onChangeSurveyFormProp}
            onChangeSurveyFormLangStringProp={onChangeSurveyFormLangStringProp}
            onCreateCriterion={onCreateCriterion}
            onChangeCriterion={onChangeCriterion}
            onChangeCriterionLangString={onChangeCriterionLangString}
            calculateCriterionItems={calculateCriterionItems}
          />
          <QuestionEditableView
            lang={this.state.lang}
            commonSurveyForm={commonSurveyForm}
            questions={questions}
            criterionList={surveyForm.criterionList}
            onAddQuestion={onAddQuestion}
            onRemoveQuestion={onRemoveQuestion}
            onCopyQuestion={onCopyQuestion}
            onChangeQuestionProp={onChangeQuestionProp}
            onChangeQuestionLangString={onChangeQuestionLangString}
            onChangeQuestionSequence={onChangeQuestionSequence}
            onRemoveAnswerItem={onRemoveAnswerItem}
            onRemoveRowItem={onRemoveRowItem}
            onRemoveColumnItem={onRemoveColumnItem}
            uploadFile={uploadFile}
            resetImage={resetImage}
            onChangeSurveyFormProp={onChangeSurveyFormProp}
            useCommon={surveyForm.useCommon}
          />
          <ButtonGroup
            onRemoveSurveyForm={
              (surveyForm.id && surveyForm.designState === DesignState.Draft && onRemoveSurveyForm) || undefined
            }
            onBackToList={onMoveToList}
            onSaveSurveyForm={onSaveSurveyForm}
            onConfirmSurveyForm={(surveyForm.designState === DesignState.Draft && onConfirmSurveyForm) || undefined}
          />
        </div>
      </Polyglot>
    );
  }
}
