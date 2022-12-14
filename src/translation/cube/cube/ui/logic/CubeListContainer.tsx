import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { patronInfo } from '@nara.platform/dock';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container, Grid } from 'semantic-ui-react';
import XLSX from 'xlsx';

import { PageModel, SelectType, PatronKey, SelectTypeModel } from 'shared/model';
import { SharedService } from 'shared/present';
import { Loader, PageTitle, Pagination, SubActions } from 'shared/components';
import {
  Language,
  LangSupport,
  getPolyglotToAnyString,
  setLangSupports,
  setPolyglotValues,
} from 'shared/components/Polyglot';
import { SearchBoxService } from 'shared/components/SearchBox';
import { LoaderService } from 'shared/components/Loader';

import { translationManagementUrl } from 'Routes';
import CubePolyglotUdo from 'cube/cube/model/sdo/CubePolyglotUdo';
import { CollegeService, ContentsProviderService } from 'college';

import { CubeModel, CubeQueryModel, CubeXlsxModel, Descriptions } from 'cube/cube';
import CubeListView from '../view/CubeListView';
import CubeService from 'cube/cube/present/logic/CubeService';
import CubeSearchBoxView from 'cube/cube/ui/view/CubeSearchBoxView';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cineroomId: string;
}

interface States {
  excelReadModalWin: boolean;
  invalidModalWin: boolean;
  fileName: string;
  loaderText: string;
  failedIds: string[];
}

interface Injected {
  cubeService: CubeService;
  sharedService: SharedService;
  contentsProviderService: ContentsProviderService;
  collegeService: CollegeService;
  searchBoxService: SearchBoxService;
  loaderService: LoaderService;
}

@inject(
  'cubeService',
  'sharedService',
  'contentsProviderService',
  'collegeService',
  'searchBoxService',
  'loaderService'
)
@observer
@reactAutobind
class CubeListContainer extends ReactComponent<Props, States, Injected> {
  //
  paginationKey = 'cube';

  constructor(props: Props) {
    super(props);
    this.state = {
      excelReadModalWin: false,
      invalidModalWin: false,
      fileName: '',
      loaderText: '',
      failedIds: [],
    };
  }

  componentDidMount() {
    // this.findAllCubes();
    this.findAllContentsProviders();
    this.injected.cubeService.clearCube();
  }

  async findAllCubes() {
    //
    const { cubeService, sharedService } = this.injected;

    const offsetElementList = await cubeService.findCubeWithReactiveModelsForAdmin(
      CubeQueryModel.asCubeAdminRdo(cubeService.cubeQuery, sharedService.getPageModel(this.paginationKey))
    );

    sharedService.setCount(this.paginationKey, offsetElementList.totalCount);
  }

  async findAllContentsProviders() {
    //
    const { contentsProviderService } = this.injected;
    await contentsProviderService.findAllContentsProviders();
  }

  onChangeCubeQueryProps(name: string, value: any): void {
    //
    const { cubeService } = this.injected;
    cubeService.changeCubeQueryProps(name, value);
  }

  clearCubeQuery(): void {
    //
    const { cubeService } = this.injected;
    cubeService.clearCubeQuery();
  }

  setContentsProvider() {
    const selectContentsProviderType: any = [];
    const { contentsProviders } = this.injected.contentsProviderService;
    selectContentsProviderType.push({
      key: '0',
      text: '??????',
      value: '??????',
    });
    contentsProviders &&
      contentsProviders.forEach((contentsProvider) => {
        selectContentsProviderType.push({
          key: contentsProvider.id,
          text: getPolyglotToAnyString(contentsProvider.name),
          value: contentsProvider.id,
        });
      });
    return selectContentsProviderType;
  }

  routeToDetailCube(cubeId: string) {
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/${translationManagementUrl}/cubes/cube-detail/${cubeId}`
    );
  }

  async findAllCubesExcel() {
    //
    const { cubeService } = this.injected;
    const { cubeQuery } = cubeService;
    await cubeService.findCubeWithReactiveModelsForAdmin(
      CubeQueryModel.asCubeAdminRdo(cubeQuery, new PageModel(0, 99999))
    );

    const cubeXlsxList: CubeXlsxModel[] = [];
    cubeService.cubeWithReactiveModels.forEach((cube, index) => {
      const collegeName = this.findCollegeName(cube.getMainCategory().collegeId);
      const channelName = this.findChannelName(cube.getMainCategory().channelId);
      cubeXlsxList.push(CubeModel.asXLSX(cube, index, collegeName, channelName));
    });

    const cubeExcel = XLSX.utils.json_to_sheet(cubeXlsxList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, cubeExcel, 'Cubes');

    // const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const fileName = 'cubes.xlsx';
    XLSX.writeFile(temp, fileName, { compression: true });

    await this.findAllCubes();

    return fileName;
  }

  findCollegeName(collegeId: string): string | undefined {
    //
    const { collegeService } = this.injected;
    return collegeService.collegesMap.get(collegeId);
  }

  findChannelName(channelId: string): string | undefined {
    //
    const { collegeService } = this.injected;
    return collegeService.channelMap.get(channelId);
  }

  selectCollege(name: string, collegeId: string) {
    const { collegeService } = this.injected;
    if (collegeService && collegeId !== '??????') {
      collegeService
        .findMainCollege(collegeId)
        .then(() => this.onChangeCubeQueryProps(name, collegeId))
        .then(() => this.onChangeCubeQueryProps('channel', '??????'));
    } else if (collegeService && collegeId === '??????') {
      this.onChangeCubeQueryProps(name, collegeId);
    }
  }

  selectChannel(): any {
    const { mainCollege } = this.injected.collegeService;
    const select: SelectTypeModel[] = [new SelectTypeModel()];

    mainCollege.channels.map((channel) =>
      select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
    );

    return select;
  }

  async onChangeCollege(id: string) {
    //
    const { collegeService, searchBoxService } = this.injected;
    const { changePropsFn } = searchBoxService;
    const { findMainCollege } = collegeService;

    if (id === '') {
      changePropsFn('channelId', '');
    } else {
      await findMainCollege(id);
      changePropsFn('channelId', '');
    }
  }

  onSelectSharedOnly(value: boolean) {
    //
    const { searchBoxService } = this.injected;
    const { changePropsFn } = searchBoxService;

    if (value) {
      changePropsFn('collegeId', '');
      changePropsFn('channelId', '');
    }
  }

  getCollegeSelect(): SelectTypeModel[] {
    //
    const { collegeService } = this.injected;
    const { colleges } = collegeService;
    const cineroom = patronInfo.getCineroom();
    const collegeSelect: SelectTypeModel[] = [];

    colleges
      .filter((college) => PatronKey.getCineroomId(college.patronKey) === cineroom?.id)
      .forEach((college) => {
        collegeSelect.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
      });
    return collegeSelect;
  }

  onChangeOpen() {
    //
    const { excelReadModalWin } = this.state;
    if (excelReadModalWin) this.setState({ excelReadModalWin: false });
    else this.setState({ excelReadModalWin: true });
  }

  uploadFile(file: File) {
    //
    const { cubeService } = this.injected;

    const fileReader = new FileReader();
    fileReader.onload = (e: any) => {
      let binary = '';
      const data = new Uint8Array(e.target.result);
      const length = data.byteLength;
      for (let i = 0; i < length; i++) {
        binary += String.fromCharCode(data[i]);
      }
      const workbook: any = XLSX.read(binary, { type: 'binary' });
      let cubes: any[] = [];

      const jsonArray = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      if (jsonArray.length === 0) {
        return;
      }
      cubes = jsonArray;

      const udos: CubePolyglotUdo[] = [];

      cubes &&
        cubes.forEach((cube, index) => {
          const udo = new CubePolyglotUdo();

          const langSupports: LangSupport[] = [];
          const cubeId = cube['Cube Id'];
          const defaultLanguage = cube['????????????'];
          const cubeName = setPolyglotValues(cube['????????? (??????)'], cube['????????? (??????)'], cube['????????????(??????)']);
          const goal = setPolyglotValues(cube['???????????? (??????)'], cube['???????????? (??????)'], cube['????????????(??????)']);
          const applicants = setPolyglotValues(
            cube['???????????? (??????)'],
            cube['???????????? (??????)'],
            cube['????????????(??????)']
          );
          const description = setPolyglotValues(
            cube['?????? ?????? (??????)'],
            cube['?????? ?????? (??????)'],
            cube['???????????? (??????)']
          );
          const completionTerms = setPolyglotValues(
            cube['???????????? (??????)'],
            cube['???????????? (??????)'],
            cube['????????????(??????)']
          );
          const guide = setPolyglotValues(cube['???????????? (??????)'], cube['???????????? (??????)'], cube['???????????? (??????)']);
          const reportName = setPolyglotValues(
            cube['Report ??? (??????)'],
            cube['Report ??? (??????)'],
            cube['Report ??? (??????)']
          );
          const reportQuestion = setPolyglotValues(
            cube['?????? ????????? (??????)'],
            cube['?????? ????????? (??????)'],
            cube['?????? ????????? (??????)']
          );

          //tag?

          udo.cubeId = cubeId;
          udo.name = cubeName;
          udo.description = new Descriptions({ goal, applicants, description, completionTerms, guide });
          udo.reportName = reportName;
          udo.reportQuestion = reportQuestion;

          udo.langSupports = setLangSupports(
            cubeName.getValue(Language.Ko),
            cubeName.getValue(Language.En),
            cubeName.getValue(Language.Zh),
            defaultLanguage
          );
          udos.push(udo);
        });

      this.setState({ fileName: file.name });
      cubeService.setCubeUdos(udos);
    };
    fileReader.readAsArrayBuffer(file);
  }

  // async onReadExcel(): Promise<void> {
  //   //
  //   const { cubeService, loaderService } = this.injected;
  //   const { cubeUdos } = cubeService;

  //   loaderService.openPageLoader(true);

  //   let loadingCount = 0;
  //   const failedIds: string[] = [];

  //   /* eslint-disable no-await-in-loop */
  //   for (const udo of cubeUdos) {
  //     this.setState({
  //       loaderText: `?????? ?????? ???(${loadingCount}/${cubeUdos.length})`,
  //     });
  //     try {
  //       await cubeService.modifyPolyglotForAdmin(udo.cubeId, udo);
  //     } catch (ex) {
  //       failedIds.push(udo.cubeId);
  //     }
  //     loadingCount++;
  //   }

  //   this.setState({
  //     excelReadModalWin: false,
  //     invalidModalWin: true,
  //     loaderText: '',
  //     fileName: '',
  //     failedIds,
  //   });

  //   loaderService.closeLoader(true);
  // }

  // async onInvalidModalClose(value: boolean): Promise<void> {
  //   this.setState({ invalidModalWin: false });
  //   await this.findAllCubes();
  // }

  render() {
    //
    const { excelReadModalWin, fileName, loaderText, invalidModalWin, failedIds } = this.state;
    const { cubeService, searchBoxService } = this.injected;
    const { cubeQuery, cubeWithReactiveModels } = cubeService;
    const { count, startNo } = this.injected.sharedService.getPageModel(this.paginationKey);
    const collegesSelect = this.getCollegeSelect();
    const { searchBoxQueryModel } = searchBoxService;
    const contentsProviders = this.setContentsProvider();

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.translationCubeSections} />
        <Pagination name={this.paginationKey} onChange={this.findAllCubes}>
          <CubeSearchBoxView
            findAllCubes={this.findAllCubes}
            onChangeCubeQueryProps={this.onChangeCubeQueryProps}
            clearCubeQuery={this.clearCubeQuery}
            selectChannel={this.selectChannel}
            onChangeCollege={this.onChangeCollege}
            onSelectSharedOnly={this.onSelectSharedOnly}
            cubeQuery={cubeQuery}
            contentsProviders={contentsProviders}
            paginationKey={this.paginationKey}
            collegesSelect={collegesSelect}
            searchBoxQueryModel={searchBoxQueryModel}
          />

          <Grid className="list-info">
            <Grid.Row>
              <Grid.Column width={8}>
                <SubActions.Count number={count} text="??? ?????? ??????" />
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="right">
                  <Pagination.SortFilter options={SelectType.sortFilterForCube} />
                  <Pagination.LimitSelect allViewable />
                  <SubActions.ExcelButton download useDownloadHistory={false} onClick={this.findAllCubesExcel} />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Loader loaderText={loaderText && loaderText}>
            <CubeListView
              routeToDetailCube={this.routeToDetailCube}
              findCollegeName={this.findCollegeName}
              findChannelName={this.findChannelName}
              cubes={cubeWithReactiveModels}
              contentsProviders={contentsProviders}
              startNo={startNo}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>

        {/* <PolyglotExcelUploadModal
          open={excelReadModalWin}
          onChangeOpen={this.onChangeOpen}
          fileName={fileName}
          uploadFile={this.uploadFile}
          onReadExcel={this.onReadExcel}
          resourceFileName="Cube_Polyglot_Templete.xlsx"
        />
        <PolyglotExcelUploadFailedListModal
          open={invalidModalWin}
          failedList={failedIds}
          onClosed={this.onInvalidModalClose}
        /> */}
      </Container>
    );
  }
}

export default withRouter(CubeListContainer);
