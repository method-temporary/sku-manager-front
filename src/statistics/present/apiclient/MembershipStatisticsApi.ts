import { axiosApi as axios } from 'shared/axios/Axios';
import AnnualMembershipStatistics from '../../model/dto/AnnualMembershipStatistics';
import MonthlyMembershipStatistics from '../../model/dto/MonthlyMembershipStatistics';
import PassedStudent from '../../model/dto/PassedStudent';
import { setExcelHistoryParams } from 'shared/components/SubActions/sub/ExcelButton/store/ExcelHistoryStore';

class MembershipStatisticsApi {
  //
  static instance: MembershipStatisticsApi;

  URL = '/api/data-search/membershipstat';

  findAnnualMembershipStatistics(year: string): Promise<AnnualMembershipStatistics> {
    //
    return axios
      .getLoader(this.URL + `/annualStat?year=${year}`)
      .then((response) => (response && response.data) || null);
  }

  findAnnualMembershipStatisticsForMySuniManager(
    userWorkspaceId: string,
    year: string
  ): Promise<AnnualMembershipStatistics> {
    //
    return axios
      .getLoader(this.URL + `/annualStatByUserWorkspaceId?userWorkspaceId=${userWorkspaceId}&year=${year}`)
      .then((response) => (response && response.data) || null);
  }

  findReplayTimeStatisticsForMySuniManager(userWorkspaceId: string, year: string): Promise<AnnualMembershipStatistics> {
    //
    return axios
      .getLoader(this.URL + `/replayStatByUserWorkspaceId?userWorkspaceId=${userWorkspaceId}&year=${year}`)
      .then((response) => (response && response.data) || null);
  }

  findMonthlyMembershipStatistics(year: string): Promise<MonthlyMembershipStatistics[]> {
    //
    return axios
      .getLoader(this.URL + `/monthlyStat?year=${year}`)
      .then((response) => (response && response.data) || null);
  }

  findMonthlyMembershipStatisticsForMySuniManager(
    userWorkspaceId: string,
    year: string
  ): Promise<MonthlyMembershipStatistics[]> {
    //
    return axios
      .getLoader(this.URL + `/monthlyStatByUserWorkspaceId?userWorkspaceId=${userWorkspaceId}&year=${year}`)
      .then((response) => (response && response.data) || null);
  }

  findPassedStudents(year: string, month: number): Promise<PassedStudent[]> {
    //
    const apiUrl = this.URL + `/passedStudents?year=${year}&month=${month}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: `year=${year}&month=${month}`,
      workType: 'Excel Download',
    });

    return axios.get(apiUrl).then((response) => (response && response.data) || null);
  }

  findPassedStudentsForMySuniManager(userWorkspaceId: string, year: string, month: number): Promise<PassedStudent[]> {
    //
    const apiUrl =
      this.URL + `/passedStudentsByUserWorkspaceId?userWorkspaceId=${userWorkspaceId}&year=${year}&month=${month}`;

    setExcelHistoryParams({
      searchUrl: apiUrl,
      searchParam: `userWorkspaceId=${userWorkspaceId}&year=${year}&month=${month}`,
      workType: 'Excel Download',
    });

    return axios
      .get(apiUrl, {
        params: month,
      })
      .then((response) => (response && response.data) || null);
  }
}

MembershipStatisticsApi.instance = new MembershipStatisticsApi();
export default MembershipStatisticsApi;
