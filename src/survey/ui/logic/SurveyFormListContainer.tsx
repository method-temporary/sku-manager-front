import React from 'react';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { PageTitle } from 'shared/components';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { SurveyFormService } from '../../index';
import SurveyFormListView from '../view/SurveyFormListView';
import { learningManagementUrl } from '../../../Routes';
import CopySurveyModal from './CopySurveyModal';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  //
  sharedService?: SharedService;
  surveyFormService?: SurveyFormService;
}

interface States {
  pageIndex: number;
}

@inject('sharedService', 'surveyFormService')
@reactAutobind
@observer
class SurveyFormListContainer extends React.Component<Props, States> {
  //
  breadcrumb = [
    { key: 'Home', content: 'HOME', active: false, link: true },
    { key: 'Learning', content: 'Learning 관리', link: true },
    { key: 'Survey', content: 'Survey 관리', active: false, link: true },
    { key: 'SurveyCase', content: 'Survey 관리', active: true },
  ];

  constructor(props: Props) {
    super(props);
    this.state = {
      pageIndex: 0,
    };
  }

  componentDidMount(): void {
    const { surveyFormService } = this.props;
    let currentPage = 0;
    if (surveyFormService) {
      currentPage = surveyFormService.surveyFormQuery.currentPage;
    }
    this.findAllSurveyFormsByQuery(currentPage);
    this.countAllSurveyForms();
  }

  componentWillUnmount(): void {
    this.clearSurveyQueryProps();
  }

  findAllSurveyFormsByQuery(page?: number) {
    const { sharedService, surveyFormService } = this.props;
    const { surveyFormQuery } = this.props.surveyFormService || ({} as SurveyFormService);
    if (sharedService && surveyFormService) {
      surveyFormService.changeSurveyFormQueryProp('finalCopy', false);
      let offset = 0;
      if (page) {
        sharedService.setPage('surveyForms', page);
        offset = (page - 1) * surveyFormQuery.limit;
        surveyFormService.changeSurveyFormQueryProp('currentPage', page);
      } else sharedService.setPageMap('surveyForms', 0, surveyFormQuery.limit);

      surveyFormService.changeSurveyFormQueryProp('offset', offset);
      surveyFormService
        .findAllSurveyFormsByQuery()
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * 20 });
        })
        .then(() => sharedService.setCount('surveyForms', surveyFormService.surveyFormsList.totalCount));
    }
  }

  countAllSurveyForms() {
    //
    const { surveyFormService } = this.props;
    if (surveyFormService) surveyFormService!.countAllSurveyForms();
  }

  clearSurveyQueryProps() {
    const { surveyFormService } = this.props;
    if (surveyFormService) surveyFormService.clearSurveyFormQueryProps();
  }

  handleSelectSurveyForm(surveyFormId: string) {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${learningManagementUrl}/surveys/${surveyFormId}`
    );
  }

  handlePageChange(page: number) {
    this.props.sharedService!.setPage('surveyForms', page);
    this.props.surveyFormService!.findSurveyForms(this.props.sharedService!.pageMap.get('surveyForms'));
  }

  handleChangeSurveyFormLangString(prop: string, lang: string, string: string) {
    this.props.surveyFormService!.changeSurveyFormLangStringProp(prop, lang, string);
  }

  changeSurveyFormQueryProp(name: string, value: string | Moment | number) {
    const { surveyFormService } = this.props;
    if (surveyFormService) {
      surveyFormService.changeSurveyFormQueryProp(name, value);
    }
  }

  render() {
    const { pageMap } = this.props.sharedService!;
    const { pageIndex } = this.state;
    const { surveyFormsList } = this.props.surveyFormService || ({} as SurveyFormService);
    const { surveyFormQuery, copySurveyModalOpen, changeCopySurveyModalOpen, copySurveyModalShow } =
      this.props.surveyFormService || ({} as SurveyFormService);

    return (
      <Container fluid className="survey-style">
        <PageTitle breadcrumb={this.breadcrumb} />

        <SearchBox
          onSearch={this.findAllSurveyFormsByQuery}
          onChangeQueryProps={this.changeSurveyFormQueryProp}
          onClearQueryProps={this.clearSurveyQueryProps}
          queryModel={surveyFormQuery}
          searchWordOption={SelectType.searchSurvey}
          collegeAndChannel={false}
          defaultPeriod={2}
        >
          {/* <SearchBoxFieldView
            fieldTitle="상태"
            fieldOption={addSelectTypeBoxAllOption(SelectType.designState)}
            onChangeQueryProps={this.changeSurveyFormQueryProp}
            targetValue={(surveyFormQuery && surveyFormQuery.designState) || '전체'}
            queryFieldName="designState"
          /> */}
        </SearchBox>
        <SurveyFormListView
          surveyFormsList={surveyFormsList}
          pageMap={pageMap}
          pageIndex={pageIndex}
          onSelectSurveyForm={this.handleSelectSurveyForm}
          changeCopySurveyModalOpen={changeCopySurveyModalOpen}
          copySurveyModalOpen={copySurveyModalOpen}
          copySurveyModalShow={copySurveyModalShow}
          onPageChange={this.findAllSurveyFormsByQuery}
        />
        {copySurveyModalOpen && (
          <CopySurveyModal
            open={copySurveyModalOpen}
            show={changeCopySurveyModalOpen}
            findAllSurveyFormsByQuery={this.findAllSurveyFormsByQuery}
            onChangeSurveyFormLangStringProp={this.handleChangeSurveyFormLangString}
          />
        )}
      </Container>
    );
  }
}

export default withRouter(SurveyFormListContainer);
