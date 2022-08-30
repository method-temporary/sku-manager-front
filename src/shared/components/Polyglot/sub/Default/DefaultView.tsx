import React from 'react';
import PolyglotContext from '../../context/PolyglotContext';
import { Form, Radio } from 'semantic-ui-react';
import { getLanguageType } from '../../model/LanguagesType';
import LangSupport from '../../model/LangSupport';

interface Props {
  onChangeProps: (name: string, e: any) => void;
  readOnly?: boolean;
}

class DefaultView extends React.Component<Props> {
  //

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  onChangeProps(value: LangSupport, name: string) {
    //
    const { languages } = this.context;
    const { onChangeProps } = this.props;

    const copiedLanguages = languages.map((target) => new LangSupport({ lang: target.lang, defaultLang: false }));

    const langSupport = new LangSupport({ ...value, defaultLang: true });
    const index = copiedLanguages.findIndex((target) => target.lang === langSupport.lang);
    copiedLanguages.splice(index, 1, langSupport);

    onChangeProps(name, copiedLanguages);
  }

  render() {
    //
    const { languages } = this.context;
    const { readOnly } = this.props;

    return (
      <Form.Group>
        {languages.map((langSupport, index) => {
          const language = getLanguageType(langSupport.lang);
          if (!language) {
            return null;
          }
          return (
            <Form.Field
              key={index}
              label={language.text}
              control={Radio}
              checked={langSupport.defaultLang}
              onChange={() => this.onChangeProps(langSupport, 'langSupports')}
              disabled={readOnly}
            />
          );
        })}
      </Form.Group>
    );
  }
}

export default DefaultView;
