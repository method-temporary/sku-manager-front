import React from 'react';
import { Form, Input, Menu, Tab, TabProps } from 'semantic-ui-react';
import PolyglotContext from '../../context/PolyglotContext';
import { getLanguageType } from '../../model/LanguagesType';
import { PolyglotModel } from '../../../../model/PolyglotModel';
import { getPolyglotToString, isPolyglotEmpty } from '../../logic/PolyglotLogic';
import LangSupport from '../../model/LangSupport';
import { DepotFileViewModel, FileBox, PatronKey, PatronType, ValidationType } from '@nara.drama/depot';

interface FileBoxProps {
  id?: string;
  vaultKey?: PatronKey;
  patronKey?: PatronKey;
  validations?: {
    type: ValidationType;
    validValue?: any;
    validator?: (file: File, depotFiles: DepotFileViewModel[] | undefined) => {};
  }[];
  options?: { title?: string; useMyDrive?: boolean; readonly?: boolean };
  onChange?: (id: string) => void;
  fileBoxId?: string;
}

interface Props extends FileBoxProps {
  name: any;
  titleName: string;
  languageStrings: PolyglotModel;
  titleLanguageStrings: PolyglotModel;
  onChangeProps?: (name: any, value: any) => void;
  readOnly?: boolean;
  desc?: React.ReactNode;
}

interface States {
  activeTabIndex: number;
  supportsLanguages: LangSupport[];
}

class PisAgreement extends React.Component<Props, States> {
  //
  activeTabIndexRef: number = 0;

  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  constructor(props: Props) {
    super(props);

    this.state = {
      activeTabIndex: 0,
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
    const { languages } = this.context;
    this.setState({ supportsLanguages: languages, activeTabIndex: 0 });
  }

  defaultOnchange(key: string, deportId: any): void {
    //
    const { languageStrings, name, onChangeProps } = this.props;

    if (onChangeProps) {
      const copiedValue = new PolyglotModel(languageStrings);
      copiedValue.setValue(key, deportId || '');
      onChangeProps(name, copiedValue);
    }
  }

  defaultTitleOnchange(nextValue: string, lang: any): void {
    //
    const { titleLanguageStrings, titleName, onChangeProps } = this.props;

    if (onChangeProps) {
      const copiedValue = new PolyglotModel(titleLanguageStrings);
      copiedValue.setValue(lang, nextValue || '');
      onChangeProps(titleName, copiedValue);
    }
  }

  getPanes(): any[] {
    //
    const { languages } = this.context;
    const { languageStrings, readOnly, validations, titleLanguageStrings } = this.props;
    const panes: any[] = [];

    languages.forEach((language) => {
      //
      const languageType = getLanguageType(language.lang);
      if (!languageType) {
        return;
      }
      panes.push({
        menuItem: <Menu.Item key={language.lang}>{languageType.text}</Menu.Item>,
        render: () => (
          <Tab.Pane className="none-styled">
            {/*<Input name={titleName} languageStrings={titleLanguageStrings} onChange={onChangeProps} />*/}
            <Form.Field
              control={Input}
              width={16}
              label="서약 제목"
              value={getPolyglotToString(titleLanguageStrings, language.lang)}
              onChange={(e: any) => this.defaultTitleOnchange(e.target.value, language.lang)}
              disabled={readOnly}
            />

            <FileBox
              options={{ readonly: readOnly }}
              id={languageStrings.getValue(language.lang) || undefined}
              vaultKey={{
                keyString: 'sku-depot',
                patronType: PatronType.Pavilion,
              }}
              patronKey={{
                keyString: 'sku-denizen',
                patronType: PatronType.Denizen,
              }}
              validations={validations}
              onChange={(id) => this.defaultOnchange(language.lang, id)}
              fileBoxId={`fileBox${language.lang}`}
            />
          </Tab.Pane>
        ),
      });
    });

    return panes;
  }

  render() {
    //
    const { readOnly, desc } = this.props;

    return (
      <>
        {this.props.readOnly && isPolyglotEmpty(this.props.languageStrings) ? null : (
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

        {!readOnly && desc && <>{desc}</>}
      </>
    );
  }
}

export default PisAgreement;
