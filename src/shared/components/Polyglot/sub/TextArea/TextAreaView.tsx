import React from 'react';
import { Menu, Tab, TabProps, TextArea, TextAreaProps } from 'semantic-ui-react';
import PolyglotContext from '../../context/PolyglotContext';
import { getLanguageType, LanguageTypes } from '../../model/LanguagesType';
import { PolyglotModel } from '../../../../model/PolyglotModel';
import { isPolyglotEmpty } from '../../logic/PolyglotLogic';
import LangSupport from '../../model/LangSupport';
import { Language } from '../../model/Language';

interface Props extends TextAreaProps {
  name: any;
  languageStrings: PolyglotModel;
  onChangeProps?: (name: any, value: any) => void;
  maxLength?: number;
  readOnly?: boolean;
  oneLanguage?: Language.Ko | Language.En | Language.Zh;
  disabledTab?: boolean;
}

interface States {
  activeTabIndex: number;
  activeTabLang: string;
  supportsLanguages: LangSupport[];
}

class TextAreaView extends React.Component<Props, States> {
  //
  activeTabIndexRef: number = 0;

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
      activeTabLang: '',
      supportsLanguages: [],
    };
  }

  componentDidMount() {
    //
    const { names } = this.context;
    names.push(this.props.name);
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<States>, snapshot?: any) {
    const { languages } = this.context;

    if (this.state.supportsLanguages !== languages) {
      //
      this.setActiveLanguage();
    }
  }

  setActiveLanguage() {
    const { oneLanguage } = this.props;
    const { languages } = this.context;

    let activeIndex = 0;
    // oneLanguage 선택시
    if (oneLanguage) {
      activeIndex = languages.findIndex((language) => language.lang === oneLanguage);
    }

    this.setState({ supportsLanguages: languages, activeTabIndex: activeIndex });

    const activeLanguage = languages[activeIndex];
    if (this.state.activeTabLang !== activeLanguage?.lang) {
      this.setState({ activeTabLang: (activeLanguage && activeLanguage.lang) || Language.Ko });
    }
  }

  defaultOnchange(key: string, nextValue: any): void {
    //
    const { languageStrings, name, onChangeProps } = this.props;

    if (onChangeProps) {
      const copiedValue = new PolyglotModel(languageStrings);
      copiedValue.setValue(key, nextValue === '<p><br></p>' ? '' : nextValue);
      onChangeProps(name, copiedValue);
    }
  }

  getPanes(): any[] {
    //
    const { languages } = this.context;
    const { placeholder, languageStrings, maxLength, readOnly, disabledTab } = this.props;
    const { activeTabLang } = this.state;
    const panes: any[] = [];

    languages.forEach((language) => {
      //
      const languageType = getLanguageType(language.lang);
      if (!languageType) {
        return;
      }

      // disabled 선택시
      let disabled = false;
      if (disabledTab && activeTabLang && activeTabLang !== language.lang) {
        disabled = true;
      }

      panes.push({
        menuItem: (
          <Menu.Item disabled={disabled} key={language.lang}>
            {languageType.text}
          </Menu.Item>
        ),
        render: () => (
          <Tab.Pane className="none-styled">
            {maxLength && !readOnly ? (
              <div
                className={
                  languageStrings.getValue(language.lang).length >= maxLength
                    ? 'ui right-top-count input error'
                    : 'ui right-top-count input'
                }
              >
                <span className="count">
                  <span className="now">{languageStrings.getValue(language.lang).length}</span>/
                  <span className="max">{maxLength}</span>
                </span>
                <TextArea
                  placeholder={placeholder || ''}
                  value={languageStrings.getValue(language.lang)}
                  onChange={(e: any) => this.defaultOnchange(language.lang, e.target.value)}
                  maxLength={maxLength}
                  rows={3}
                />
              </div>
            ) : (
              <TextArea
                placeholder={readOnly ? '' : placeholder}
                value={languageStrings.getValue(language.lang)}
                onChange={(e: any) => this.defaultOnchange(language.lang, e.target.value)}
                readOnly={readOnly}
                rows={3}
              />
            )}
          </Tab.Pane>
        ),
      });
    });

    return panes;
  }

  render() {
    const { oneLanguage } = this.props;
    const { activeTabIndex, activeTabLang } = this.state;

    // oneLanguage 선택시
    let nullComponent = false;
    if (
      oneLanguage &&
      activeTabLang &&
      (oneLanguage !== activeTabLang || (oneLanguage === activeTabLang && activeTabIndex === -1))
    ) {
      nullComponent = true;
    }

    //
    return (
      <>
        {(this.props.readOnly && isPolyglotEmpty(this.props.languageStrings)) || nullComponent ? null : (
          <Tab
            // activeIndex={getLanguageType(defaultLanguage)?.indexingId}
            panes={this.getPanes()}
            activeIndex={this.state.activeTabIndex}
            onTabChange={(_: any, data: TabProps) => {
              this.activeTabIndexRef = data.activeIndex as number;
              this.setState({ activeTabIndex: data.activeIndex as number });
            }}
          />
        )}
      </>
    );
  }
}

export default TextAreaView;
