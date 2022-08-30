import React from 'react';
import { Container, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';
import { SearchBox, SearchBoxFieldView } from 'shared/ui';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import SurveyFormListView from './SurveyFormListView';
import MenuStore from '../../mobx/MenuStore';
import { SurveyFormService } from '../../../../survey';

interface Props {
  //
  sharedService?: SharedService;
  surveyFormService?: SurveyFormService;
  closeModal: () => void;
}

interface States {
  pageIndex: number;
}

@inject('sharedService', 'surveyFormService')
@reactAutobind
@observer
class SurveyFormListContainer extends React.Component<Props, States> {
  //

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

  findAllSurveyFormsByQuery(page?: number) {
    const { sharedService, surveyFormService } = this.props;
    const { surveyFormQuery } = this.props.surveyFormService || ({} as SurveyFormService);

    surveyFormQuery.limit = 10;
    if (sharedService && surveyFormService) {
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

  changeSurveyFormQueryProp(name: string, value: string | Moment | number) {
    const { surveyFormService } = this.props;
    if (surveyFormService) {
      surveyFormService.changeSurveyFormQueryProp(name, value);
    }
  }

  onSelect(id: string, title: string, creatorName: string) {
    const { closeModal } = this.props;
    const menuStore = MenuStore.instance;
    menuStore.setSurveyId(id);
    menuStore.setSurveyTitle(title);
    menuStore.setSurveyCreatorName(creatorName);
    closeModal();
  }

  render() {
    const { pageMap } = this.props.sharedService!;
    const { pageIndex } = this.state;
    const { surveyFormsList } = this.props.surveyFormService || ({} as SurveyFormService);
    const { surveyFormQuery } = this.props.surveyFormService || ({} as SurveyFormService);
    const { closeModal } = this.props;

    return (
      <Container fluid className="survey-style">
        <SearchBox
          onSearch={this.findAllSurveyFormsByQuery}
          onChangeQueryProps={this.changeSurveyFormQueryProp}
          onClearQueryProps={this.clearSurveyQueryProps}
          queryModel={surveyFormQuery}
          searchWordOption={SelectType.searchSurvey}
          collegeAndChannel={false}
          defaultPeriod={2}
        >
          <SearchBoxFieldView
            fieldTitle="상태"
            fieldOption={addSelectTypeBoxAllOption(SelectType.designState)}
            onChangeQueryProps={this.changeSurveyFormQueryProp}
            targetValue={(surveyFormQuery && surveyFormQuery.designState) || '전체'}
            queryFieldName="designState"
          />
        </SearchBox>
        <SurveyFormListView
          results={surveyFormsList.results}
          totalCount={surveyFormsList.totalCount}
          pageMap={pageMap}
          pageIndex={pageIndex}
          onPageChange={this.findAllSurveyFormsByQuery}
          onSelect={this.onSelect}
        />
        <div className="fl-right btn-group">
          <Button onClick={closeModal} className="w190 d">
            닫기
          </Button>
        </div>
      </Container>
    );
  }
}

export default SurveyFormListContainer;
