/* eslint-disable */
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import { Breadcrumb, Container, Header, Pagination } from 'semantic-ui-react';
import { Moment } from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { SelectType } from 'shared/model';

import ResultMailService from 'resultSendMail/present/logic/ResultMailService';
import ResultSendMailDetailView from '../../ui/view/ResultSendMailDetailView';

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
class ResultsSendMailDetailContainer extends React.Component<Props, States> {
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
    if (resultMailService) {
      resultMailService.clearResultMailDetailModel();
    }
  }

  init() {
    const { resultMailService } = this.props;
    let currentPage = 0;
    if (resultMailService) currentPage = resultMailService.resultMailQuery.currentPage;
    if (resultMailService) {
      this.findResultMail(currentPage);
    }
  }

  findResultMail(page?: number) {
    const { sharedService, resultMailService } = this.props;
    if (sharedService && resultMailService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('resultMailDetailModel', page);
        offset = (page - 1) * resultMailService.resultMailQuery.limit;
        resultMailService.changeResultMailQueryProps('currentPage', page);
      } else sharedService.setPageMap('resultMailDetailModel', 0, resultMailService.resultMailQuery.limit);

      resultMailService.changeResultMailQueryProps('offset', offset);

      resultMailService
        .findResultMail(resultMailService.sendId)
        .then(() => {
          if (page) this.setState({ pageIndex: (page - 1) * 20 });
        })
        .then(() =>
          sharedService.setCount('resultMailDetailModel', resultMailService.resultMailDetailModels.totalCount)
        );
    }
  }

  historyBack() {
    //
    this.props.history.goBack();
  }

  onChangeResultMailQueryProps(name: string, value: string | Moment | number) {
    const { resultMailService } = this.props;
    if (resultMailService) resultMailService.changeResultMailQueryProps(name, value);
  }

  // 조회갯수 변경
  setCountForFind(name: string, value: string) {
    //
    const { resultMailService } = this.props;
    if (resultMailService) {
      resultMailService.changeResultMailQueryProps(name, value);
      this.setState({ pageIndex: 0 });
    }

    this.findResultMail();
  }

  render() {
    const { resultMailDetailModels, resultMailQuery } = this.props.resultMailService || ({} as ResultMailService);
    const result = resultMailDetailModels.results;
    const totalCount = resultMailDetailModels.totalCount;
    const { pageMap } = this.props.sharedService || ({} as SharedService);
    const { pageIndex } = this.state;
    return (
      <Container fluid>
        <div>
          <Breadcrumb icon="right angle" sections={SelectType.pathForMailResult} />
          <Header as="h2">메일 발송 결과 상세</Header>
        </div>
        <ResultSendMailDetailView
          result={result}
          historyBack={this.historyBack}
          pageIndex={pageIndex}
          limit={resultMailQuery.limit}
          totalCount={totalCount}
          setCountForFind={this.setCountForFind}
        />
        {totalCount === 0 ? null : (
          <>
            <div className="center">
              <Pagination
                activePage={pageMap.get('resultMailDetailModel') ? pageMap.get('resultMailDetailModel').page : 1}
                totalPages={pageMap.get('resultMailDetailModel') ? pageMap.get('resultMailDetailModel').totalPages : 1}
                onPageChange={(e, data) => this.findResultMail(data.activePage as number)}
              />
            </div>
          </>
        )}
      </Container>
    );
  }
}

export default withRouter(ResultsSendMailDetailContainer);
