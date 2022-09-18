import React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable, Polyglot } from 'shared/components';
import { LangSupport } from 'shared/components/Polyglot';

import { SurveyFormModel } from '../../../form/model/SurveyFormModel';
import SurveyFormService from '../../../form/present/logic/SurveyFormService';

interface Props {
  readonly: boolean;
}

@observer
@reactAutobind
export default class SurveyFormLanguageView extends React.Component<Props> {
  //

  changeSurveyQueryProps(name: string, e: LangSupport[]) {
    const { readonly } = this.props;
    if (readonly) {
      return;
    }
    SurveyFormService.instance.changeSurveyFormProp(name as keyof SurveyFormModel, e);
  }

  render() {
    const { readonly } = this.props;

    return (
      <FormTable title="">
        <FormTable.Row name="편집 중인 언어">
          <Polyglot.Languages onChangeProps={this.changeSurveyQueryProps} readOnly={readonly} />
        </FormTable.Row>
        {/* <FormTable.Row name="기본 언어">
          <Polyglot.Default onChangeProps={this.changeSurveyQueryProps} readOnly={readonly} />
        </FormTable.Row> */}
      </FormTable>
    );
  }
}
