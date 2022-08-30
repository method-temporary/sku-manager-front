import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Icon, Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getUserHostName } from '../../../../../shared/helper/hostName';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import dayjs from 'dayjs';

interface Props {}

export const CourseHistorySearchBox = observer((props: Props) => {
  //
  // const [startDate, setStartDate] = useState(dayjs().subtract(3, 'd'));

  // 임시도메인 수정
  const resultPageURL =
    process.env.NODE_ENV === 'development'
      ? `/api/contentprovider/public/cpcontents/coursera`
      : // : `https://mysuni.sk.com/api/contentprovider/public/cpstudents/coursera`;
        `https://${getUserHostName()}/api/contentprovider/public/cpcontents/coursera`;

  // const resultPageURL = `https://new.mysuni.sk.com/api/contentprovider/cpcontents/admin/coursera`;

  const onClickButton = () => {
    //
    // console.log(resultPageURL);
    window.open(resultPageURL, '', '_blank');
  };

  return (
    <Table celled>
      <colgroup>
        <col width="20%" />
        <col width="80%" />
      </colgroup>
      <Table.Body>
        <Table.Row>
          <Table.Cell>강의 정보 가져오기</Table.Cell>
          <Table.Cell>
            <Form>
              <Form.Group>
                <Form.Field>
                  <Button className="file-select-btn" onClick={onClickButton}>
                    API호출
                  </Button>
                </Form.Field>
                {/*<Form.Field>*/}
                {/*  <div className="ui input right icon">*/}
                {/*    <DatePicker*/}
                {/*      placeholderText="날짜를 선택해주세요."*/}
                {/*      selected={startDate.toDate()}*/}
                {/*      onChange={(date: Date) => setStartDate(dayjs(date).startOf('d'))}*/}
                {/*      dateFormat="yyyy.MM.dd"*/}
                {/*      maxDate={moment().toDate()}*/}
                {/*    />*/}
                {/*    <Icon name="calendar alternate outline" />*/}
                {/*  </div>*/}
                {/*</Form.Field>*/}
              </Form.Group>
              <p>※ 처리 완료까지 약 10분 소요 예상됩니다.</p>
            </Form>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
});
