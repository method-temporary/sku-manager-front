import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind } from '@nara.platform/accent';
import { MemberViewModel } from '@nara.drama/approval';
import { Button, Select, Table, Form, Input, Icon, Segment } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import { SelectType, SelectTypeModel } from 'shared/model';
import { Image } from 'shared/components';

import { InstructorCdoModel } from '../../model/InstructorCdoModel';

import ManagerListModalView from '../../../../cube/cube/ui/view/ManagerListModal';
import Polyglot from 'shared/components/Polyglot';

interface Props {
  instructorId?: string;
  instructorCdo: InstructorCdoModel;
  changeInstructorCdoProps: (name: string, value: any) => void;
  collegesSelect: SelectTypeModel[];
  uploadFile: (file: File) => void;
  onClickOrgChart: (member: MemberViewModel) => void;
}

@observer
@reactAutobind
class InstructorCreateView extends React.Component<Props> {
  //
  fileInputRef = React.createRef<HTMLInputElement>();

  render() {
    //
    const { instructorId, instructorCdo, changeInstructorCdoProps, collegesSelect, uploadFile, onClickOrgChart } =
      this.props;

    return (
      <Form>
        <Table celled>
          <colgroup>
            <col width="10%" />
            <col width="40%" />
            <col width="10%" />
            <col width="40%" />
          </colgroup>

          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan={4} className="title-header">
                강사 정보
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell lassName="tb-header">지원 언어</Table.Cell>
              <Table.Cell colSpan={3}>
                <Polyglot.Languages onChangeProps={changeInstructorCdoProps} />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell lassName="tb-header">기본 언어</Table.Cell>
              <Table.Cell colSpan={3}>
                <Polyglot.Default onChangeProps={changeInstructorCdoProps} />
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell className="tb-header">강사구분</Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    width={4}
                    control={Select}
                    placeholder="Select"
                    disabled={!!instructorId}
                    options={SelectType.detailForInstructorInternal}
                    value={instructorCdo.internal}
                    onChange={(e: any, data: any) => {
                      changeInstructorCdoProps('internal', data.value);
                      changeInstructorCdoProps('denizenId', '');
                      changeInstructorCdoProps('email', '');
                      changeInstructorCdoProps('phone', '');
                      changeInstructorCdoProps('employeeId', '');

                      instructorCdo.name.init();
                      instructorCdo.position.init();
                      instructorCdo.organization.init();
                    }}
                  />
                </Form.Group>
              </Table.Cell>
              <Table.Cell className="tb-header">강의활동 여부</Table.Cell>
              <Table.Cell>
                <Form.Group>
                  <Form.Field
                    width={4}
                    control={Select}
                    placeholder="Select"
                    options={SelectType.detailForResting}
                    value={instructorCdo.resting}
                    onChange={(e: any, data: any) => {
                      changeInstructorCdoProps('resting', data.value);
                    }}
                  />
                </Form.Group>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">
                Category <span className="required">*</span>
              </Table.Cell>
              <Table.Cell colSpan={3}>
                <Form.Group>
                  <Form.Field
                    width={4}
                    control={Select}
                    placeholder="Select"
                    options={collegesSelect}
                    value={instructorCdo.collegeId || ''}
                    onChange={(e: any, data: any) => {
                      changeInstructorCdoProps('collegeId', data.value);
                    }}
                  />
                </Form.Group>
              </Table.Cell>
            </Table.Row>
            {instructorCdo.internal && (
              <Table.Row>
                <Table.Cell>
                  사내 강사 <span className="required">*</span>
                </Table.Cell>
                <Table.Cell colSpan={3}>
                  <ManagerListModalView handleOk={onClickOrgChart} buttonName="조직도" multiSelect={false} />
                </Table.Cell>
              </Table.Row>
            )}
            <Table.Row>
              <Table.Cell>사번</Table.Cell>
              <Table.Cell>
                <Form.Field disabled control={Input} placeholder="" value={instructorCdo.employeeId || ''} />
              </Table.Cell>
              <Table.Cell>
                이름
                {!instructorCdo.internal && <span className="required">*</span>}
              </Table.Cell>
              <Table.Cell>
                {/*<Form.Field*/}
                {/*  disabled={instructorCdo.internal}*/}
                {/*  control={Input}*/}
                {/*  placeholder="Please enter the name."*/}
                {/*  value={instructorCdo.name.value}*/}
                {/*  onChange={(e: any) => {*/}
                {/*    //*/}
                {/*    const name = new LanguageStrings(instructorCdo.name);*/}

                {/*    name.setValue('kr', e.target.value);*/}

                {/*    changeInstructorCdoProps('name', name);*/}
                {/*  }}*/}
                {/*/>*/}

                <Polyglot.Input
                  name="name"
                  onChangeProps={changeInstructorCdoProps}
                  languageStrings={instructorCdo.name}
                  disabled={instructorCdo.internal}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell className="tb-header">직위</Table.Cell>
              <Table.Cell>
                {/*<Form.Field*/}
                {/*  disabled={instructorCdo.internal}*/}
                {/*  control={Input}*/}
                {/*  placeholder="Please enter the position."*/}
                {/*  value={instructorCdo.position.value}*/}
                {/*  onChange={(e: any) => {*/}
                {/*    //*/}
                {/*    const position = new LanguageStrings(instructorCdo.position);*/}

                {/*    position.setValue('kr', e.target.value);*/}

                {/*    changeInstructorCdoProps('position', position);*/}
                {/*  }}*/}
                {/*/>*/}

                <Polyglot.Input
                  name="position"
                  onChangeProps={changeInstructorCdoProps}
                  languageStrings={instructorCdo.position}
                  disabled={instructorCdo.internal}
                />
              </Table.Cell>

              <Table.Cell className="tb-header">
                소속기관/부서
                {!instructorCdo.internal && <span className="required">*</span>}
              </Table.Cell>

              <Table.Cell>
                {/*<Form.Field*/}
                {/*  disabled={instructorCdo.internal}*/}
                {/*  control={Input}*/}
                {/*  placeholder="Please enter the agency/department."*/}
                {/*  value={instructorCdo.organization.value}*/}
                {/*  onChange={(e: any) => {*/}
                {/*    //*/}
                {/*    const organization = new LanguageStrings(instructorCdo.organization);*/}

                {/*    organization.setValue('kr', e.target.value);*/}

                {/*    changeInstructorCdoProps('organization', organization);*/}
                {/*  }}*/}
                {/*/>*/}

                <Polyglot.Input
                  name="organization"
                  onChangeProps={changeInstructorCdoProps}
                  languageStrings={instructorCdo.organization}
                  disabled={instructorCdo.internal}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>E-mail</Table.Cell>
              <Table.Cell colSpan={3}>
                <Form.Field
                  disabled={instructorCdo.internal}
                  control={Input}
                  placeholder="E-mail을 입력해주세요."
                  value={instructorCdo.email || ''}
                  onChange={(e: any) => changeInstructorCdoProps('email', e.target.value)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>연락처</Table.Cell>
              <Table.Cell colSpan={3}>
                <Form.Field
                  disabled={instructorCdo.internal}
                  control={Input}
                  placeholder="연락처를 입력해주세요.( XXX-XXXX-XXXX )"
                  value={instructorCdo.phone || ''}
                  onChange={(e: any) => changeInstructorCdoProps('phone', e.target.value)}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>태그</Table.Cell>
              <Table.Cell colSpan={3}>
                {/*<Form.Field*/}
                {/*  control={Input}*/}
                {/*  placeholder="Please enter the tag."*/}
                {/*  value={instructorCdo.tag}*/}
                {/*  onChange={(e: any) => changeInstructorCdoProps('tag', e.target.value)}*/}
                {/*/>*/}

                <Polyglot.Input
                  name="tag"
                  onChangeProps={changeInstructorCdoProps}
                  languageStrings={instructorCdo.tag}
                />
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell className="tb-header">이미지</Table.Cell>
              <Table.Cell>
                <Button
                  className="file-select-btn"
                  content={instructorCdo.fileName || '파일 선택'}
                  labelPosition="left"
                  icon="file"
                  onClick={() => {
                    if (this.fileInputRef && this.fileInputRef.current) {
                      this.fileInputRef.current.click();
                    }
                  }}
                />
                <input
                  id="file"
                  type="file"
                  ref={this.fileInputRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => e.target.files && uploadFile(e.target.files[0])}
                  hidden
                />

                {instructorCdo.previewPhotoPath && (
                  <div className="profile-img size110 line">
                    <Segment.Inline>
                      <Image src={`${instructorCdo.previewPhotoPath}`} size="small" verticalAlign="bottom" />
                    </Segment.Inline>
                  </div>
                )}
                <div style={{ paddingTop: '1em' }}>
                  <p className="info-text-gray">- JPG, JPEG, PNG, GIF 파일을 등록하실 수 있습니다.</p>
                  <p className="info-text-gray">- 이미지 최적 크기는 가로 300PX 입니다.</p>
                </div>
              </Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>세부 강의 분야</Table.Cell>
              <Table.Cell colSpan={3}>
                {/*<div*/}
                {/*  className={classNames('ui right-top-count input', {*/}
                {/*    focus: false,*/}
                {/*    write: instructorCdo.lectureField || '',*/}
                {/*    error: instructorCdo.lectureField.value.length === 1000 || false,*/}
                {/*  })}*/}
                {/*>*/}
                {/*  <span className="count">*/}
                {/*    <span className="now">{instructorCdo.lectureField.value.length}</span>/*/}
                {/*    <span className="max">1000</span>*/}
                {/*  </span>*/}
                {/*  <textarea*/}
                {/*    placeholder="Please enter the detailed lecture field."*/}
                {/*    value={instructorCdo.lectureField.value}*/}
                {/*    onChange={(e: any) => {*/}
                {/*      //*/}
                {/*      const lectureField = new LanguageStrings(instructorCdo.lectureField);*/}

                {/*      if (e.target.value.length < 1001) {*/}
                {/*        lectureField.setValue('kr', e.target.value);*/}
                {/*      } else {*/}
                {/*        lectureField.setValue('kr', e.target.value.substring(0, 1000));*/}
                {/*      }*/}
                {/*      changeInstructorCdoProps('lectureField', lectureField);*/}
                {/*    }}*/}
                {/*  />*/}
                {/*</div>*/}

                <Polyglot.TextArea
                  name="lectureField"
                  onChangeProps={changeInstructorCdoProps}
                  languageStrings={instructorCdo.lectureField}
                  maxLength={1000}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>경력</Table.Cell>
              <Table.Cell colSpan={3}>
                {/*<div*/}
                {/*  className={classNames('ui right-top-count input', {*/}
                {/*    focus: false,*/}
                {/*    write: instructorCdo.career || '',*/}
                {/*    error: instructorCdo.career.value.length === 1000 || false,*/}
                {/*  })}*/}
                {/*>*/}
                {/*  <span className="count">*/}
                {/*    <span className="now">{instructorCdo.career.value.length}</span>/<span className="max">1000</span>*/}
                {/*  </span>*/}
                {/*  <textarea*/}
                {/*    placeholder="Key Experiences"*/}
                {/*    value={instructorCdo.career.value}*/}
                {/*    onChange={(e: any) => {*/}
                {/*      //*/}
                {/*      const career = new LanguageStrings(instructorCdo.career);*/}

                {/*      if (e.target.value.length < 1001) {*/}
                {/*        career.setValue('kr', e.target.value);*/}
                {/*      } else {*/}
                {/*        career.setValue('kr', e.target.value.substring(0, 1000));*/}
                {/*      }*/}
                {/*      changeInstructorCdoProps('career', career);*/}
                {/*    }}*/}
                {/*  />*/}
                {/*</div>*/}

                <Polyglot.TextArea
                  name="career"
                  onChangeProps={changeInstructorCdoProps}
                  languageStrings={instructorCdo.career}
                  maxLength={1000}
                />
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>강사임용일</Table.Cell>
              <Table.Cell colSpan={3}>
                <div className="fields">
                  <div className="field">
                    <div className="ui input right icon">
                      <DatePicker
                        placeholderText="시작날짜를 선택해주세요."
                        selected={moment(instructorCdo.appointmentDate).toDate()}
                        onChange={(date: Date) => {
                          changeInstructorCdoProps('appointmentDate', moment(date).format('YYYY-MM-DD'));
                        }}
                        dateFormat="yyyy.MM.dd"
                      />
                      <Icon name="calendar alternate outline" />
                    </div>
                  </div>
                </div>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Form>
    );
  }
}

export default InstructorCreateView;
