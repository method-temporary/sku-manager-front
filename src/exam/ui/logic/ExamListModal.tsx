import * as React from 'react';
import {
  Button,
  Form,
  Radio,
  Table,
  Pagination,
  Header,
  Segment,
  Dropdown,
  Input,
  Checkbox,
  InputOnChangeData,
  DropdownProps,
} from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Modal } from 'shared/components';

import { QuestionSelectionTypeText } from 'exam/model/QuestionSelectionType';
import ExamService from '../../present/logic/ExamService';
import { ExamModel } from '../..';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  handleOk?: (selectedExam: ExamModel, type: string, index?: number) => void;
  handleOks?: (selectedExams: ExamModel[], type: string, index?: number) => void;
  classroomIndex?: number;
  type: string;
  multiple?: boolean;
  readonly?: boolean;
}

interface States {}

interface Injected {
  examService: ExamService;
  sharedService: SharedService;
}

@inject('examService', 'sharedService')
@observer
@reactAutobind
class ExamListModal extends ReactComponent<Props, States, Injected> {
  //
  constructor(props: Props) {
    //
    super(props);
    // this.state = { open: false };
  }

  componentDidMount() {
    const { examService } = this.injected;
    if (examService) {
      this.findAllExams();
      this.clearExam();
    }
  }

  componentWillUnmount() {
    const { examService } = this.injected;
    if (examService) {
      examService.changeExamQueryProps('searchType', '');
      examService.changeExamQueryProps('keyword', '');
    }
  }

  clearExam() {
    //
    const { examService } = this.injected;
    if (examService) examService.clearExam();
  }

  findAllExams(page?: number) {
    const { sharedService, examService } = this.injected;
    const { examQuery } = this.injected.examService;
    if (sharedService && examService) {
      let offset = 0;
      if (page) {
        sharedService.setPage('exam', page);
        offset = (page - 1) * examQuery.limit;
      } else sharedService.setPageMap('exam', 0, examQuery.limit);

      examService.changeExamQueryProps('offset', offset);

      examService.findAllExams().then(() => {
        sharedService.setCount('exam', examService.exams._metadata.totalCount);
      });
    }
  }

  onChangeExamProps(name: string, value: string) {
    //
    const { examService } = this.injected;
    if (examService) examService.changeExamProps(name, value);
  }

  handleOk(selectedExam: ExamModel, type: string, index?: number) {
    const { handleOk, onClose } = this.props;
    handleOk!(selectedExam, type, index);
    onClose();
  }

  handleOks(selectedExam: ExamModel[], type: string, index?: number) {
    const { handleOks, onClose } = this.props;
    handleOks!(selectedExam, type, index);
    onClose();
  }

  handleOnSearch(cate: string, name: string) {
    const { examService } = this.injected;
    if (examService) {
      examService.changeExamQueryProps('searchType', cate);
      examService.changeExamQueryProps('keyword', name);
      this.findAllExams();
      this.clearExam();
    }
  }

  selectExamRow(selectedExam: ExamModel, select?: boolean) {
    const { examService } = this.injected;
    const { multiple } = this.props;
    if (multiple === true) {
      if (examService !== undefined) {
        const { appendSelectedExam, removeSelectedExam } = examService;
        if (select === true) {
          appendSelectedExam(selectedExam);
        } else {
          removeSelectedExam(selectedExam.id);
        }
      }
    } else {
      this.onChangeExamProps('authorName', selectedExam.authorName);
      this.onChangeExamProps('title', selectedExam.title);
      this.onChangeExamProps('authorId', selectedExam.authorId);
      this.onChangeExamProps('id', selectedExam.id);
    }
  }

  onClickCancel() {
    const { onClose } = this.props;

    onClose();
  }

  render() {
    const { isOpen, onClose, type, multiple, readonly } = this.props;
    const { exams, exam: selectedExam, selectedExams } = this.injected.examService;
    const { pageMap } = this.injected.sharedService;
    const results = exams && exams.results;
    const metaData = exams && exams._metadata;
    return (
      <>
        {/* test 선택시 활성화 */}
        {/*<span>TCL 통합 Day 관련 시험문제 (2019년 06월) | 홍길동</span>*/}
        <Modal size="large" open={isOpen} onClose={onClose}>
          <ExamListModalHeaderView onSearch={this.handleOnSearch} />
          <Modal.Content scrolling className="fit-layout">
            <Form>
              <Table>
                <colgroup>
                  <col width="10%" />
                  <col width="50%" />
                  <col width="10%" />
                  <col width="10%" />
                  <col width="10%" />
                  <col width="10%" />
                </colgroup>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
                    <Table.HeaderCell>시험이름</Table.HeaderCell>
                    <Table.HeaderCell>출제 방식</Table.HeaderCell>
                    <Table.HeaderCell>최종본 여부</Table.HeaderCell>
                    <Table.HeaderCell>등록일</Table.HeaderCell>
                    <Table.HeaderCell>등록자</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {(results &&
                    results.length &&
                    results.map((exam, index) => {
                      let checked = exam.id === selectedExam.id;
                      if (multiple === true) {
                        checked = selectedExams.some((c) => c.id === exam.id);
                      }
                      const onSelect = () => {
                        if (multiple === true) {
                          this.selectExamRow(exam, !checked);
                        } else {
                          this.selectExamRow(exam);
                        }
                      };
                      return (
                        <Table.Row key={index}>
                          <Table.Cell textAlign="center">
                            <Form.Field
                              control={multiple === true ? Checkbox : Radio}
                              value="1"
                              checked={checked}
                              onChange={onSelect}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <span className="ellipsis">{exam.title}</span>
                          </Table.Cell>
                          <Table.Cell textAlign="center">
                            {QuestionSelectionTypeText[exam.questionSelectionType]}
                          </Table.Cell>
                          <Table.Cell textAlign="center">{exam.finalCopyKr}</Table.Cell>
                          <Table.Cell textAlign="center">{exam.registDate}</Table.Cell>
                          <Table.Cell textAlign="center">{exam.authorName}</Table.Cell>
                        </Table.Row>
                      );
                    })) ||
                    null}
                </Table.Body>
              </Table>
              {metaData && metaData.totalCount === 0 ? null : (
                <div className="center pagination-area">
                  <Pagination
                    activePage={pageMap.get('exam') ? pageMap.get('exam').page : 1}
                    totalPages={pageMap.get('exam') ? pageMap.get('exam').totalPages : 1}
                    onPageChange={(e, data) => this.findAllExams(data.activePage as number)}
                  />
                </div>
              )}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button className="w190 d" onClick={this.onClickCancel}>
              Cancel
            </Button>
            {type === 'classroom' ? (
              <Button className="w190 p" onClick={() => this.handleOk(selectedExam, 'classroom')}>
                OK
              </Button>
            ) : type === 'card' ? (
              <Button className="w190 p" onClick={() => this.handleOks(selectedExams, 'card')}>
                OK
              </Button>
            ) : (
              <Button className="w190 p" onClick={() => this.handleOks(selectedExams, 'cube')}>
                OK
              </Button>
            )}
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

interface ExamListModalHeaderViewProps {
  onSearch: (searchType: string, keyword: string) => void;
}

const ExamListModalHeaderView = ({ onSearch }: ExamListModalHeaderViewProps) => {
  const [searchType, setSearchType] = React.useState('*');
  const [keyword, setKeyword] = React.useState('');

  const onChangeSearchType = (_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setSearchType(data.value as string);
  };

  const onChangeKeyword = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setKeyword(data.value);
  };

  const onSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearch(searchType === '*' ? '' : searchType, keyword);
    }
  };

  const searchInputDisabled = searchType === '*' ? true : false;
  return (
    <Segment vertical clearing style={{ padding: '1rem 1rem 0 1.5rem' }}>
      <Header as="h5" floated="right">
        <Form.Group inline>
          <Form.Field>
            <Dropdown selection options={SelectType.searchExam} value={searchType} onChange={onChangeSearchType} />
            <Input
              icon="search"
              width={2}
              placeholder="Search..."
              onChange={onChangeKeyword}
              onKeyDown={onSearchKeyDown}
              disabled={searchInputDisabled}
            />
          </Form.Field>
        </Form.Group>
      </Header>
      <Header floated="left" aligned="center" style={{ paddingTop: '0.5rem' }}>
        Test 선택
      </Header>
    </Segment>
  );
};

export default ExamListModal;
