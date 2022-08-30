import * as React from 'react';
import ReactQuill from 'react-quill';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Menu, Tab, TabProps } from 'semantic-ui-react';
import { getLanguageType } from '../../model/LanguagesType';
import PolyglotContext from '../../context/PolyglotContext';
import { PolyglotModel } from '../../../../model/PolyglotModel';

interface Props {
  theme: string;
  value: PolyglotModel;
  readOnly?: boolean;
}

@observer
@reactAutobind
class QuillView extends ReactComponent<Props, {}> {
  //
  static contextType = PolyglotContext;
  context!: React.ContextType<typeof PolyglotContext>;

  getPanes(): any[] {
    //
    const { languages } = this.context;
    const { value, readOnly, theme } = this.props;
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
          <Tab.Pane>
            <ReactQuill value={value.getValue(language.lang)} readOnly={readOnly} theme={theme} />
          </Tab.Pane>
        ),
      });
    });

    return panes;
  }

  render() {
    //
    return (
      <Tab
        panes={this.getPanes()}
        onTabChange={(_: any, data: TabProps) => {
          this.setState({ activeTapIndex: data.activeIndex as number });
        }}
      />
    );
  }
}

export default QuillView;
