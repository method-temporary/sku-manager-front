/* eslint-disable */
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Breadcrumb, Container, Header, Pagination } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';
import { SearchBoxFieldView } from 'shared/ui';

import { serviceManagementUrl } from 'Routes';
import ResultMailService from 'resultSendMail/present/logic/ResultMailService';
import ResultSendMailListView from '../../ui/view/ResultSendMailListView';
import SearchBox from './SearchBox';

interface Props extends RouteComponentProps<{ cineroomId: string }> {
  resultMailService?: ResultMailService;
  sharedService?: SharedService;
}

interface States {
  pageIndex: number;
}

@inject('resultMailService', 'sharedService')
@observer
@reactAutobind
class ResultsSendMailContainer extends React.Component<Props, States> {
  //
  constructor(props: Props) {
    super(props);
    this.state = { pageIndex: 0 };
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    const { resultMailService } = this.props;
    if (resultMailService) resultMailService.clearResultMailModel();
  }

  init() {
    const { resultMailService } = this.props;
    let currentPage = 0;
    if (resultMailService) currentPage = resultMailService.resultMailQuery.currentPage;
    if (resultMailService) {
      this.findAllResultMail(currentPage);
    }
  }

  findAllResultMail(page?: number) {
    const { sharedService, resultMailService } = this.props;
    if (sharedService && resultMailService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('resultMailModel', page);
        offset = (page - 1) * resultMailService.resultMailQuery.limit;
        resultMailService.changeResultMailQueryProps('currentPage', page);
      } else sharedService.setPageMap('resultMailModel', 0, resultMailService.resultMailQuery.limit);

      resultMailService.changeResultMailQueryProps('offset', offset);

      resultMailService
        .findAllResultMail()
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * 20 });
        })
        .then(() => sharedService.setCount('resultMailModel', resultMailService.resultMailModels.totalCount));
    }
  }

  hadleSendMail() {
    // 메일보내기 file upload
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/result-mail/send-mail?activeItem=result-mail`
    );
  }

  // 상세를 팝업으로 바꾸면서 사용하지 않음.
  handleClickRow(sendId: string) {
    //
    const { resultMailService } = this.props;
    if (resultMailService) {
      resultMailService.setSendId(sendId);
      resultMailService.findResultMail(sendId).then(() => {
        this.props.history.push(
          `/cineroom/${this.props.match.params.cineroomId}/${serviceManagementUrl}/boards/result-mail/detail`
        );
      });
    }
  }

  onChangeResultMailQueryProps(name: string, value: string | Moment | number) {
    const { resultMailService } = this.props;
    if (resultMailService) resultMailService.changeResultMailQueryProps(name, value);
  }

  setCountForFind(name: string, value: string) {
    //
    const { resultMailService } = this.props;
    if (resultMailService) {
      resultMailService.changeResultMailQueryProps(name, value);
      this.setState({ pageIndex: 0 });
    }

    this.findAllResultMail();
  }

  clearResultMailQueryProps() {
    //
    const { resultMailService } = this.props;
    if (resultMailService) resultMailService.clearResultMailQueryProps();
  }

  render() {
    const { resultMailModels, resultMailQuery } = this.props.resultMailService || ({} as ResultMailService);
    const result = resultMailModels.results;
    const totalCount = resultMailModels.totalCount;
    const { pageMap } = this.props.sharedService || ({} as SharedService);
    const { pageIndex } = this.state;
    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForMailResult} />
          <Header as="h2">메일 발송 결과 관리</Header>
        </div>
        <SearchBox
          onSearch={this.findAllResultMail}
          onChangeQueryProps={this.onChangeResultMailQueryProps}
          onClearQueryProps={this.clearResultMailQueryProps}
          queryModel={resultMailQuery}
          searchWordOption={SelectType.searchPartForResultMail}
          collegeAndChannel={false}
          defaultPeriod={1}
        >
          <SearchBoxFieldView
            fieldTitle="구분"
            fieldOption={SelectType.mailOptions}
            onChangeQueryProps={this.onChangeResultMailQueryProps}
            targetValue={(resultMailQuery && resultMailQuery.type) || '전체'}
            queryFieldName="searchFilterType"
          />
        </SearchBox>
        <ResultSendMailListView
          result={result}
          hadleSendMail={this.hadleSendMail}
          handleClickRow={this.handleClickRow}
          pageIndex={pageIndex}
          limit={resultMailQuery.limit}
          totalCount={totalCount}
          setCountForFind={this.setCountForFind}
        />
        {totalCount === 0 ? null : (
          <>
            <div className="center">
              <Pagination
                activePage={pageMap.get('resultMailModel') ? pageMap.get('resultMailModel').page : 1}
                totalPages={pageMap.get('resultMailModel') ? pageMap.get('resultMailModel').totalPages : 1}
                onPageChange={(e, data) => this.findAllResultMail(data.activePage as number)}
              />
            </div>
          </>
        )}
      </Container>
    );
  }
}

export default withRouter(ResultsSendMailContainer);
