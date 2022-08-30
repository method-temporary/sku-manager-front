import React from 'react';
import { Form, Input, InputProps } from 'semantic-ui-react';
import PolyglotContext from '../../context/PolyglotContext';
import { PolyglotModel } from '../../../../model/PolyglotModel';
import { reactAutobind } from '@nara.platform/accent';
import { getLanguageType } from '../../model/LanguagesType';
import { getPolyglotToString, isPolyglotEmpty } from '../../logic/PolyglotLogic';

interface Props extends InputProps {
  languageStrings: PolyglotModel;
  name: any;
  onChangeProps?: (name: any, value: any, config?: any) => void;
  maxLength?: string;
  readOnly?: boolean;
  disabled?: boolean;
  onKeyUp?: (e: any) => void;
  config?: any;
  isHorizontal?: boolean;
}

@reactAutobind
class InputView extends React.Component<Props> {
  //
  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  componentDidMount() {
    //
    const { names } = this.context;
    names.push(this.props.name);
  }

  defaultOnchange(nextValue: string, lang: string): void {
    const { languageStrings, name, onChangeProps, config } = this.props;

    if (onChangeProps) {
      const copiedValue = new PolyglotModel(languageStrings);
      // const key = getLanguageValue(lang);
      copiedValue.setValue(lang, nextValue);
      onChangeProps(name, copiedValue, config);
    }
  }

  render() {
    //
    const { languages } = this.context;
    const {
      languageStrings,
      maxLength,
      readOnly,
      placeholder,
      className,
      disabled,
      onKeyUp,
      isHorizontal,
    } = this.props;

    const newClassName = isHorizontal ? className + ' horizontal-margin5' : className;

    return (
      <>
        {languages &&
          languages.map((language, index) => (
            <React.Fragment key={index}>
              {readOnly ? (
                <>
                  {isPolyglotEmpty(languageStrings) ? (
                    <>{index === 0 ? '-' : ''}</>
                  ) : (
                    <>
                      <span className="label">{`${getLanguageType(language.lang)?.text} : `}</span>
                      <span>{getPolyglotToString(languageStrings, language.lang)}</span>
                    </>
                  )}
                </>
              ) : (
                <>
                  {maxLength ? (
                    <div
                      className={
                        getPolyglotToString(languageStrings, language.lang).length >= Number(maxLength)
                          ? 'ui right-top-count input error'
                          : 'ui right-top-count input'
                      }
                    >
                      <span className="label">{getLanguageType(language.lang)?.text}</span>
                      <span className="count">
                        <span className="now">{getPolyglotToString(languageStrings, language.lang).length}</span>/
                        <span className="max">{maxLength}</span>
                      </span>
                      <Form.Field
                        control={Input}
                        width={isHorizontal ? 5 : 16}
                        placeholder={placeholder || ''}
                        value={getPolyglotToString(languageStrings, language.lang)}
                        onChange={(e: any) => this.defaultOnchange(e.target.value, language.lang)}
                        maxLength={maxLength}
                        className={newClassName || ''}
                        disabled={disabled}
                        onKeyUp={(e: any) => (onKeyUp ? onKeyUp(e) : {})}
                      />
                    </div>
                  ) : (
                    <Form.Field
                      key={index}
                      control={Input}
                      className={newClassName || ''}
                      width={isHorizontal ? 5 : 16}
                      label={getLanguageType(language.lang)?.text}
                      placeholder={placeholder || ''}
                      value={getPolyglotToString(languageStrings, language.lang)}
                      onChange={(e: any) => this.defaultOnchange(e.target.value, language.lang)}
                      disabled={disabled}
                      onKeyUp={(e: any) => (onKeyUp ? onKeyUp(e) : {})}
                    />
                  )}
                </>
              )}
            </React.Fragment>
          ))}
      </>
    );
  }
}

export default InputView;
