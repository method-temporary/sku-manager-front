import React from 'react';
import { Form } from 'semantic-ui-react';

import { Polyglot } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { SurveyFormModel } from '../../form/model/SurveyFormModel';
import ButtonGroup from './surveyForm/ButtonGroup';
import ReadOnlyQuestionListView from './question/readonly/ReadOnlyQuestionListView';
import SurveyFormDetailReadOnlyView from './surveyForm/SurveyFormDetailReadOnlyView';
import SurveyFormLanguageView from './surveyForm/SurveyFormLanguageView';

interface State {
  lang: string;
}
interface Props {
  surveyForm: SurveyFormModel;
  onMoveToList: () => void;
}

export class SurveyFormReadOnlyView extends React.Component<Props, State> {
  //
  constructor(props: Props) {
    super(props);
    let lang = '';
    const { surveyForm } = props;
    const langSupports = Array.from(surveyForm.langSupports);
    if (Array.isArray(langSupports) && langSupports.length > 0) {
      lang = langSupports[0].lang;
    }

    this.state = {
      lang,
    };
  }

  render() {
    const { surveyForm, onMoveToList } = this.props;

    const lang = this.state.lang;

    return (
      <Polyglot languages={surveyForm.langSupports}>
        <Form>
          <SurveyFormLanguageView readonly={true} />
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

          <SurveyFormDetailReadOnlyView surveyForm={surveyForm} lang={lang} />
          <ReadOnlyQuestionListView surveyForm={surveyForm} lang={lang} />
          <ButtonGroup onBackToList={onMoveToList} />
        </div>
      </Polyglot>
    );
  }
}
