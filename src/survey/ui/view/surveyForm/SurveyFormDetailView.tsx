import React from 'react';
import { reactAutobind } from '@nara.platform/accent';
import { observer } from 'mobx-react';
import { Checkbox, Form, Icon, InputOnChangeData, Table } from 'semantic-ui-react';
import CriterionCreationView from '../criterion/CriterionCreationView';
import { SurveyFormModel } from '../../../form/model/SurveyFormModel';

interface Props {
  lang: string;
  surveyForm: SurveyFormModel;
  onChangeSurveyFormProp: (prop: keyof SurveyFormModel, value: any) => void;
  onChangeSurveyFormLangStringProp: (prop: string, language: string, value: string) => void;
  onCreateCriterion: () => void;
  onChangeCriterion: (number: string, prop: string, value: any) => void;
  onChangeCriterionLangString: (number: string, prop: string, lang: string, string: string) => void;
  calculateCriterionItems: (number: string) => void;
}

@observer
@reactAutobind
export default class SurveyFormDetailView extends React.Component<Props> {
  //
  handleChangeTitle(event: any, data: InputOnChangeData) {
    //
    this.props.onChangeSurveyFormLangStringProp('titles', this.props.lang, data.value);
  }

  render() {
    const {
      lang,
      surveyForm,
      onChangeSurveyFormProp,
      onCreateCriterion,
      onChangeCriterion,
      onChangeCriterionLangString,
      calculateCriterionItems,
    } = this.props;

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              설문조사양식 기본정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">제목</Table.Cell>
            <Table.Cell>
              <Form.Input
                maxLength={100}
                fluid
                value={surveyForm.titles.langStringMap.get(this.props.lang) || ''}
                onChange={this.handleChangeTitle}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">
              척도
              <Icon name="plus" size="small" link circular onClick={onCreateCriterion} style={{ marginLeft: '1rem' }} />
            </Table.Cell>
            <Table.Cell>
              <CriterionCreationView
                lang={lang}
                criterionList={surveyForm.criterionList}
                supportedLanguages={surveyForm.supportedLanguages}
                onChangeCriterion={onChangeCriterion}
                onChangeCriterionLangString={onChangeCriterionLangString}
                calculateCriterionItems={calculateCriterionItems}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">결과보기 공개 여부</Table.Cell>
            <Table.Cell>
              <Form.Field
                control={Checkbox}
                checked={surveyForm.userViewResult}
                onChange={(e: any, data: any) => onChangeSurveyFormProp('userViewResult', data.checked)}
                style={{ float: 'left' }}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}
