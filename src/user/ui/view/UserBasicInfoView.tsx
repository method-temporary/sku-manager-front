import React from 'react';
import { Checkbox, Form, RadioProps, Table } from 'semantic-ui-react';
import Image from 'shared/components/Image/Image';
import { RadioGroup } from 'shared/components';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { UserInfoUdoQueryModel } from '../../model/UserInfoUdoQueryModel';
import { UserDetailModel } from '../../model/UserDetailModel';
import Polyglot from 'shared/components/Polyglot';
import { getGenderValues, isMale } from '../logic/UserHelper';

interface Props {
  updatable: boolean;
  skProfileInfoUdoQuery: UserInfoUdoQueryModel;
  userDetail: UserDetailModel;
  onChangeGender: (e: React.SyntheticEvent<HTMLInputElement>, { value }: RadioProps) => void;
  onChangeBirthDate: (date: Date) => void;
}

@observer
@reactAutobind
class UserBasicInfoView extends ReactComponent<Props> {
  //
  render() {
    //
    const { updatable, userDetail, skProfileInfoUdoQuery, onChangeGender, onChangeBirthDate } = this.props;
    const { user, pisAgreement } = userDetail;

    let photoFilePath: string = '';

    if (user.useGdiPhoto) {
      photoFilePath = `${process.env.REACT_APP_SK_IM_PHOTO_ROOT_URL}${user.photoImagePath}`;
    } else {
      photoFilePath = user.photoImagePath;
    }

    return (
      <Table celled>
        <colgroup>
          <col width="20%" />
          <col width="80%" />
        </colgroup>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan={2} className="title-header">
              기본 정보
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell className="tb-header">사진 profile</Table.Cell>
            <Table.Cell>
              <div className="profile-img size110 line">
                <Image src={photoFilePath} />
              </div>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">사번</Table.Cell>
            <Table.Cell>{user.employeeId}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">성명</Table.Cell>
            <Table.Cell>
              <Polyglot.Input name="name" languageStrings={user.name} readOnly />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">성별</Table.Cell>
            <Table.Cell>
              {updatable ? (
                <>
                  <Form.Group>
                    <RadioGroup
                      values={getGenderValues(skProfileInfoUdoQuery.gender)}
                      value={skProfileInfoUdoQuery.gender}
                      labels={['남', '여']}
                      onChange={(e, data: RadioProps) => onChangeGender(e, data)}
                    />
                  </Form.Group>
                </>
              ) : (
                <>{skProfileInfoUdoQuery.gender ? (isMale(skProfileInfoUdoQuery.gender) ? '남' : '여') : ''}</>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">생년월일</Table.Cell>
            <Table.Cell>
              {updatable ? (
                <DatePicker
                  placeholderText="생년월일을 입력해주세요."
                  selected={
                    skProfileInfoUdoQuery.birthDate ? new Date(skProfileInfoUdoQuery.birthDate) : moment().toDate()
                  }
                  onChange={(date: Date) => onChangeBirthDate(date)}
                  dateFormat="yyyy.MM.dd"
                  maxDate={moment().toDate()}
                />
              ) : (
                <>{skProfileInfoUdoQuery.birthDate || ''}</>
              )}
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">회사명</Table.Cell>
            <Table.Cell>
              {/*{getPolyglotToString(user.companyName)} */}
              <Polyglot.Input name="companyName" languageStrings={user.companyName} readOnly />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">소속부서명</Table.Cell>
            <Table.Cell>
              {/*{getPolyglotToString(user.departmentName)}*/}
              <Polyglot.Input name="departmentName" languageStrings={user.departmentName} readOnly />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">연락처</Table.Cell>
            <Table.Cell>{user.phone}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">E-mail</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">가입일자</Table.Cell>
            <Table.Cell>{user.getCreationTime}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell className="tb-header">개인정보 동의여부</Table.Cell>
            <Table.Cell>
              <Form.Field control={Checkbox} checked={pisAgreement.signedDate !== 0} readOnly />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
  }
}

export default UserBasicInfoView;
