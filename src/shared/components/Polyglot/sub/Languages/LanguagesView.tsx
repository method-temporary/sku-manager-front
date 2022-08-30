import React from 'react';
import { Checkbox, Form } from 'semantic-ui-react';
import PolyglotContext from '../../context/PolyglotContext';
import { getLanguageType, LanguageTypes } from '../../model/LanguagesType';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import LangSupport from '../../model/LangSupport';

interface Props {
  readOnly?: boolean;
  onChangeProps: (name: string, e: any) => void;
}

@observer
@reactAutobind
class LanguagesView extends React.Component<Props> {
  //
  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  onChangeProps(value: LangSupport, name: string) {
    //
    const { onChangeProps } = this.props;
    const { languages, names } = this.context;

    const copiedLanguages = [...languages];

    // 선택해제
    if (copiedLanguages.some((target) => target.lang === value.lang)) {
      const index = copiedLanguages.findIndex((target) => target.lang === value.lang);
      copiedLanguages.splice(index, 1);

      names?.forEach((name) => {
        onChangeProps(`${name}.${value.lang}`, '');
      });
    } else {
      // 새로 추가 하는 Language 가 추가할 당시에 Default Language 일 가능성이 없으므로 false 로 변경하여 Push
      value.defaultLang = false;
      copiedLanguages.push(value);
    }

    // 선택된 Language 가 없으면 아무런 변경 없이 Return
    if (copiedLanguages.length < 1) {
      return;
    }

    // Languages 들 중에서 Default Languages 가 없으면 제일 첫번째의 Language 를 Default Language 로 변환
    if (copiedLanguages.filter((target) => target.defaultLang).length === 0) {
      copiedLanguages[0] && (copiedLanguages[0].defaultLang = true);
    }

    onChangeProps(
      name,
      copiedLanguages
        .sort((a, b) => {
          const valueA = getLanguageType(a.lang);
          const valueB = getLanguageType(b.lang);
          return valueA!.indexingId - valueB!.indexingId;
        })
        .map((langSupport) => langSupport)
    );
  }

  render() {
    //
    const { languages } = this.context;
    const { readOnly } = this.props;

    return (
      <Form.Group>
        {LanguageTypes.map((languageType, index) => (
          <Form.Field
            key={index}
            label={languageType.text}
            control={Checkbox}
            checked={languages.some((target) => target.lang === languageType.value.lang)}
            onChange={() => this.onChangeProps(languageType.value, 'langSupports')}
            disabled={readOnly}
          />
        ))}
      </Form.Group>
    );
  }
}

export default LanguagesView;
