import * as React from 'react';
import { Button, Image, Table } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import '../../../../style/css/pdfstyle.css';
import { RouteComponentProps, withRouter } from 'react-router';
import moment from 'moment';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Document, Page, StyleSheet, View } from '@react-pdf/renderer';

import { PageModel, SortFilterState } from 'shared/model';
import { SharedService } from 'shared/present';
import { Loader, SubActions } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';

import { StudentService } from 'student';
import { ProposalState } from 'student/model/vo/ProposalState';
import { LearningState } from 'student/model/vo/LearningState';

import { CardService } from '../../../card';
import { CollegeService } from '../../../../college';

import { displayResultLearningState } from './CardStudentHepler';
import dayjs from 'dayjs';
import { LoaderService } from '../../../../shared/components/Loader';

interface Props extends RouteComponentProps<Params> {}

interface Params {
  cardId: string;
}

interface State {
  numPages: any;
  pageNumber: number;
}

interface Injected {
  cardService: CardService;
  studentService: StudentService;
  collegeService: CollegeService;
  sharedService: SharedService;
  loaderService: LoaderService;
}

const styles = StyleSheet.create({
  view: {
    padding: '10px',
  },
});

@inject('cardService', 'studentService', 'collegeService', 'sharedService', 'loaderService')
@observer
@reactAutobind
class CardResultReportPDF extends ReactComponent<Props, State, Injected> {
  //
  paginationKey = 'cardResult';

  state = {
    numPages: null,
    pageNumber: 1,
  };

  async componentDidMount() {
    //
    const { loaderService } = this.injected;
    //card 조회
    loaderService.openLoader();
    await this.findCard();
    //students 조회
    await this.findStudentResult();
    loaderService.closeLoader();
  }

  async findCard() {
    //
    const { cardId } = this.props.match.params;
    const { cardService } = this.injected;

    await cardService.findCardById(cardId);
  }

  async findStudentResult() {
    //
    const { cardId } = this.props.match.params;
    const { studentService, sharedService } = this.injected;

    const {
      findCardStudents,
      changeSelectedStudents,
      changeSelectedStudentIds,
      changeSelectedStudentEmails,
      changeSelectedStudentNames,
      changeSelectedStudentUserIds,
      findAllCardStudentsPDF,
    } = studentService;

    studentService.changeStudentQueryProps('cardId', cardId);
    studentService.changeStudentQueryProps('period.startDateMoment', dayjs().subtract(100, 'y').startOf('d'));
    // studentService.changeStudentQueryProps('proposalState', ProposalState.Approved);
    studentService.changeStudentQueryProps('studentOrderBy', SortFilterState.ModifiedTimeDesc);

    const pageModel = this.injected.sharedService.getPageModel(this.paginationKey);

    const totalCount = await findAllCardStudentsPDF();

    changeSelectedStudentIds([]);
    changeSelectedStudents([]);
    changeSelectedStudentEmails([]);
    changeSelectedStudentNames([]);
    changeSelectedStudentUserIds([]);

    // await setStudentInfo(studentService.students, studentService, memberService);

    sharedService.setCount(this.paginationKey, totalCount);

    await studentService.findStudentCount(cardId);
  }

  onClickPrint() {
    window.print();
  }

  render() {
    //
    const { cardService, studentService, sharedService, collegeService } = this.injected;
    const { cardQuery, cardContentsQuery } = cardService;
    const { students } = studentService;
    const { collegesMap, channelMap } = collegeService;
    const { startNo, count } = sharedService.getPageModel(this.paginationKey);

    const studentsCount = students.length;
    const passedCount = students.filter((s) => s.student.learningState === LearningState.Passed).length;
    const passedRate = Number((passedCount / studentsCount) * 100).toFixed(2);

    const collegeName = collegesMap.get(cardQuery.mainCategory.collegeId);
    const channelName = channelMap.get(cardQuery.mainCategory.channelId);

    return (
      <div>
        <Loader>
          <div className="hide-print" style={{ width: '1050px' }}>
            <SubActions>
              <SubActions.Right>
                <Button onClick={this.onClickPrint}>인쇄</Button>
              </SubActions.Right>
            </SubActions>
          </div>
          <Document>
            <Page size="A4">
              <View style={styles.view}>
                <div>
                  <div className="pace pace-inactive">
                    <div className="pace-progress" style={{ transform: 'translate3d(100%, 0px, 0px)' }}>
                      <div className="pace-progress-inner" />
                    </div>
                    <div className="pace-activity" />
                  </div>
                  <div id="dvData">
                    <h2 className="report_title">mySUNI 교육 결과 리포트</h2>
                    <div className="fieldset">
                      <form className="report_form">
                        <input type="hidden" id="page" name="page" value="1" />
                        <input type="hidden" id="intRow" name="intRow" value="20" />
                        <input type="hidden" name="course_id" id="course_id" value="11111" />
                        <input type="hidden" name="chasu_val" id="chasu_val" value="301" />

                        <input type="hidden" name="s_pass" id="s_pass" value="A" />
                        <input type="hidden" name="s_st_prgrs" id="s_st_prgrs" value="" />
                        <input type="hidden" name="s_end_prgrs" id="s_end_prgrs" value="" />
                        <input type="hidden" name="s_answer" id="s_answer" value="" />
                        <input type="hidden" name="s_survey" id="s_survey" value="" />
                        <input type="hidden" name="s_keyword" id="s_keyword" value="NM" />
                        <input type="hidden" name="s_text" id="s_text" value="" />

                        <table style={{ width: '100%' }}>
                          <tbody>
                            <tr>
                              <td className="report_sub">
                                {`■ Channel : `}
                                <label>{`${collegeName} > ${channelName}`}</label>
                              </td>
                            </tr>
                            <tr>
                              <td className="report_sub">
                                {/*■ 과정명 :<label id="course_title">[[MIT Tech. Review] 배달 플랫폼과 라이더의 전쟁</label>*/}
                                ■ 과정명 : <label id="course_title">{getPolyglotToAnyString(cardQuery.name)}</label>
                              </td>
                            </tr>
                            <tr>
                              <td className="report_sub">
                                ■ 교육기간 :
                                <label id="term_chasu">{` ${moment(
                                  cardContentsQuery.learningPeriod.startDateMoment
                                ).format('YYYY-MM-DD')} - ${moment(
                                  cardContentsQuery.learningPeriod.endDateMoment
                                ).format('YYYY-MM-DD')}`}</label>
                              </td>
                            </tr>
                            <tr>
                              <td className="report_sub"> ■ 대상인원</td>
                            </tr>
                            <tr>
                              <td>
                                <table>
                                  <tbody>
                                    <tr>
                                      <td id="conn_user_cnt" className="stat_number_val">
                                        <table className="listTable" id="listTable">
                                          <thead>
                                            <tr>
                                              {/*TODO: css fixed*/}
                                              <th style={{ border: '1px' }}>수강인원</th>
                                              <th style={{ border: '1px' }}>이수인원</th>
                                              <th style={{ border: '1px' }}>이수율(%)</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              {/*TODO: css fixed*/}

                                              <th style={{ border: '1px' }}>
                                                {/*<label id="CONFIRM_CNT">30</label>*/}
                                                <label id="CONFIRM_CNT">{studentsCount}</label>
                                              </th>
                                              <th style={{ border: '1px' }}>
                                                {/*<label id="FINCNT">30</label>*/}
                                                <label id="FINCNT">{passedCount}</label>
                                              </th>
                                              <th style={{ border: '1px' }}>
                                                <label id="FIN_PROGRESS">{passedRate}</label>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </form>
                    </div>
                    <p className="report_sub" style={{ paddingLeft: '10px' }}>
                      {`  ■ 개인별 결과`}
                    </p>
                    <Table className="listTable">
                      <colgroup>
                        <col width="14%" />
                        <col width="*" />
                        <col width="14%" />
                        <col width="*" />
                      </colgroup>
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell colSpan="8" id="conn_user_cnt" className="stat_number_val">
                            <Table celled id="lstList">
                              <colgroup>
                                <col width="50px" />
                                <col width="150px" />
                                <col width="150px" />
                                <col width="80px" />
                                <col width="80px" />
                                <col width="150px" />
                                <col width="80px" />
                                <col width="150px" />
                                <col width="100px" />
                              </colgroup>
                              <Table.Header>
                                <Table.Row>
                                  <Table.HeaderCell textAlign="center">No.</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">소속조직(팀)</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">직책</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">이수여부</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">이수일</Table.HeaderCell>
                                  <Table.HeaderCell textAlign="center">이수번호</Table.HeaderCell>
                                </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {students &&
                                  students.map((studentInfo, index) => {
                                    const { student, userIdentity } = studentInfo;

                                    //
                                    return (
                                      <Table.Row>
                                        <Table.Cell textAlign="center">{startNo - index}</Table.Cell>
                                        <Table.Cell textAlign="center">
                                          {getPolyglotToAnyString(userIdentity.companyName)}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">
                                          {getPolyglotToAnyString(userIdentity.departmentName)}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">{student.name}</Table.Cell>
                                        <Table.Cell textAlign="center">{userIdentity.duty}</Table.Cell>
                                        <Table.Cell textAlign="center">{userIdentity.email}</Table.Cell>
                                        <Table.Cell textAlign="center">
                                          {displayResultLearningState(student.learningState)}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">
                                          {student.passedTime !== 0
                                            ? moment(student.passedTime).format('YYYY.MM.DD HH:mm:ss')
                                            : '-'}
                                        </Table.Cell>
                                        <Table.Cell textAlign="center">{studentInfo.passedNumber || '-'}</Table.Cell>
                                      </Table.Row>
                                    );
                                  })}
                              </Table.Body>
                            </Table>
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </div>
                </div>
                <div className="confirmation-wrap">
                  <div className="txt-box">
                    <p className="txt">위와 같이 온라인 교육 과정을 이수 하였음을 확인합니다.</p>
                    <p className="date">{moment().format('YYYY-MM-DD')}</p>
                  </div>
                  <div className="img-box">
                    <Image src={`${process.env.PUBLIC_URL}/images/logo_print.png`} className="message-icon" />
                  </div>
                </div>
              </View>
            </Page>
          </Document>
        </Loader>
      </div>
    );
  }
}

export default withRouter(CardResultReportPDF);
