import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { patronInfo } from '@nara.platform/dock';
import { Container, Grid } from 'semantic-ui-react';

import { SelectType, SelectTypeModel, PatronKey, SortFilterState } from 'shared/model';
import { Loader, Pagination, SearchBox, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { addSelectTypeBoxAllOption } from 'shared/helper';

import { learningManagementUrl } from '../../../../Routes';

import { CollegeService, ContentsProviderService } from 'college';
import { CubeCountModel } from 'personalcube/model/old/CubeCountModel';

import { useLectureList } from '../../service/useLectureList';
import LectureListView from '../view/LectureListView';

interface LectureListContainerProps
  extends RouteComponentProps<{
    cineroomId: string;
  }> {
  instructorId: string;
}

const LectureListContainer: React.FC<LectureListContainerProps> = function LectureListContainer(props) {
  const paginationKey = 'instructor-cubes';

  function routeToLectureDetail(cubeId: string) {
    props.history.push(
      `/cineroom/${props.match.params.cineroomId}/${learningManagementUrl}/cubes/cube-detail/${cubeId}`
    );
  }

  function findCollegeName(collegeId: string): string | undefined {
    //
    const collegeService = CollegeService.instance;
    return collegeService.collegesMap.get(collegeId);
  }

  function findChannelName(channelId: string): string | undefined {
    //
    const collegeService = CollegeService.instance;
    return collegeService.channelMap.get(channelId);
  }

  function setContentsProvider() {
    const selectContentsProviderType: any = [];
    const contentsProviderService = ContentsProviderService.instance;
    const { contentsProviders } = contentsProviderService;

    selectContentsProviderType.push({
      key: '0',
      text: '전체',
      value: '전체',
    });
    contentsProviders.forEach((contentsProvider) => {
      selectContentsProviderType.push({
        key: contentsProvider.id,
        text: getPolyglotToAnyString(contentsProvider.name),
        value: contentsProvider.id,
      });
    });
    return selectContentsProviderType;
  }

  function getCollegeSelect(): SelectTypeModel[] {
    //
    const { colleges } = CollegeService.instance;
    const cineroom = patronInfo.getCineroom();
    const collegeSelect: SelectTypeModel[] = [];

    colleges
      .filter((college) => PatronKey.getCineroomId(college.patronKey) === cineroom?.id)
      .forEach((college) => {
        collegeSelect.push(new SelectTypeModel(college.id, getPolyglotToAnyString(college.name), college.id));
      });
    return collegeSelect;
  }

  const [
    lectureList,
    changeLectureQueryProps,
    searchQuery,
    lectureQuery,
    // clearLectureQuery,
    sharedService,
    cubeCount,
    searchBoxQueryModel,
    findAllLectureExcel,
    onChangeCollege,
    channelSelect,
  ] = useLectureList();
  const contentsProviders = setContentsProvider();

  changeLectureQueryProps('instructorId', props.instructorId);
  const collegeSelectTypes = addSelectTypeBoxAllOption(getCollegeSelect());
  const channelDisableKey = 'collegeId';
  const { startNo } = sharedService.getPageModel(paginationKey);

  return (
    <Container fluid>
      <SearchBox
        onSearch={searchQuery}
        changeProps={changeLectureQueryProps}
        queryModel={lectureQuery}
        name={paginationKey}
        sortFilter={SortFilterState.TimeDesc}
      >
        <SearchBox.Group name="등록일자">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
        <SearchBox.Group>
          <SearchBox.Select
            name="Category/Channel"
            fieldName="collegeId"
            options={collegeSelectTypes}
            placeholder="전체"
            onChange={(event, data) => onChangeCollege(data.value)}
          />
          <SearchBox.Select
            disabled={
              searchBoxQueryModel[channelDisableKey] === '' || searchBoxQueryModel[channelDisableKey] === '전체'
            }
            fieldName="channelId"
            options={channelSelect}
            placeholder="전체"
          />
          <SearchBox.Select
            name="교육형태"
            fieldName="cubeType"
            options={SelectType.learningTypeForEnum2}
            placeholder="전체"
            onChange={(event, data) => onChangeCollege(data.value)}
          />
        </SearchBox.Group>
        <SearchBox.Group name="교육기관">
          <SearchBox.Select
            fieldName="organizerId"
            options={contentsProviders}
            placeholder="전체"
            onChange={(event, data) => onChangeCollege(data.value)}
          />
        </SearchBox.Group>
        <SearchBox.Query options={SelectType.searchPartForCubeAll} searchWordDisabledValues={['', '전체']} />
      </SearchBox>
      <Pagination name={paginationKey} onChange={searchQuery}>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              <span>
                전체 <strong>{cubeCount.totalCount}</strong>개 강의 등록
                {cubeCount.totalLectureTime === 0 ? `/ 총 강의시간 0분` : `/ 총 강의시간 `}
                {cubeCount.totalLectureTime >= 60 ? (
                  <strong>{`${CubeCountModel.getHourFormat(cubeCount.totalLectureTime)} 시간`}</strong>
                ) : null}
                {cubeCount.totalLectureTime % 60 === 0 ? null : (
                  <strong>{` ${CubeCountModel.getMinuteFormat(cubeCount.totalLectureTime)} 분`}</strong>
                )}
              </span>
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <Pagination.SortFilter options={SelectType.sortFilterForCube} />
                <Pagination.LimitSelect allViewable />
                <SubActions.ExcelButton download onClick={findAllLectureExcel} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Loader>
          <LectureListView
            findCollegeName={findCollegeName}
            findChannelName={findChannelName}
            routeToLectureDetail={routeToLectureDetail}
            contentsProviders={contentsProviders}
            startNo={startNo}
            lectureList={lectureList}
          />
        </Loader>
        <Pagination.Navigator />
      </Pagination>
    </Container>
  );
};

export default withRouter(LectureListContainer);
