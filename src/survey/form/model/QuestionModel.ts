import { computed, decorate, observable } from 'mobx';
import { DramaEntityObservableModel, LangStrings } from 'shared/model';

import { SequenceModel } from './SequenceModel';
import { QuestionItemType } from './QuestionItemType';
import QuestionItems from './QuestionItems';
import { ChoiceQuestionItems } from './ChoiceQuestionItems';
import { CriterionQuestionItems } from './CriterionQuestionItems';
import { EssayQuestionItems } from './EssayQuestionItems';
import { DateQuestionItems } from './DateQuestionItems';
import { BooleanQuestionItems } from './BooleanQuestionItems';
import { MatrixQuestionItems } from './MatrixQuestionItems';
import { QuestionCdoModel } from './QuestionCdoModel';
import { QuestionFlowCdoModel } from './QuestionFlowCdoModel';
import { NumberValue } from './NumberValue';
import { ReviewQuestionItems } from './ReviewQuestionItems';
import { ChoiceFixedQuestionItems } from './ChoiceFixedQuestionItems';

export class QuestionModel extends DramaEntityObservableModel {
  //
  sequence: SequenceModel = new SequenceModel();
  sentences: LangStrings = new LangStrings();
  optional: boolean = false;
  questionItemType: QuestionItemType = QuestionItemType.Choice;
  answerItems: QuestionItems = new ChoiceQuestionItems();
  uploadImageQuestionType: string = '';
  sentencesImageUrl: string = '';
  answerImageUrl: string = '';
  surveyFormId: string = '';
  //20210209 설문 추가
  visible: boolean = false;
  //onlyUI
  expended: boolean = false;

  constructor(question?: QuestionModel) {
    //
    super();
    if (question) {
      //
      const sequence = (question.sequence && new SequenceModel(question.sequence)) || this.sequence;
      const sentences = (question.sentences && new LangStrings(question.sentences)) || this.sentences;
      Object.assign(this, { ...question, sequence, sentences });

      switch (this.questionItemType) {
        case QuestionItemType.Criterion:
          this.answerItems = new CriterionQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Choice:
          this.answerItems = new ChoiceQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Essay:
          this.answerItems = new EssayQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Date:
          this.answerItems = new DateQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Boolean:
          this.answerItems = new BooleanQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Matrix:
          this.answerItems = new MatrixQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Review:
          this.answerItems = new ReviewQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Choice:
          this.answerItems = new ChoiceQuestionItems(question.answerItems);
          break;
        case QuestionItemType.Review:
          this.answerItems = new ReviewQuestionItems(question.answerItems);
          break;
        case QuestionItemType.ChoiceFixed:
          this.answerItems = new ChoiceFixedQuestionItems(question.answerItems);
          break;
      }
    }
  }

  @computed
  get sentence() {
    if (this.sentences && this.sentences.langStringMap) {
      return this.sentences.langStringMap.get(this.sentences.defaultLanguage) || '';
    }
    return '';
  }

  getSentence(lang: string) {
    if (this.sentences && this.sentences.langStringMap) {
      return this.sentences.langStringMap.get(lang) || '';
    }
    return '';
  }

  static getNameValueList(question: QuestionModel) {
    const nameValues = [];
    const answerItems = question.answerItems;
    if (question.questionItemType === QuestionItemType.Choice && answerItems instanceof ChoiceQuestionItems) {
      answerItems.items = answerItems.items.map(
        (item: NumberValue, index) =>
          new NumberValue({
            number: `${index + 1}`,
            values: item.values,
          })
      );
    }

    if (question.questionItemType === QuestionItemType.Choice) {
      (answerItems as ChoiceQuestionItems).items.forEach((nameValues) => {
        (nameValues as any).values.defaultLanguage = 'ko';
      });
    }
    if (question.questionItemType === QuestionItemType.Matrix) {
      (answerItems as any).rowItems.forEach((nameValues: any) => {
        (nameValues as any).values.defaultLanguage = 'ko';
      });
      (answerItems as any).columnItems.forEach((nameValues: any) => {
        (nameValues as any).values.defaultLanguage = 'ko';
      });
    }

    nameValues.push({
      name: 'sequence',
      value: JSON.stringify(question.sequence),
    });
    nameValues.push({
      name: 'sentences',
      value: JSON.stringify(question.sentences),
    });
    nameValues.push({
      name: 'optional',
      value: JSON.stringify(question.optional),
    });
    nameValues.push({
      name: 'answerItems',
      value: JSON.stringify(answerItems),
    });
    nameValues.push({
      name: 'sentencesImageUrl',
      value: question.sentencesImageUrl,
    });
    nameValues.push({
      name: 'questionItemType',
      value: question.questionItemType,
    });

    nameValues.push({
      name: 'visible',
      value: JSON.stringify(question.visible),
    });

    return { nameValues };
  }

  asCdo() {
    return {
      audienceKey: 'r2p8-r@nea-m5-c5',
      sequence: this.sequence,
      sentence: {
        lang: 'ko',
        string: this.sentences.langStringMap.get('ko') || '',
      },
      optional: this.optional,
      visible: this.visible,
      questionItemType: this.questionItemType,
      surveyFormId: this.surveyFormId,
    } as QuestionCdoModel;
  }

  static asFlowCdo(question: QuestionModel): QuestionFlowCdoModel {
    question.sentences.defaultLanguage = 'ko';
    return {
      sequence: question.sequence,
      sentences: question.sentences,
      optional: question.optional,
      visible: question.visible,
      questionItemType: question.questionItemType,
      answerItemsJson: JSON.stringify(question.answerItems),
      sentencesImageUrl: question.sentencesImageUrl,
    };
  }
}

decorate(QuestionModel, {
  sequence: observable,
  sentences: observable,
  optional: observable,
  visible: observable,
  questionItemType: observable,
  answerItems: observable,
  sentencesImageUrl: observable,
  answerImageUrl: observable,
  surveyFormId: observable,
  expended: observable,
  uploadImageQuestionType: observable,
});
