import React from 'react';
import { inject } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { PolyglotModel } from '../../../../model/PolyglotModel';
import PolyglotContext from '../../context/PolyglotContext';
import { getLanguageType, LanguageTypes } from '../../model/LanguagesType';
import { Menu, Tab, TabProps } from 'semantic-ui-react';
import { getLanguageValue, Language } from '../../model/Language';
import { getPolyglotToString, isPolyglotEmpty } from '../../logic/PolyglotLogic';
import CrossEditor from '../../../CrossEditor';
import CrossEditorService from '../../../CrossEditor/present/logic/CrossEditorService';
import PolyglotService from '../../logic/PolyglotService';

interface Props {
  id: string;
  name: string;
  onChangeProps: (name: any, value: any) => void;
  languageStrings: PolyglotModel;
  oneLanguage?: Language.Ko | Language.En | Language.Zh;
  disabledTab?: boolean;
  readonly?: boolean;
}

interface States {
  activeTabIndex: number;
  activeTabLang: string;
}

interface Injected {
  crossEditorService: CrossEditorService;
  polyglotService: PolyglotService;
}

@inject('crossEditorService', 'polyglotService')
@reactAutobind
class CrossEditorView extends ReactComponent<Props, States, Injected> {
  //
  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeTabIndex: LanguageTypes[0].indexingId,
      activeTabLang: Language.Ko,
    };

    this.injected.polyglotService.setActiveLan(this.props.id, Language.Ko);
  }

  componentWillUnmount() {
    //
    this.injected.polyglotService.removeActiveLan(this.props.id);
  }

  getPanes(): any[] {
    //
    const { languages } = this.context;
    const { id, languageStrings, readonly, disabledTab } = this.props;
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
            <CrossEditor id={id} value={getPolyglotToString(languageStrings, language.lang)} readonly={readonly} />
          </Tab.Pane>
        ),
      });
    });
    return panes;
  }

  onTabChange(_: any, data: TabProps) {
    //
    const { crossEditorService } = this.injected;
    const { id, languageStrings, name, onChangeProps } = this.props;
    const { activeTabLang } = this.state;
    const prevActiveTabLang = this.state.activeTabLang;
    const nextActiveTabLang = data.panes![data.activeIndex as number].menuItem.key;

    if (onChangeProps) {
      const nextValue = crossEditorService.getCrossEditorBodyValue(id);
      const copiedValue = new PolyglotModel(languageStrings);
      if (activeTabLang != prevActiveTabLang) {
        return;
      }

      const key = getLanguageValue(prevActiveTabLang);
      copiedValue.setValue(key, nextValue === '<p><br /></p>' ? '' : nextValue);
      onChangeProps(name, copiedValue);

      crossEditorService.setCrossEditorBodyValue(id, languageStrings.getValue(getLanguageValue(nextActiveTabLang)));
      crossEditorService.setCrossEditorFocus(id);
    }

    this.setState({ activeTabIndex: data.activeIndex as number });
    this.setState({ activeTabLang: nextActiveTabLang });

    this.injected.polyglotService.setActiveLan(id, nextActiveTabLang);
  }

  render() {
    const { oneLanguage } = this.props;
    const { activeTabIndex, activeTabLang } = this.state;
    //
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
      <div>
        {(this.props.readonly && isPolyglotEmpty(this.props.languageStrings)) || nullComponent ? null : (
          <Tab panes={this.getPanes()} activeIndex={this.state.activeTabIndex} onTabChange={this.onTabChange} />
        )}
      </div>
    );
  }
}

export default CrossEditorView;
