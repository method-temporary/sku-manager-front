import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Select, Tab } from 'semantic-ui-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SubActions } from 'shared/components';

import { CommentListContainer } from 'feedback/comment';
import { ServiceType } from 'student';
import { SurveyFormModel, SurveyFormSummary } from 'survey';
import SurveyManagementContainer from 'survey/ui/logic/SurveyManagementContainer';

import { CubeModel } from '../../model/CubeModel';
import { ClassroomGroupModel } from '../../../classroom/model/sdo/ClassroomGroupModel';

interface Props {
  onDownLoadSurveyExcel: (surveyId: string, surveyCaseId: string) => Promise<string>;
  onSelectClassroom: (classroomId: string) => void;

  cube: CubeModel;
  classroomGroup: ClassroomGroupModel;
  round: number;
  selectedClassroomId: string;
  surveyId: string;
  surveyCaseId: string;

  surveyForm: SurveyFormModel;
  feedbackId: string;
}

interface States {}

@observer
@reactAutobind
class SurveyInfoView extends ReactComponent<Props, States> {
  //
  render() {
    //
    const { onDownLoadSurveyExcel, onSelectClassroom } = this.props;
    const { cube, classroomGroup, round, selectedClassroomId, surveyId, surveyCaseId, surveyForm, feedbackId } =
      this.props;

    return !surveyId || !surveyCaseId ? (
      <>
        <Tab.Pane>
          <div className="center">
            <div className="no-cont-wrap no-contents-icon">
              <Icon className="no-contents80" />
              <div className="sr-only">콘텐츠 없음</div>
              <div className="text">설문이 없습니다.</div>
            </div>
          </div>
        </Tab.Pane>
      </>
    ) : (
      <>
        <br />
        <div className="flat-btn">
          <SubActions.ExcelButton
            onClick={async () => {
              await onDownLoadSurveyExcel(surveyId, surveyCaseId);
            }}
          >
            <Icon name="file excel outline" />
            엑셀 다운로드
          </SubActions.ExcelButton>
        </div>
        <Tab.Pane attached={false}>
          <Tab
            panes={[
              {
                menuItem: '통계',
                render: () => (
                  <Tab.Pane>
                    {selectedClassroomId && (
                      <Form.Field
                        control={Select}
                        className="small-border"
                        placeHolder="차수를 선택하세요"
                        options={
                          classroomGroup &&
                          classroomGroup.classrooms &&
                          classroomGroup.classrooms.length &&
                          classroomGroup.classrooms.map((classroom, index) => ({
                            key: classroom.id,
                            text: `${index + 1}차수`,
                            value: classroom.id,
                          }))
                        }
                        value={selectedClassroomId}
                        onChange={(e: any, data: any) => onSelectClassroom(data.value)}
                      />
                    )}
                    <SurveyFormSummary surveyFormId={surveyId} surveyCaseId={surveyCaseId} round={round} />
                  </Tab.Pane>
                ),
              },
              // {
              //   menuItem: '상세',
              //   render: () => (
              //     <Tab.Pane>
              //       <SurveyManagementContainer
              //         surveyFormId={surveyId}
              //         surveyCaseId={surveyCaseId}
              //         serviceType={ServiceType.Cube}
              //         id={cube.id}
              //       />
              //     </Tab.Pane>
              //   ),
              // },
              // {
              //   menuItem: '댓글',
              //   render: () => (
              //     <>
              //       <Tab.Pane attached={false}>
              //         <CommentListContainer feedbackId={feedbackId} />
              //       </Tab.Pane>
              //     </>
              //   ),
              // },
            ]}
          />
          {/*<SurveyDetail />*/}
        </Tab.Pane>
      </>
    );
  }
}

export default SurveyInfoView;
