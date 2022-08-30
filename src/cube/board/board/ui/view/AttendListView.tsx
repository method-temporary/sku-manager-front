import * as React from 'react';
import { observer } from 'mobx-react';
import { Grid, Form, Input, Segment, Header, Table, Button, Icon, Breadcrumb } from 'semantic-ui-react';
import moment from 'moment';

import { reactAutobind } from '@nara.platform/accent';

import { SubActions } from 'shared/components';

import { PostQueryModel } from '../../../post/model/PostQueryModel';
import AttendanceView from '../../../post/model/AttendanceView';

interface Props {
  postQuery: PostQueryModel;
  onChangePostQueryProps: (name: string, value: any) => void;
  result: AttendanceView[];
  totalCount: number;
  onSearchPostsBySearchBox: (page?: number) => void;
  findAllAttendExcel: () => void;
}
const sections = [
  { key: 'Home', content: 'HOME', link: true },
  { key: 'Support', content: '서비스 관리', link: true },
  { key: 'Etc', content: '기타 관리', link: true },
  { key: 'CheckAttendanceEvents', content: '출석 이벤트 조회', active: true },
];
@observer
@reactAutobind
class AttendListView extends React.Component<Props> {
  //

  render() {
    const { postQuery, onChangePostQueryProps, result, totalCount, onSearchPostsBySearchBox, findAllAttendExcel } =
      this.props;

    return (
      <>
        <div>
          <Breadcrumb icon="right angle" sections={sections} />
          <Header as="h2">출석 이벤트 조회</Header>
        </div>
        <Segment>
          <Form className="search-box">
            <Grid>
              <Grid.Row>
                <Grid.Column width={16}>
                  <Form.Group inline>
                    <label>이메일</label>
                    <Form.Field
                      control={Input}
                      width={12}
                      placeholder="이메일을 입력해주세요."
                      value={(postQuery && postQuery.searchWord) || ''}
                      onChange={(e: any) => onChangePostQueryProps('searchWord', e.target.value)}
                    />
                  </Form.Group>
                </Grid.Column>
                <Grid.Column width={16}>
                  <div className="center">
                    <Button primary onClick={() => onSearchPostsBySearchBox()}>
                      검색
                    </Button>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Segment>
        <Grid className="list-info">
          <Grid.Row>
            <Grid.Column width={8}>
              <span>
                총 <strong>{totalCount}</strong>건
              </span>
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="right">
                <SubActions.ExcelButton download onClick={async () => findAllAttendExcel()} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Table celled>
          <colgroup>
            <col width="5%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col width="15%" />
            <col />
          </colgroup>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">No</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속사</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">소속 조직(팀)</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">성명</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">E-mail</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">참여일</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">출석시간</Table.HeaderCell>
              <Table.HeaderCell textAlign="center">모바일</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {(result &&
              result.length &&
              result.map((post, index) => (
                <Table.Row key={index}>
                  <Table.Cell textAlign="center">{index + 1}</Table.Cell>
                  <Table.Cell textAlign="center">{post.companyName}</Table.Cell>
                  <Table.Cell textAlign="center">{post.departmentName}</Table.Cell>
                  <Table.Cell textAlign="center">{post.name}</Table.Cell>
                  <Table.Cell textAlign="center">{post.email}</Table.Cell>
                  <Table.Cell textAlign="center">{post.attendDate}</Table.Cell>
                  <Table.Cell textAlign="center">{moment(post.time).format('YYYY.MM.DD HH:mm:ss')}</Table.Cell>
                  <Table.Cell textAlign="center">{post.mobileApp ? 'O' : ''}</Table.Cell>
                </Table.Row>
              ))) || (
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={8}>
                  <div className="no-cont-wrap no-contents-icon">
                    <Icon className="no-contents80" />
                    <div className="sr-only">콘텐츠 없음</div>
                    <div className="text">검색 결과를 찾을 수 없습니다.</div>
                  </div>
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default AttendListView;
