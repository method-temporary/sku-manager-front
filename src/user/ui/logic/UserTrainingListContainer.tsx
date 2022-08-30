import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Form, Icon, Checkbox } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import XLSX from 'xlsx';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SharedService } from 'shared/present';
import { PolyglotModel, SelectType, SelectTypeModel } from 'shared/model';
import { Pagination, SearchBox, SubActions, Loader } from 'shared/components';
import { SearchBoxService } from 'shared/components/SearchBox';
import { LoaderService } from 'shared/components/Loader';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { addSelectTypeBoxAllOption } from 'shared/helper';
import { getContentsProviderById } from 'shared/hooks';

import { ServiceType } from 'student/model/vo/ServiceType';

import { CubeService } from '../../../cube';
import { CollegeService, ContentsProviderService } from '../../../college';
import { CubeWithContents } from '../../../cube/cube';
import { CardService, CardWithContents } from '../../../card';

import TrainingService from '../../present/logic/TrainingService';
import UserTrainingListView from '../view/UserTrainingListView';
import { divisionCategories } from '../../../card/card/ui/logic/CardHelper';
import { TrainingListViewModel } from '../../model/TrainingListViewModel';
import { TrainingExcelListViewModel } from '../../model/TrainingExcelListViewModel';
import { getFamilyCollegeSelect } from '../../../college/ui/logic/CollegeHelper';

interface Params {
  cineroomId: string;
  userId: string;
}

interface Props extends RouteComponentProps<Params> {}

interface Injected {
  trainingService: TrainingService;
  sharedService: SharedService;
  searchBoxService: SearchBoxService;
  collegeService: CollegeService;
  cubeService: CubeService;
  cardService: CardService;
  contentsProviderService: ContentsProviderService;
  loaderService: LoaderService;
}

@inject(
  'trainingService',
  'sharedService',
  'searchBoxService',
  'collegeService',
  'cubeService',
  'cardService',
  'contentsProviderService',
  'loaderService'
)
@observer
@reactAutobind
class UserTrainingListContainer extends ReactComponent<Props, {}, Injected> {
  //
  paginationKey = 'skProfileTraining';

  async onChangeCollege(id: string) {
    //
    const { trainingService, collegeService, searchBoxService } = this.injected;
    const { changeTrainingQueryProps } = trainingService;
    const { changePropsFn } = searchBoxService;
    const { findMainCollege } = collegeService;

    changePropsFn('channelId', '');
    changeTrainingQueryProps('channelId', '');

    await findMainCollege(id);
  }

  selectChannels() {
    //
    const { mainCollege } = this.injected.collegeService;
    const select: SelectTypeModel[] = [new SelectTypeModel()];

    mainCollege.channels?.map((channel) =>
      select.push(new SelectTypeModel(channel.id, getPolyglotToAnyString(channel.name), channel.id))
    );

    return select;
  }

  clearTrainingQueryProps() {
    const { trainingService } = this.injected;
    trainingService!.clearQuery();
  }

  onChangeTrainingQueryProps(name: string, value: any) {
    //
    const { trainingService } = this.injected;
    trainingService!.changeTrainingQueryProps(name, value);
  }

  async findTrainingsBySearch() {
    //
    const { sharedService, trainingService, loaderService } = this.injected;
    const { userId } = this.props.match.params;
    const pageModel = sharedService.getPageModel(this.paginationKey);

    trainingService.changeTrainingQueryProps('userDenizenId', userId);

    loaderService.openLoader(true);

    const offsetElementList = await trainingService.findAllTrainings(pageModel);
    await trainingService.findAllTrainingCount();

    await sharedService.setCount(this.paginationKey, offsetElementList.totalCount);

    await this.setTrainingData();

    this.injected.loaderService.closeLoader(true);
  }

  async findAllTrainingsExcel() {
    const { trainingService } = this.injected;
    const { userId } = this.props.match.params;

    trainingService.changeTrainingQueryProps('userDenizenId', userId);

    LoaderService.instance.openLoader(true);

    await trainingService.findAllTrainingsForExcel();

    await this.setTrainingData(true);

    const fileName = await this.excelDown();
    LoaderService.instance.closeLoader(true);
    return fileName;
  }

  excelDown() {
    //
    // TODO 엑셀 다운로드시 Card 많으면 카드 값 가져오는 API에서 에러
    const { trainingsForExcel } = this.injected.trainingService;

    let studentName: string = '';

    const trainingXlsxList: TrainingExcelListViewModel[] = [];
    trainingsForExcel &&
      trainingsForExcel.forEach((training, index) => {
        if (index === 0) {
          studentName = training.name;
        }
        trainingXlsxList.push(TrainingListViewModel.asXLSX(training, index));
      });
    const sheet = XLSX.utils.json_to_sheet(trainingXlsxList);
    const temp = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(temp, sheet, 'Trainings');

    // const date = moment().format('YYYY-MM-DD HH:mm:ss');
    const fileName = `${studentName}-trainings.xlsx`;
    XLSX.writeFile(temp, fileName, { compression: true });
    return fileName;
  }

  async setTrainingData(excel?: boolean) {
    //
    const { trainingService, cubeService, cardService, collegeService, contentsProviderService } = this.injected;

    const { collegesMap, channelMap } = collegeService;
    const { findContentsProvider } = contentsProviderService;

    const { trainings, trainingsForExcel, setTrainings, setTrainingsForExcel } = trainingService;
    const cardIds: string[] = [];
    const cubeIds: string[] = [];

    const cardMap = new Map<string, CardWithContents>();
    const cubeMap = new Map<string, CubeWithContents>();

    const trainingsModel = excel ? trainingsForExcel : trainings;

    trainingsModel &&
      trainingsModel.forEach((training) =>
        training.studentType === ServiceType.Card ? cardIds.push(training.lectureId) : cubeIds.push(training.lectureId)
      );

    const SPLIT_COUNT = 100;

    if (cardIds.length > 0) {
      //

      /* eslint-disable no-await-in-loop */
      for (let i = SPLIT_COUNT; i < cardIds.length + SPLIT_COUNT; i += SPLIT_COUNT) {
        const splitCardIds = cardIds.slice(i - SPLIT_COUNT, i);
        const cards = await cardService.findCardsForAdminByIds(splitCardIds);

        cards &&
          cards.forEach((cardWithContents) => {
            cardMap.set(cardWithContents.card.id, cardWithContents);
          });
      }
    }

    if (cubeIds.length > 0) {
      //
      /* eslint-disable no-await-in-loop */
      for (let i = SPLIT_COUNT; i < cubeIds.length + SPLIT_COUNT; i += SPLIT_COUNT) {
        const splitCubeIds = cubeIds.slice(i - SPLIT_COUNT, i);
        const cubes = await cubeService.findCubeWithContentsByIds(splitCubeIds);

        cubes &&
          cubes.forEach((cubeWithContents) => {
            cubeMap.set(cubeWithContents.cube.id, cubeWithContents);
          });
      }
    }

    const promise =
      trainingsModel &&
      (await trainingsModel.map(async (training) => {
        const newTraining = new TrainingListViewModel(training);

        if (training.studentType === ServiceType.Card) {
          const cardWithContents = cardMap.get(training.lectureId);

          if (cardWithContents) {
            const { card, cardContents } = cardWithContents;

            const { mainCategory } = divisionCategories(card.categories);

            newTraining.lectureName = card.name;
            newTraining.type = 'Card';
            newTraining.category = `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(
              mainCategory.channelId
            )}`;
            newTraining.learningTime = card.learningTime + card.additionalLearningTime;
            newTraining.surveyId = cardContents.surveyId;
            newTraining.learningContents = cardContents.learningContents;
            newTraining.stamped = card.stampCount > 0;
            newTraining.reportFileBox = cardContents.reportFileBox;
            newTraining.tested = cardContents.tests && cardContents.tests.length > 0;
          }
        } else {
          //
          const cubeWithContents = cubeMap.get(training.lectureId);

          if (cubeWithContents) {
            const { cube, cubeContents } = cubeWithContents;

            const { mainCategory } = divisionCategories(cube.categories);
            const contentsProvider = getContentsProviderById(cubeContents.organizerId);
            newTraining.organizerName = contentsProvider ? contentsProvider.name : new PolyglotModel();
            newTraining.lectureName = cube.name;
            newTraining.type = cube.type;
            newTraining.category = `${collegesMap.get(mainCategory.collegeId)} > ${channelMap.get(
              mainCategory.channelId
            )}`;
            newTraining.learningTime = cube.learningTime;
            newTraining.surveyId = cubeContents.surveyId;
            newTraining.reportFileBox = cubeContents.reportFileBox;
          }
        }

        return newTraining;
      }));

    excel ? setTrainingsForExcel(await Promise.all(promise)) : setTrainings(await Promise.all(promise));
  }

  routeToTrainingDetail(trainingId: string, index: number) {
    const { trainingService } = this.injected;
    trainingService.selectTraining(index);
    this.props.history.push(
      `/cineroom/${this.props.match.params.cineroomId}/user-management/user/user-detail/${this.props.match.params.userId}/detail-training`
    );
  }

  render() {
    const cineroomId = this.props.match.params.cineroomId;
    const { trainingService, sharedService, searchBoxService, collegeService } = this.injected;
    const { trainings, trainingQuery, trainingCount } = trainingService!;

    const { startNo } = sharedService.getPageModel(this.paginationKey);
    const { learningStateCount } = trainingCount;
    const collegesSelect = getFamilyCollegeSelect(cineroomId, collegeService);

    const { searchBoxQueryModel } = searchBoxService;
    const channelDisableKey = 'collegeId';

    return (
      <>
        <SearchBox
          onSearch={this.findTrainingsBySearch}
          changeProps={this.onChangeTrainingQueryProps}
          queryModel={trainingQuery}
          name={this.paginationKey}
        >
          <SearchBox.Group name="이수 일자">
            <SearchBox.DatePicker
              startFieldName="period.startDateMoment"
              endFieldName="period.endDateMoment"
              searchButtons
            />
          </SearchBox.Group>

          <SearchBox.Group name="Category / Channel">
            <SearchBox.Select
              options={addSelectTypeBoxAllOption(collegesSelect)}
              fieldName="collegeId"
              placeholder="전체"
              onChange={(event, data) => this.onChangeCollege(data.value)}
            />
            <SearchBox.Select
              disabled={
                searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '전체'
              }
              options={this.selectChannels()}
              fieldName="channelId"
              placeholder="전체"
            />
            <SearchBox.Select
              name="이수상태"
              options={SelectType.completionState}
              fieldName="learningState"
              placeholder="전체"
            />
          </SearchBox.Group>
        </SearchBox>

        <Pagination name={this.paginationKey} onChange={this.findTrainingsBySearch}>
          <SubActions>
            <SubActions.Left>
              <SubActions.Count>
                <strong>{trainingCount.totalStudentCount}</strong> <span className="dash">|</span>
                결과처리대기 <strong>{learningStateCount.resultWaitingCount}</strong>
                <span className="dash">|</span>
                이수 <strong>{learningStateCount.passedCount}</strong> <span className="dash">|</span>
                미이수 <strong>{learningStateCount.missedCount}</strong> <span className="dash">|</span>
                불참 <strong>{learningStateCount.noShowCount}</strong>
              </SubActions.Count>
            </SubActions.Left>
            <SubActions.Right>
              <div style={{ display: 'inline-block', marginRight: '10px', marginBottom: '0px' }}>
                <Form.Field
                  control={Checkbox}
                  label="Card만 보기"
                  value={trainingQuery.studentType}
                  checked={trainingQuery.studentType === ServiceType.Card}
                  onChange={(e: any, data: any) => {
                    if (data.checked) {
                      this.onChangeTrainingQueryProps('studentType', ServiceType.Card);
                      searchBoxService.changePropsFn('studentType', ServiceType.Card);
                    } else {
                      this.onChangeTrainingQueryProps('studentType', ServiceType.Empty);
                      searchBoxService.changePropsFn('studentType', ServiceType.Empty);
                    }

                    this.findTrainingsBySearch();
                  }}
                />
              </div>
              <Pagination.LimitSelect />
              <SubActions.ExcelButton download onClick={this.findAllTrainingsExcel}>
                <Icon name="file excel outline" />
                엑셀 다운로드
              </SubActions.ExcelButton>
            </SubActions.Right>
          </SubActions>

          <Loader>
            <UserTrainingListView
              trainings={trainings}
              startNo={startNo}
              routeToTrainingDetail={this.routeToTrainingDetail}
            />
          </Loader>

          <Pagination.Navigator />
        </Pagination>
      </>
    );
  }
}

export default withRouter(UserTrainingListContainer);
