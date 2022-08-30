import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Container } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import XLSX from 'xlsx';

import { patronInfo } from '@nara.platform/dock';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType, SelectTypeModel } from 'shared/model';
import { alert, AlertModel, Loader, PageTitle } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { LoaderService } from 'shared/components/Loader';

import { getYearsOption } from 'lib/common';
import { UserWorkspaceService } from '../../../userworkspace';
import UserWorkspaceModel from '../../../userworkspace/model/UserWorkspaceModel';
import { UserGroupCategoryService, UserGroupService } from '../../../usergroup';
import MembershipStatisticsService from '../../present/logic/MembershipStatisticsService';
import { PassedStudentExcelModel } from '../../model/PassedStudentExcelModel';
import AnnualStatisticsView from '../view/AnnualStatisticsView';
import MonthlyStatisticsListView from '../view/MonthlyStatisticsListView';
import LearningDataExcelDownloadView from '../view/LearningDataExcelDownloadView';
import StatisticsByUserWorkspaceSelectView from '../view/StatisticsByUserWorkspaceSelectView';
import AnnualAllStatisticsView from '../view/AnnualAllStatisticsView';
import MonthlyAllStatisticsListView from '../view/MonthlyAllStatisticsListView';
import { getExcelHeader, setExcelUserGroupInfo } from './StatisticsHelper';

interface Props extends RouteComponentProps<Params> {}

interface Params {}

interface States {}

interface Injected {
  userWorkspaceService: UserWorkspaceService;
  membershipStatisticsService: MembershipStatisticsService;
  userGroupCategoryService: UserGroupCategoryService;
  userGroupService: UserGroupService;
  loaderService: LoaderService;
}
interface Field {
  id: string;
  name: string;
}

@inject(
  'userWorkspaceService',
  'membershipStatisticsService',
  'userGroupCategoryService',
  'userGroupService',
  'loaderService'
)
@observer
@reactAutobind
class MembershipLearningStatisticsContainer extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    super(props);

    this.initialize();
  }

  // componentDidMount() {
  //
  // this.initialize();
  // }

  state = {
    selectChanged: false,
    year: new Date().getFullYear().toString(),
    years: getYearsOption(2020),
  };

  async initialize() {
    const cineroomId = patronInfo.getCineroomId();
    const { membershipStatisticsService, userWorkspaceService, loaderService } = this.injected;
    membershipStatisticsService.clearCurrentUserWorkspace();
    membershipStatisticsService.clearSelectedUserWorkspaceId();
    membershipStatisticsService.clearSelectedUserWorkspace();
    membershipStatisticsService.clearAnnualMembershipStatistics();
    membershipStatisticsService.clearReplayTimeStatistics();
    membershipStatisticsService.clearMonthlyMembershipStatistics();
    membershipStatisticsService.clearWorkspaceOptions();
    membershipStatisticsService.clearMonth();
    if (cineroomId) {
      await userWorkspaceService.findUserWorkspaceById(cineroomId);
      membershipStatisticsService.changeCurrentUserWorkspace(userWorkspaceService.userWorkspace);

      if (userWorkspaceService.userWorkspace.hasChildren || userWorkspaceService.userWorkspace.id === 'ne1-m2-c2') {
        await this.superManagerInitialize();
      } else {
        await this.managerInitialize();
      }
    }
    loaderService.closeLoader(true, 'select');
  }

  async superManagerInitialize() {
    //
    const { userWorkspaceService, membershipStatisticsService } = this.injected;
    const { currentUserWorkspace } = membershipStatisticsService;
    const userWorkspaceId = patronInfo.getCineroomId();

    let userWorkspaces: UserWorkspaceModel[] = [];

    if (userWorkspaceId) {
      await userWorkspaceService.findUserWorkspaceById(userWorkspaceId);

      if (currentUserWorkspace.id === 'ne1-m2-c2') {
        userWorkspaces.push(
          ...(await userWorkspaceService.findAllWorkspaces()).filter((target) => target.id !== 'ne1-m2-c2')
        );
      } else {
        await userWorkspaceService.findUserWorkspaceById(userWorkspaceId);
        userWorkspaces.push(currentUserWorkspace);
        userWorkspaces.push(...(await userWorkspaceService.findUserWorkspacesByParentId(currentUserWorkspace.id)));
      }

      const all = new UserWorkspaceModel();
      all.id = 'ALL';
      all.name.ko = '전체';
      userWorkspaces = [all, ...userWorkspaces];
    }

    membershipStatisticsService.setWorkspaceOptions(
      userWorkspaces.map((target) => new SelectTypeModel(target.id, getPolyglotToAnyString(target.name), target.id))
    );
  }

  async managerInitialize() {
    //
    const { userWorkspaceService, membershipStatisticsService } = this.injected;
    const { currentUserWorkspace } = membershipStatisticsService;
    const userWorkspaceId = patronInfo.getCineroomId();
    if (userWorkspaceId) {
      await userWorkspaceService.findUserWorkspaceById(userWorkspaceId);
      await this.findMembershipStatistics();

      const userWorkspaces: UserWorkspaceModel[] = [];
      userWorkspaces.push(currentUserWorkspace);
      membershipStatisticsService.setWorkspaceOptions(
        userWorkspaces.map((target) => new SelectTypeModel(target.id, getPolyglotToAnyString(target.name), target.id))
      );
      membershipStatisticsService.changeSelectedUserWorkspaceId(userWorkspaceId);
    }
  }

  async findMembershipStatistics(userWorkspaceId?: string): Promise<void> {
    //
    const { membershipStatisticsService, userWorkspaceService, loaderService } = this.injected;
    const {
      workspaceOptions,
      annualMembershipStatisticsList,
      monthlyMembershipStatisticsList,
      replayTimeStatisticsList,
    } = membershipStatisticsService;
    const { year } = this.state;
    loaderService.openLoader(true);
    this.setState({
      selectChanged: false,
    });
    if (userWorkspaceId === 'ALL') {
      const promises: any[] = [];
      const fields: Field[] = [];

      if (
        annualMembershipStatisticsList.length === 0 ||
        monthlyMembershipStatisticsList.length === 0 ||
        replayTimeStatisticsList.length === 0
      ) {
        workspaceOptions.forEach((option) => {
          fields.push({ id: option.key, name: option.text });
        });

        fields
          .filter((field: Field) => field.id !== 'ALL')
          .forEach((field: Field) => {
            if (field) {
              promises.push(
                new Promise<Field>(async (resolve, reject) => {
                  try {
                    await membershipStatisticsService.findAllAnnualMembershipStatisticsForMySuniManager(
                      field.id,
                      field.name,
                      year
                    );
                    await membershipStatisticsService.findAllMonthlyMembershipStatisticsForMySuniManager(
                      field.id,
                      field.name,
                      year
                    );
                    await membershipStatisticsService.findAllReplayTimeStatistics(field.id, field.name, year);
                    resolve(field);
                  } catch (e) {
                    reject(e);
                  }
                })
              );
            }
          });
        Promise.all(promises)
          .then((result) => {
            this.allConditionRender();
          })
          .catch((error) => {
            // console.log("error!!", error);
            throw error;
          });
        return;
      }
      this.allConditionRender();
      return;
    }

    if (userWorkspaceId) {
      await userWorkspaceService.findUserWorkspaceById(userWorkspaceId);
      membershipStatisticsService.changeSelectedUserWorkspace(userWorkspaceService.userWorkspace);
    }
    loaderService.closeLoader(true, 'select');
    this.annualMemberShip(userWorkspaceId);
    this.monthlyMemberShip(userWorkspaceId);
    this.replayMemberShip(userWorkspaceId);
  }

  async annualMemberShip(userWorkspaceId?: string) {
    //
    const { membershipStatisticsService, loaderService } = this.injected;
    const { year } = this.state;

    if (userWorkspaceId) {
      await membershipStatisticsService.findAnnualMembershipStatisticsForMySuniManager(
        membershipStatisticsService.selectedUserWorkspace.id,
        year
      );
    } else {
      await membershipStatisticsService.findAnnualMembershipStatistics(year);
    }

    loaderService.closeLoader(true, 'annual');
  }

  async replayMemberShip(userWorkspaceId?: string) {
    //
    const { membershipStatisticsService, loaderService } = this.injected;
    const { year } = this.state;

    if (userWorkspaceId) {
      await membershipStatisticsService.findReplayTimeStatistics(
        membershipStatisticsService.selectedUserWorkspace.id,
        year
      );
    }
  }

  async monthlyMemberShip(userWorkspaceId?: string) {
    //
    const { membershipStatisticsService, loaderService } = this.injected;
    const { year } = this.state;

    if (userWorkspaceId) {
      await membershipStatisticsService.findMonthlyMembershipStatisticsForMySuniManager(
        membershipStatisticsService.selectedUserWorkspace.id,
        year
      );
    } else {
      await membershipStatisticsService.findMonthlyMembershipStatistics(year);
    }

    loaderService.closeLoader(true, 'monthly');
  }

  async excelDownload(): Promise<string> {
    //
    const { membershipStatisticsService, userGroupCategoryService, userGroupService } = this.injected;
    const { currentUserWorkspace, selectedUserWorkspace, month } = membershipStatisticsService;
    const { year } = this.state;

    let userWorkspaceId: string = '';
    let userWorkspaceName: string = '';

    const wbList: PassedStudentExcelModel[] = [];

    if (!month) {
      alert(AlertModel.getCustomAlert(true, '통계 엑셀 다운로드', '다운받을 월 을 선택해주세요.', '확인', () => {}));
      return '';
    }

    if (currentUserWorkspace.hasChildren || currentUserWorkspace.id === 'ne1-m2-c2') {
      await membershipStatisticsService.findPassedStudentsForMySuniManager(
        selectedUserWorkspace.id,
        year,
        Number.parseInt(month, 10)
      );
      userWorkspaceId = selectedUserWorkspace.id;
      userWorkspaceName = getPolyglotToAnyString(selectedUserWorkspace.name);
      // const result = await userGroupCategoryService.findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(
      //   selectedUserWorkspace.id
      // );
      // const targets: UserGroupModel[] = result.map((target) => [...target.userGroups]).flat();
      // userGroupService.setUserGroupList(targets);
    } else {
      await membershipStatisticsService.findPassedStudents(year, Number.parseInt(month, 10));
      userWorkspaceId = currentUserWorkspace.id;
      userWorkspaceName = getPolyglotToAnyString(currentUserWorkspace.name);

      // const result = await userGroupCategoryService.findUserGroupCategoriesWithUserGroupsByUserWorkspaceId(
      //   currentUserWorkspace.id
      // );
      // const targets: UserGroupModel[] = result.map((target) => [...target.userGroups]).flat();
      // userGroupService.setUserGroupList(targets);
    }

    await userGroupService.findUserGroupMap();
    const userGroupMap = userGroupService.userGroupMap;

    const { groupHeader, header, merge } = await getExcelHeader(userGroupCategoryService, userWorkspaceId);
    this.injected.membershipStatisticsService.passedStudents.forEach((passedStudent) => {
      // if (passedStudent.userGroupSequences.groupSequences.filter())
      const passedStudentExcel = new PassedStudentExcelModel(passedStudent);
      let userGroupName = '';

      passedStudent.userGroupSequences.sequences.map((sequence, index) =>
        index === 0
          ? (userGroupName = userGroupMap.get(sequence)?.userGroupName || '')
          : (userGroupName += ', ' + userGroupMap.get(sequence)?.userGroupName)
      );

      passedStudentExcel['사용자 그룹'] = userGroupName;

      wbList.push(passedStudentExcel);
    });

    const sheet = XLSX.utils.json_to_sheet([], { header: groupHeader });
    sheet['!merges'] = merge;
    XLSX.utils.sheet_add_json(sheet, wbList, {
      origin: -1,
      header,
    });

    setExcelUserGroupInfo(sheet, wbList, this.injected.userGroupCategoryService, userWorkspaceId);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, sheet, '통계');
    const fileName = `통계_${userWorkspaceName}_${year}년_${month}월.xlsx`;
    XLSX.writeFile(wb, fileName, { compression: true });
    return fileName;
  }

  makeMonthSelectOptions(): SelectTypeModel[] {
    //
    const { membershipStatisticsService } = this.injected;
    return membershipStatisticsService.monthlyMembershipStatistics.map(
      (mon) => new SelectTypeModel(mon.month, `${mon.month}월`, mon.month)
    );
  }

  onChangeSelectedUserWorkspaceId(id: string): void {
    //
    const { membershipStatisticsService } = this.injected;
    membershipStatisticsService.changeSelectedUserWorkspaceId(id);
    this.setState({
      selectChanged: true,
    });
  }

  onChangeSelectedYear(id: string): void {
    //
    this.setState({
      year: id,
      selectChanged: true,
    });
  }

  onChangeMonth(month: string): void {
    //
    const { membershipStatisticsService } = this.injected;
    membershipStatisticsService.changeMonth(month);
  }

  allConditionRender(): void {
    const { loaderService } = this.injected;
    setTimeout(() => {
      loaderService.closeLoader(true, 'select');
      loaderService.closeLoader(true, 'allAnnual');
      loaderService.closeLoader(true, 'allMonthly');
    }, 500);
  }

  render() {
    //
    const { membershipStatisticsService } = this.injected;
    const { selectChanged, year, years } = this.state;
    const {
      currentUserWorkspace,
      annualMembershipStatistics,
      annualMembershipStatisticsList,
      replayTimeStatistics,
      replayTimeStatisticsList,
      monthlyMembershipStatistics,
      monthlyMembershipStatisticsList,
      workspaceOptions,
      selectedUserWorkspace,
      selectedUserWorkspaceId,
      month,
    } = membershipStatisticsService;

    const workspaceName: string =
      currentUserWorkspace.hasChildren || currentUserWorkspace.id === 'ne1-m2-c2'
        ? getPolyglotToAnyString(selectedUserWorkspace.name)
        : '';

    return (
      <Container fluid>
        <PageTitle breadcrumb={SelectType.statisticsSections} />
        {currentUserWorkspace.hasChildren !== undefined && (
          <>
            {currentUserWorkspace.hasChildren || currentUserWorkspace.id === 'ne1-m2-c2' ? (
              <>
                <Loader name="select">
                  <StatisticsByUserWorkspaceSelectView
                    onChangeSelectedUserWorkspaceId={this.onChangeSelectedUserWorkspaceId}
                    findMembershipStatistics={this.findMembershipStatistics}
                    workspaceOptions={workspaceOptions}
                    selectedUserWorkspaceId={selectedUserWorkspaceId}
                    onChangeSelectedYear={this.onChangeSelectedYear}
                    year={year}
                    years={years}
                  />
                </Loader>
                {(!selectChanged && selectedUserWorkspace && selectedUserWorkspace.id) ||
                (!selectChanged && selectedUserWorkspaceId === 'ALL') ? (
                  <>
                    {selectedUserWorkspaceId === 'ALL' ? (
                      <>
                        <Loader name="allAnnual">
                          <AnnualAllStatisticsView
                            annualMembershipStatisticsList={annualMembershipStatisticsList}
                            replayTimeStatisticsList={replayTimeStatisticsList}
                            year={year}
                          />
                        </Loader>
                        <Loader name="allMonthly">
                          <MonthlyAllStatisticsListView
                            monthlyMembershipStatisticsList={monthlyMembershipStatisticsList}
                            year={year}
                          />
                        </Loader>
                      </>
                    ) : (
                      <>
                        <Loader name="annual">
                          <AnnualStatisticsView
                            annualMembershipStatistics={annualMembershipStatistics}
                            replayTimeStatistics={replayTimeStatistics}
                            workspaceName={workspaceName}
                            year={year}
                          />
                        </Loader>
                        <Loader name="monthly">
                          <MonthlyStatisticsListView
                            monthlyMembershipStatistics={monthlyMembershipStatistics}
                            workspaceName={workspaceName}
                            year={year}
                          />
                        </Loader>
                      </>
                    )}
                    {selectedUserWorkspaceId !== 'ALL' ? (
                      <Loader name="monthly">
                        <LearningDataExcelDownloadView
                          excelDownload={this.excelDownload}
                          onChangeMonth={this.onChangeMonth}
                          selectOptions={this.makeMonthSelectOptions()}
                          workspaceName={workspaceName}
                          year={year}
                          years={years}
                          month={month}
                        />
                      </Loader>
                    ) : null}
                  </>
                ) : null}
              </>
            ) : selectedUserWorkspaceId !== 'ALL' ? (
              <>
                <Loader name="select">
                  <StatisticsByUserWorkspaceSelectView
                    onChangeSelectedUserWorkspaceId={this.onChangeSelectedUserWorkspaceId}
                    findMembershipStatistics={this.findMembershipStatistics}
                    workspaceOptions={workspaceOptions}
                    selectedUserWorkspaceId={selectedUserWorkspaceId}
                    onChangeSelectedYear={this.onChangeSelectedYear}
                    year={year}
                    years={years}
                  />
                </Loader>
                {(!selectChanged && selectedUserWorkspace && selectedUserWorkspace.id) ||
                (!selectChanged && selectedUserWorkspaceId === 'ALL') ? (
                  <>
                    <Loader name="annual">
                      <AnnualStatisticsView
                        annualMembershipStatistics={annualMembershipStatistics}
                        replayTimeStatistics={replayTimeStatistics}
                        workspaceName={workspaceName}
                        year={year}
                      />
                    </Loader>
                    <Loader name="monthly">
                      <MonthlyStatisticsListView
                        monthlyMembershipStatistics={monthlyMembershipStatistics}
                        workspaceName={workspaceName}
                        year={year}
                      />
                    </Loader>
                    <LearningDataExcelDownloadView
                      excelDownload={this.excelDownload}
                      onChangeMonth={this.onChangeMonth}
                      selectOptions={this.makeMonthSelectOptions()}
                      workspaceName={workspaceName}
                      year={year}
                      years={years}
                      month={month}
                    />
                  </>
                ) : null}
              </>
            ) : null}
          </>
        )}
      </Container>
    );
  }
}

export default withRouter(MembershipLearningStatisticsContainer);
