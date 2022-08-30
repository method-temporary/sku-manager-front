import React from 'react';
import { PolyglotModel } from '../../../../model';
import PolyglotContext from '../../context/PolyglotContext';
import { getLanguageType, LanguageTypes } from '../../model/LanguagesType';
import { Menu, Tab, TabProps } from 'semantic-ui-react';
import HtmlEditor, { HtmlEditorProps } from '../../../../ui/view/HtmlEditor';
import SelectType from '../../../../model/SelectType';
import { getLanguageValue, Language } from '../../model/Language';
import { getPolyglotToString, isPolyglotEmpty } from '../../logic/PolyglotLogic';
import LangSupport from '../../model/LangSupport';

interface States {
  activeTabIndex: number;
  activeTabLang: string;
  supportsLanguages: LangSupport[];
}

interface Props extends HtmlEditorProps {
  name: any;
  languageStrings: PolyglotModel;
  onChangeProps?: (name: any, value: any) => void;
  maxLength?: number;
  oneLanguage?: Language.Ko | Language.En | Language.Zh;
  disabledTab?: boolean;
  height?: number;
}

class EditorView extends React.Component<Props, States> {
  //
  HTMLEditorQuillRefs: any[] = [];

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeTabIndex: LanguageTypes[0].indexingId,
      activeTabLang: '',
      supportsLanguages: [],
    };
  }

  static defaultProps = {
    maxLength: 0,
  };

  componentDidMount() {
    //
    const { names } = this.context;
    names.push(this.props.name);

    this.setActiveDefaultLanguage();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<States>, snapshot?: any) {
    const { languages } = this.context;
    if (
      this.state.supportsLanguages !== languages &&
      JSON.stringify(this.state.supportsLanguages) !== JSON.stringify(languages)
    ) {
      //
      this.setActiveDefaultLanguage();
    }
  }

  setHtmlEditorLengthLimit() {
    //
    const { maxLength = 0 } = this.props;

    if (!this.props.readOnly && maxLength && this.HTMLEditorQuillRefs) {
      this.HTMLEditorQuillRefs.filter((ref) => ref !== null).forEach((ref) => {
        const targetQuillEditor = ref.getEditor();
        targetQuillEditor.on('text-change', (delta: { ops: any }, old: any, source: any) => {
          const charLen = targetQuillEditor.getLength();
          if (charLen > maxLength) {
            targetQuillEditor.deleteText(maxLength, charLen);
          }
        });
      });
    }
  }

  setActiveDefaultLanguage() {
    const { oneLanguage } = this.props;
    const { languages } = this.context;

    let activeIndex = 0;
    // oneLanguage 선택시
    if (oneLanguage) {
      activeIndex = languages.findIndex((language) => language.lang === oneLanguage);
    }

    const activeLanguage = languages[activeIndex];
    this.setState({ supportsLanguages: languages, activeTabIndex: activeIndex });

    if (this.state.activeTabLang !== activeLanguage?.lang) {
      this.setState({ activeTabLang: (activeLanguage && activeLanguage.lang) || Language.Ko });
    }
  }

  defaultOnchange(lang: Language, nextValue: any): void {
    //
    const { activeTabIndex, activeTabLang } = this.state;
    const { languageStrings, name, onChangeProps } = this.props;

    if (onChangeProps) {
      const copiedValue = new PolyglotModel(languageStrings);
      if (activeTabLang != lang) {
        return;
      }

      const key = getLanguageValue(lang);
      copiedValue.setValue(key, nextValue);
      onChangeProps(name, copiedValue);
    }
  }

  getPanes(): any[] {
    //
    const { languages } = this.context;
    const { languageStrings, placeholder, readOnly, disabledTab, height } = this.props;
    const { activeTabIndex, activeTabLang } = this.state;
    const panes: any[] = [];
    languages.forEach((language) => {
      //
      const languageType = getLanguageType(language.lang);
      if (!languageType) {
        return;
      }

      // disabled 선택시
      let disabled = false;
      if (disabledTab && activeTabLang !== language.lang) {
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
            <HtmlEditor
              quillRef={(el: any) => {
                this.HTMLEditorQuillRefs[activeTabIndex] = el;
              }}
              modules={SelectType.modules}
              formats={SelectType.formats}
              placeholder={!readOnly ? placeholder : ''}
              value={getPolyglotToString(languageStrings, language.lang)}
              onChange={(html) => this.defaultOnchange(language.lang, html === '<p><br></p>' ? '' : html)}
              readOnly={readOnly}
              // editorId={'categoryEditor'}
            />
          </Tab.Pane>
        ),
      });
    });
    return panes;
  }

  render() {
    const { oneLanguage } = this.props;
    const { activeTabIndex, activeTabLang } = this.state;
    //
    this.setHtmlEditorLengthLimit();

    // oneLanguage 선택시
    let nullComponent = false;
    if (
      oneLanguage &&
      activeTabLang &&
      (oneLanguage !== activeTabLang || (oneLanguage === activeTabLang && activeTabIndex === -1))
    ) {
      nullComponent = true;
    }

    return (
      <>
        {(this.props.readOnly && isPolyglotEmpty(this.props.languageStrings)) || nullComponent ? null : (
          <Tab
            panes={this.getPanes()}
            activeIndex={this.state.activeTabIndex}
            onTabChange={(_: any, data: TabProps) => {
              this.setState({ activeTabIndex: data.activeIndex as number });
              this.setState({ activeTabLang: data.panes![data.activeIndex as number].menuItem.key });
            }}
          />
        )}
      </>
    );
  }
}

export default EditorView;
