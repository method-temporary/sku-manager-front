import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { Container, Grid, Pagination, Select } from 'semantic-ui-react';
import moment from 'moment';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { Loader, PageTitle, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import AlertWinForSearchBox from 'cube/board/board/ui/logic/AlertWinForSearchBox';
import QnaService from 'support/qna/present/logic/QnaService';
import { SupportType } from 'support/category/model/vo/SupportType';
import { QnaQueryModel } from 'support/qna/model/sdo/QnaQueryModel';
import { RequestChannel } from 'support/qna/model/vo/RequestChannel';
import { QuestionState } from 'support/qna/model/vo/QuestionState';
import { CategoryService } from 'support/category';
import { QnaExcelFormModel } from 'support/qna/model/sdo/QnaExcelFormModel';
import QnaExcelRom from 'support/qna/model/sdo/QnaExcelRom';
import QnaSearchBoxView from '../view/QnaSearchBoxView';
import QnaListView from '../view/QnaListView';

interface Props extends RouteComponentProps<{ cineroomId: string }> {}

interface States {
  mainCategoryList: SelectTypeModel[];
  subCategoryList: SelectTypeModel[];
  alertWinForSearchBoxOpen: boolean;
}

interface Injected {
  qnaService: QnaService;
  categoryService: CategoryService;
}

@inject('qnaService', 'categoryService')
@observer
@reactAutobind
class QnaListContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);
    this.state = {
      mainCategoryList: [],
      subCategoryList: [],
      alertWinForSearchBoxOpen: false,
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    //
    const { qnaService } = this.injected;
    const { qnaQuery } = qnaService;
    // await qnaService.clearQnaQuery();
    // await this.onChangeQnaQueryProps('period.startDateMoment', moment().add(-1, 'y').startOf('day'));
    // await this.onChangeQnaQueryProps('period.endDateMoment', moment().endOf('day'));
    await this.getMainCategoryList();
    qnaQuery && qnaQuery.mainCategoryId && (await this.getSubCategoryList(qnaQuery.mainCategoryId));
    await this.onSearchQnaBySearchBox();
  }

  onChangeQnaQueryProps(name: string, value: any) {
    //
    const { qnaService } = this.injected;
    const { qnaQuery } = qnaService;
    let newValue = value;

    if (name === 'offset') {
      newValue = (value - 1) * qnaQuery.limit;
    }

    if (name === 'limit') {
      qnaService.changeQnaQuery('offset', 0);
    }

    qnaService.changeQnaQuery(name, newValue);

    if (name === 'offset' || name === 'limit') {
      this.onSearchQnaBySearchBox();
    }

    if (name === 'mainCategoryId' && newValue) {
      this.getSubCategoryList(newValue);
    }
  }

  onSearchQnaBySearchBox() {
    //
    const { qnaService } = this.injected;
    const { qnaQuery } = qnaService;

    const qnaRdo = QnaQueryModel.asQnaRdo(qnaQuery);

    qnaService.findByRdo(qnaRdo);
  }

  onClearQnaQueryProps() {
    //
    const { qnaService } = this.injected;
    qnaService.clearQnaQuery();
  }

  routeToCreateQna() {
    //
    this.props.history.push(`/cineroom/${this.props.match.params.cineroomId}/service-management/supports/qna-create`);
  }

  async handleClickPostRow(qnaId: string) {
    //
    await this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/service-management/supports/qna-detail/${qnaId}`
    );
  }

  async onClickDownloadQnas() {
    //
    const { qnaService, categoryService } = this.injected;
    const { qnaQuery } = qnaService;
    const qnaRdo = QnaQueryModel.asQnaRdo(qnaQuery);
    // qnaRdo.startDate = 0;
    qnaRdo.limit = 999999;

    const allCategoryList = await categoryService.findAllCategory(SupportType.QNA);

    const downloadTime = moment().format('yyyyMMDD').toString();

    const fileName = `문의목록-${downloadTime}.xlsx`;

    const qnaAllList = await qnaService.findForExcel(qnaRdo);
    const qnaXlsxList: QnaExcelFormModel[] = [];

    (await qnaAllList) &&
      qnaAllList.length > 0 &&
      qnaAllList.map((qna: QnaExcelRom, index: number) => {
        const mainCategory =
          qna.question &&
          qna.question.mainCategoryId &&
          allCategoryList.find((category) => qna.question.mainCategoryId === category.id);
        const subCategory =
          qna.question &&
          qna.question.subCategoryId &&
          allCategoryList.find((category) => qna.question.subCategoryId === category.id);

        qnaXlsxList.push(
          QnaExcelRom.asExcelModel(
            qna,
            index,
            (qna.question.requestChannel && this.getChannelName(qna.question.requestChannel)) || '',
            (mainCategory && getPolyglotToAnyString(mainCategory.name)) || '',
            (subCategory && getPolyglotToAnyString(subCategory.name)) || '',
            (qna.question.requestChannel && this.getStateName(qna.question.state)) || ''
          )
        );
      });

    const qnaExcel = XLSX.utils.json_to_sheet(qnaXlsxList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, qnaExcel, '문의');

    XLSX.writeFile(temp, fileName, { compression: true });

    // await qnaService.findForExcel(qnaRdo).then((qnas: QnaExcelRom[]) => {
    //   const qnaXlsxList: QnaExcelFormModel[] = [];
    //   qnas.map((qna: QnaExcelRom, index: number) => {
    //     const mainCategory =
    //       qna.question &&
    //       qna.question.mainCategoryId &&
    //       allCategoryList.find((category) => qna.question.mainCategoryId === category.id);
    //     const subCategory =
    //       qna.question &&
    //       qna.question.subCategoryId &&
    //       allCategoryList.find((category) => qna.question.subCategoryId === category.id);

    //     qnaXlsxList.push(
    //       QnaExcelRom.asExcelModel(
    //         qna,
    //         index,
    //         (qna.question.requestChannel && this.getChannelName(qna.question.requestChannel)) || '',
    //         (mainCategory && getPolyglotToAnyString(mainCategory.name)) || '',
    //         (subCategory && getPolyglotToAnyString(subCategory.name)) || '',
    //         (qna.question.requestChannel && this.getStateName(qna.question.state)) || ''
    //       )
    //     );
    //   });

    //   const qnaExcel = XLSX.utils.json_to_sheet(qnaXlsxList);
    //   const temp = XLSX.utils.book_new();

    //   XLSX.utils.book_append_sheet(temp, qnaExcel, '문의');

    //   XLSX.writeFile(temp, fileName, { compression: true });
    // });
    return fileName;
  }

  getChannelList() {
    //
    const channelList: { key: string; text: string; value: string }[] = [];
    SelectType.qnaChannel.map((channel) => channelList.push(channel));

    return channelList;
  }

  getChannelName(word: RequestChannel | '') {
    return SelectType.qnaChannel.find((channel) => channel.value === word)?.text;
  }

  getStateList() {
    //
    const stateList: { key: string; text: string; value: string }[] = [];
    SelectType.qnaState.map((state) => stateList.push(state));

    return stateList;
  }

  getStateName(word: QuestionState) {
    //
    return SelectType.qnaState.find((state) => state.value === word)?.text;
  }

  async getMainCategoryList() {
    //
    const { categoryService } = this.injected;

    const categoryList: SelectTypeModel[] = [];

    const originCategoryList = await categoryService.findMainCategories(SupportType.QNA);

    categoryList.push(new SelectTypeModel('0', '전체', 'All'));
    originCategoryList.map((category, idx) => {
      categoryList.push(new SelectTypeModel((idx + 1).toString(), getPolyglotToAnyString(category.name), category.id));
    });

    this.setState({ mainCategoryList: categoryList });
  }

  async getSubCategoryList(id: string) {
    //
    const { categoryService } = this.injected;

    const categoryList: SelectTypeModel[] = [];

    const originCategoryList = await categoryService.findSubCategories(SupportType.QNA, id);

    categoryList.push(new SelectTypeModel('0', '전체', 'All'));
    originCategoryList.map((category, idx) => {
      categoryList.push(new SelectTypeModel((idx + 1).toString(), getPolyglotToAnyString(category.name), category.id));
    });

    this.setState({ subCategoryList: categoryList });
  }

  getCategoryName(word: string) {
    //
    const { mainCategoryList } = this.state;
    return mainCategoryList.find((category) => category.value === word)?.text;
  }

  handleCloseAlertForSearchBoxWin() {
    //
    this.setState({
      alertWinForSearchBoxOpen: false,
    });
  }

  render() {
    const { qnaService, categoryService } = this.injected;
    const { alertWinForSearchBoxOpen, mainCategoryList, subCategoryList } = this.state;
    const { qnaRoms, totalSearchCount, qnaQuery } = qnaService;
    const {} = categoryService;

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.pathForQna} />
        <QnaSearchBoxView
          qnaQuery={qnaQuery}
          stateList={this.getStateList()}
          channelList={this.getChannelList()}
          mainCategoryList={mainCategoryList}
          subCategoryList={subCategoryList}
          onChangeQnaQueryProps={this.onChangeQnaQueryProps}
          onSearchQnaBySearchBox={this.onSearchQnaBySearchBox}
          onClearQnaQueryProps={this.onClearQnaQueryProps}
        />

        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              <SubActions.Count number={totalSearchCount} text="개" />
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <Select
                  className="ui small-border dropdown m0"
                  defaultValue={SelectType.qnaLimit[0].value}
                  options={SelectType.limit}
                  onChange={(e: any, data: any) => this.onChangeQnaQueryProps('limit', data.value)}
                />
                <SubActions.ExcelButton download onClick={this.onClickDownloadQnas} />
                {/* <SubActions.ExcelButton onClick={this.onClickDownloadQnas} /> */}
                <SubActions.CreateButton onClick={this.routeToCreateQna}>Create</SubActions.CreateButton>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Loader>
          <QnaListView
            results={qnaRoms}
            totalCount={totalSearchCount}
            offset={qnaQuery.offset}
            handleClickQnaRow={this.handleClickPostRow}
            getChannel={this.getChannelName}
            getCategory={this.getCategoryName}
            getState={this.getStateName}
          />
        </Loader>
        <div className="center">
          <Pagination
            activePage={(qnaQuery.offset >= 0 && Math.ceil(qnaQuery.offset / qnaQuery.limit) + 1) || 1}
            totalPages={(totalSearchCount && Math.ceil(totalSearchCount / qnaQuery.limit)) || 1}
            onPageChange={(e, data) => this.onChangeQnaQueryProps('offset', data.activePage)}
          />
        </div>
        <AlertWinForSearchBox handleClose={this.handleCloseAlertForSearchBoxWin} open={alertWinForSearchBoxOpen} />
      </Container>
    );
  }
}

export default QnaListContainer;
