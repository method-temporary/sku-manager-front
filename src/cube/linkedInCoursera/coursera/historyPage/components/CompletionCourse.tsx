import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, Form, Icon, Table } from 'semantic-ui-react';
import { getUserHostName } from '../../../../../shared/helper/hostName';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import moment from 'moment';

export const CompletionCourse = observer(() => {
  //
  const [startDate, setStartDate] = useState(dayjs().subtract(3, 'd'));

  const resultPageURL =
    process.env.NODE_ENV === 'development'
      ? `/api/contentprovider/public/cpstudents/coursera?startDate=${startDate.valueOf()}`
      : `https://${getUserHostName()}/api/contentprovider/public/cpstudents/coursera?startDate=${startDate.valueOf()}`;

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
          <Table.Cell>학습완료 처리</Table.Cell>
          <Table.Cell>
            <Form>
              <Form.Group>
                <Form.Field>
                  <Button className="file-select-btn2" onClick={onClickButton}>
                    API호출
                  </Button>
                </Form.Field>
                <Form.Field>
                  <div className="ui input right icon">
                    <DatePicker
                      placeholderText="날짜를 선택해주세요."
                      selected={startDate.toDate()}
                      onChange={(date: Date) => setStartDate(dayjs(date).startOf('d'))}
                      dateFormat="yyyy.MM.dd"
                      maxDate={moment().toDate()}
                    />
                    <Icon name="calendar alternate outline" />
                  </div>
                </Form.Field>
              </Form.Group>
              <p>※ 처리 완료까지 약 10분 소요 예상됩니다.</p>
            </Form>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
});
