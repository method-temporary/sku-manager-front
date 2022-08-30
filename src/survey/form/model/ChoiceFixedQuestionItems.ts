import QuestionItems from './QuestionItems';
import { NumberValue } from './NumberValue';

export class ChoiceFixedQuestionItems implements QuestionItems {
  answerType: string = 'ChoiceFixed';
  items: NumberValue[] = [];

  constructor(answerItemsApiModel?: any) {
    if (answerItemsApiModel) {
      Object.assign(this, answerItemsApiModel);
      if (answerItemsApiModel.items === undefined) {
        const langStringMap: Map<string, string> = new Map<string, string>();

        langStringMap.set('en', 'Not at all');
        langStringMap.set('ko', '전혀 아니다');
        langStringMap.set('zh', '完全不是');
        const item1 = new NumberValue();
        item1.number = '1';
        item1.values.langStringMap = langStringMap;

        langStringMap.set('en', 'Disagree');
        langStringMap.set('ko', '아니다');
        langStringMap.set('zh', '不是');
        const item2 = new NumberValue();
        item2.number = '2';
        item2.values.langStringMap = langStringMap;

        langStringMap.set('en', 'Average');
        langStringMap.set('ko', '보통이다');
        langStringMap.set('zh', '一般');
        const item3 = new NumberValue();
        item3.number = '3';
        item3.values.langStringMap = langStringMap;

        langStringMap.set('en', 'Agree');
        langStringMap.set('ko', '그렇다.');
        langStringMap.set('zh', '如此');
        const item4 = new NumberValue();
        item4.number = '4';
        item4.values.langStringMap = langStringMap;

        langStringMap.set('en', 'Highly agree');
        langStringMap.set('ko', '매우 그렇다');
        langStringMap.set('zh', '非常如此');
        const item5 = new NumberValue();
        item5.number = '5';
        item5.values.langStringMap = langStringMap;

        this.items = [item1, item2, item3, item4, item5];
      } else {
        this.items = answerItemsApiModel.items.map((item: any) => new NumberValue(item));
      }
    }
  }

  getAnswerType() {
    return this.answerType;
  }
}
