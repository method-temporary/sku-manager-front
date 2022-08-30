import autobind from 'autobind-decorator';
import { action, observable, runInAction } from 'mobx';
import { SelectTypeModel } from 'shared/model';
import MembershipStatisticsApi from '../apiclient/MembershipStatisticsApi';
import UserWorkspaceModel from '../../../userworkspace/model/UserWorkspaceModel';
import AnnualMembershipStatistics from '../../model/dto/AnnualMembershipStatistics';
import AnnualMembershipStatisticsList from '../../model/dto/AnnualMembershipStatisticsList';
import MonthlyMembershipStatistics from '../../model/dto/MonthlyMembershipStatistics';
import MonthlyMembershipStatisticsList from '../../model/dto/MonthlyMembershipStatisticsList';
import PassedStudent from '../../model/dto/PassedStudent';

@autobind
class MembershipStatisticsService {
  //
  static instance: MembershipStatisticsService;

  membershipStatisticsApi: MembershipStatisticsApi;

  constructor(membershipStatisticsApi: MembershipStatisticsApi) {
    //
    this.membershipStatisticsApi = membershipStatisticsApi;
  }

  @observable
  currentUserWorkspace: UserWorkspaceModel = new UserWorkspaceModel();

  @observable
  selectedUserWorkspace: UserWorkspaceModel = new UserWorkspaceModel();

  @observable
  selectedUserWorkspaceId: string = '';

  @observable
  workspaceOptions: SelectTypeModel[] = [];

  @action
  changeCurrentUserWorkspace(userWorkspace: UserWorkspaceModel): void {
    //
    this.currentUserWorkspace = userWorkspace;
  }

  @action
  clearCurrentUserWorkspace(): void {
    //
    this.currentUserWorkspace = new UserWorkspaceModel();
  }

  @action
  changeSelectedUserWorkspace(userWorkspace: UserWorkspaceModel): void {
    //
    this.selectedUserWorkspace = userWorkspace;
  }

  @action
  clearSelectedUserWorkspace(): void {
    //
    this.selectedUserWorkspace = new UserWorkspaceModel();
  }

  @action
  changeSelectedUserWorkspaceId(userWorkspaceId: string): void {
    //
    this.selectedUserWorkspaceId = userWorkspaceId;
  }

  @action
  clearSelectedUserWorkspaceId(): void {
    //
    this.selectedUserWorkspaceId = '';
  }

  @action
  setWorkspaceOptions(options: SelectTypeModel[]): void {
    //
    this.workspaceOptions = options;
  }

  @action
  clearWorkspaceOptions(): void {
    //
    this.workspaceOptions = [];
  }

  @observable
  annualMembershipStatistics: AnnualMembershipStatistics = new AnnualMembershipStatistics();

  @observable
  annualMembershipStatisticsList: AnnualMembershipStatisticsList[] = [];

  @action
  async findAnnualMembershipStatistics(year: string): Promise<AnnualMembershipStatistics> {
    //
    const result = await this.membershipStatisticsApi.findAnnualMembershipStatistics(year);

    runInAction(() => {
      this.annualMembershipStatistics = new AnnualMembershipStatistics(result);
    });

    return result;
  }

  @action
  clearAnnualMembershipStatistics(): void {
    //
    this.annualMembershipStatistics = new AnnualMembershipStatistics();
  }

  @action
  async findAnnualMembershipStatisticsForMySuniManager(
    userWorkspaceUsid: string,
    year: string
  ): Promise<AnnualMembershipStatistics> {
    //
    const result = await this.membershipStatisticsApi.findAnnualMembershipStatisticsForMySuniManager(
      userWorkspaceUsid,
      year
    );

    runInAction(() => {
      this.annualMembershipStatistics = new AnnualMembershipStatistics(result);
    });

    return result;
  }

  @action
  async findAllAnnualMembershipStatisticsForMySuniManager(
    userWorkspaceUsid: string,
    name: string,
    year: string
  ): Promise<AnnualMembershipStatistics> {
    //
    const result = await this.membershipStatisticsApi.findAnnualMembershipStatisticsForMySuniManager(
      userWorkspaceUsid,
      year
    );
    runInAction(() => {
      this.annualMembershipStatisticsList.push({
        id: userWorkspaceUsid,
        name,
        value: new AnnualMembershipStatistics(result),
      });
    });

    return result;
  }

  @observable
  replayTimeStatistics: AnnualMembershipStatistics = new AnnualMembershipStatistics();

  @observable
  replayTimeStatisticsList: AnnualMembershipStatisticsList[] = [];

  @action
  clearReplayTimeStatistics(): void {
    //
    this.replayTimeStatistics = new AnnualMembershipStatistics();
  }

  @action
  async findReplayTimeStatistics(userWorkspaceUsid: string, year: string): Promise<AnnualMembershipStatistics> {
    //
    const result = await this.membershipStatisticsApi.findReplayTimeStatisticsForMySuniManager(userWorkspaceUsid, year);

    runInAction(() => {
      this.replayTimeStatistics = new AnnualMembershipStatistics(result);
    });

    return result;
  }

  @action
  async findAllReplayTimeStatistics(
    userWorkspaceUsid: string,
    name: string,
    year: string
  ): Promise<AnnualMembershipStatistics> {
    //
    const result = await this.membershipStatisticsApi.findReplayTimeStatisticsForMySuniManager(userWorkspaceUsid, year);
    runInAction(() => {
      this.replayTimeStatisticsList.push({
        id: userWorkspaceUsid,
        name,
        value: new AnnualMembershipStatistics(result),
      });
    });

    return result;
  }

  @observable
  monthlyMembershipStatistics: MonthlyMembershipStatistics[] = [];

  @observable
  monthlyMembershipStatisticsList: MonthlyMembershipStatisticsList[] = [];

  @action
  async findMonthlyMembershipStatistics(year: string): Promise<MonthlyMembershipStatistics[]> {
    //
    const results = await this.membershipStatisticsApi.findMonthlyMembershipStatistics(year);
    runInAction(() => {
      this.monthlyMembershipStatistics = results.map((target) => new MonthlyMembershipStatistics(target));
    });
    return results;
  }

  @action
  async findMonthlyMembershipStatisticsForMySuniManager(
    userWorkspaceUsid: string,
    year: string
  ): Promise<MonthlyMembershipStatistics[]> {
    //
    const results = await this.membershipStatisticsApi.findMonthlyMembershipStatisticsForMySuniManager(
      userWorkspaceUsid,
      year
    );

    runInAction(() => {
      this.monthlyMembershipStatistics = results.map((target) => new MonthlyMembershipStatistics(target));
    });
    return results;
  }

  @action
  async findAllMonthlyMembershipStatisticsForMySuniManager(
    userWorkspaceUsid: string,
    name: string,
    year: string
  ): Promise<MonthlyMembershipStatistics[]> {
    //
    const results = await this.membershipStatisticsApi.findMonthlyMembershipStatisticsForMySuniManager(
      userWorkspaceUsid,
      year
    );
    runInAction(() => {
      this.monthlyMembershipStatisticsList.push({
        id: userWorkspaceUsid,
        name,
        value: results.map((target) => new MonthlyMembershipStatistics(target)),
      });
    });
    return results;
  }

  @action
  clearMonthlyMembershipStatistics(): void {
    //
    this.monthlyMembershipStatistics = [];
  }

  @observable
  passedStudents: PassedStudent[] = [];

  @action
  async findPassedStudents(year: string, month: number): Promise<PassedStudent[]> {
    //
    const results = await this.membershipStatisticsApi.findPassedStudents(year, month);
    runInAction(() => {
      this.passedStudents = results.map((target) => new PassedStudent(target));
    });
    return results;
  }

  @action
  async findPassedStudentsForMySuniManager(
    userWorkspaceId: string,
    year: string,
    month: number
  ): Promise<PassedStudent[]> {
    //
    const results = await this.membershipStatisticsApi.findPassedStudentsForMySuniManager(userWorkspaceId, year, month);
    runInAction(() => {
      this.passedStudents = results.map((target) => new PassedStudent(target));
    });
    return results;
  }

  @action clearPassedStudents(): void {
    //
    this.passedStudents = [];
  }

  @observable
  month: string = '';

  @action
  changeMonth(month: string): void {
    //
    this.month = month;
  }

  @action
  clearMonth(): void {
    //
    this.month = '';
  }

  @observable
  year: string = '';

  @action
  changeYear(year: string): void {
    //
    this.year = year;
  }
}

MembershipStatisticsService.instance = new MembershipStatisticsService(MembershipStatisticsApi.instance);
export default MembershipStatisticsService;
