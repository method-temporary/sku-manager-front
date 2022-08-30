import React from 'react';
import { Header } from 'semantic-ui-react';
import { QuestionModel } from '../../../../form/model/QuestionModel';
import { SequenceModel } from '../../../../form/model/SequenceModel';
import { EssayQuestionItems } from '../../../../form/model/EssayQuestionItems';
import Image from 'shared/components/Image';

interface Props {
  lang: string;
  question: QuestionModel;
  questionSequences: SequenceModel[];
}

export class ReadOnlyEssayQuestionTabPaneView extends React.Component<Props> {
  //
  render() {
    const { question, lang } = this.props;

    return (
      <>
        <Header size="tiny">질문</Header>
        {question.sentences.langStringMap.get(lang)}
        {question.sentencesImageUrl ? (
          <div>
            <Image src={question.sentencesImageUrl} className="img-list" />
          </div>
        ) : null}
        <Header size="tiny">최대 글자수</Header>
        {(question.answerItems as EssayQuestionItems).maxLength}
      </>
    );
  }
}
