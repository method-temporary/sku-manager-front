import * as React from 'react';
import { inject, observer } from 'mobx-react';

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
  InputOnChangeData,
  DropdownProps,
} from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SelectType } from 'shared/model';
import { SharedService } from 'shared/present';
import { Modal } from 'shared/components';

import SurveyFormService from '../../form/present/logic/SurveyFormService';
import { SurveyFormModel } from '../../form/model/SurveyFormModel';
import '@nara.drama/approval/lib/snap.css';

interface Props {
  surveyFormService?: SurveyFormService;
  sharedService?: SharedService;
  handleOk: (surveyForm: SurveyFormModel, type: string, classroomIndex?: number) => void;
  classroomIndex?: number;
  type: string;
  readonly?: boolean;
}

interface States {}

@inject('surveyFormService', 'sharedService')
@observer
@reactAutobind
class SurveyListModal extends React.Component<Props, States> {
  //

  constructor(props: Props) {
    super(props);
  }

  componentDidMount() {
    this.props.surveyFormService!.changeSurveyFormQueryProp('period.startDateMoment', 0);
    this.props.surveyFormService!.changeSurveyFormQueryProp('period.endDateMoment', 0);
    this.props.surveyFormService!.changeSurveyFormQueryProp('finalCopy', true);
    this.props
      .surveyFormService!.countAllSurveyForms()
      .then((totalCount) => this.props.sharedService!.setCount('surveyForms', totalCount));
    this.findAllSurveyFormsByQuery();
    this.clearSurveyForm();
  }

  componentWillUnmount() {
    const { surveyFormService } = this.props;
    if (surveyFormService) {
      surveyFormService.changeSurveyFormQueryProp('searchPart', '');
      surveyFormService.changeSurveyFormQueryProp('searchWord', '');
    }
  }

  async findAllSurveyFormsByQuery(page?: number) {
    const { sharedService, surveyFormService } = this.props;
    if (sharedService && surveyFormService) {
      const { surveyFormQuery } = surveyFormService;
      let offset = 0;
      if (page) {
        sharedService.setPage('surveyForms', page);
        offset = (page - 1) * surveyFormQuery.limit;
      } else sharedService.setPageMap('surveyForms', 0, surveyFormQuery.limit);

      surveyFormService.changeSurveyFormQueryProp('offset', offset);
      surveyFormService.findAllSurveyFormsByQuery().then((queryList) => {
        if (queryList !== undefined) {
          sharedService!.setCount('surveyForms', queryList.totalCount);
        }
      });
    }
  }

  handlePageChange(page: number) {
    this.props.sharedService!.setPage('surveyForms', page);
    this.props.surveyFormService!.findAllSurveyFormsByQuery();
  }

  clearSurveyForm() {
    //
    const { surveyFormService } = this.props;
    if (surveyFormService) surveyFormService.clearSurveyFormProps();
  }

  clearSurvey() {
    //
    const { surveyFormService } = this.props;
    if (surveyFormService) surveyFormService.clear();
  }

  handleClickRadioButton(surveyForm: SurveyFormModel) {
    //
    const { surveyFormService } = this.props;
    if (surveyFormService) surveyFormService.setSurveyForm(surveyForm);
  }

  handleOnSearch(searchType: string, keyword: string) {
    const { sharedService, surveyFormService } = this.props;
    if (surveyFormService) {
      surveyFormService.changeSurveyFormQueryProp('searchPart', searchType);
      surveyFormService.changeSurveyFormQueryProp('searchWord', keyword);
      this.findAllSurveyFormsByQuery();
      this.clearSurveyForm();
    }
  }

  onOpenModal() {
    // this.setState({
    //   open: true,
    // });
  }

  onCloseModal() {
    // this.setState({
    //   open: false,
    // });
  }

  handleOk(surveyFormModel: SurveyFormModel, type: string, classroomIndex?: number) {
    const { handleOk } = this.props;
    handleOk(surveyFormModel, type, classroomIndex);
    this.onCloseModal();
  }

  render() {
    const {
      surveyFormsList,
      surveyForms,
      surveyForm: selectedSurveyForm,
    } = this.props.surveyFormService || ({} as SurveyFormService);
    const { pageMap } = this.props.sharedService || ({} as SharedService);
    const { classroomIndex, type, readonly } = this.props;
    return (
      <>
        <React.Fragment>
          <Modal
            size="large"
            // open={this.state.open}
            // onOpen={this.onOpenModal}
            // onClose={this.onCloseModal}
            trigger={<>{readonly ? null : <Button type="button">Survey 찾기</Button>}</>}
          >
            <SurveyListModalHeaderView onSearch={this.handleOnSearch} />
            {/* <Modal.Header>Survey 선택</Modal.Header> */}
            <Modal.Content scrolling className="fit-layout">
              <Form>
                <Table>
                  <colgroup>
                    <col width="10%" />
                    <col width="%" />
                    <col width="20%" />
                    <col width="20%" />
                  </colgroup>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell textAlign="center">Select</Table.HeaderCell>
                      <Table.HeaderCell>제목</Table.HeaderCell>
                      <Table.HeaderCell>등록일</Table.HeaderCell>
                      <Table.HeaderCell>등록자</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {(surveyFormsList &&
                      surveyFormsList.results.length &&
                      surveyFormsList.results.map((surveyForm, index) => (
                        <Table.Row key={index}>
                          <Table.Cell textAlign="center">
                            <Form.Field
                              control={Radio}
                              value="1"
                              checked={surveyForm.id === selectedSurveyForm.id}
                              onChange={() => this.handleClickRadioButton(surveyForm)}
                            />
                          </Table.Cell>
                          <Table.Cell>{surveyForm.title}</Table.Cell>
                          <Table.Cell textAlign="center">{surveyForm.timeStr}</Table.Cell>
                          <Table.Cell textAlign="center">{surveyForm.formDesignerName}</Table.Cell>
                        </Table.Row>
                      ))) ||
                      null}
                  </Table.Body>
                </Table>
                {surveyFormsList && surveyFormsList.results.length === 0 && surveyFormsList.totalCount === 0 ? null : (
                  <div className="center pagination-area">
                    <Pagination
                      activePage={pageMap.get('surveyForms') ? pageMap.get('surveyForms').page : 1}
                      totalPages={pageMap.get('surveyForms') ? pageMap.get('surveyForms').totalPages : 1}
                      onPageChange={(e, data) => this.findAllSurveyFormsByQuery(data.activePage as number)}
                    />
                  </div>
                )}
              </Form>
            </Modal.Content>
            <Modal.Actions>
              <Modal.CloseButton className="w190 d" onClick={() => this.onCloseModal()} type="button">
                Cancel
              </Modal.CloseButton>
              {type === 'classroom' ? (
                <Modal.CloseButton
                  className="w190 p"
                  onClick={() => this.handleOk(selectedSurveyForm, 'classroom', classroomIndex)}
                  type="button"
                >
                  OK
                </Modal.CloseButton>
              ) : (
                <Modal.CloseButton
                  className="w190 p"
                  onClick={() => this.handleOk(selectedSurveyForm, 'cube')}
                  type="button"
                >
                  OK
                </Modal.CloseButton>
              )}
            </Modal.Actions>
          </Modal>
        </React.Fragment>
      </>
    );
  }
}

interface SurveyListModalHeaderViewProps {
  onSearch: (searchType: string, keyword: string) => void;
}

const SurveyListModalHeaderView = ({ onSearch }: SurveyListModalHeaderViewProps) => {
  const [searchType, setSearchType] = React.useState('전체');
  const [keyword, setKeyword] = React.useState('');

  const onChangeSearchType = (_: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setSearchType(data.value as string);
  };

  const onChangeKeyword = (_: React.ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    setKeyword(data.value);
  };

  const onSearchKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      onSearch(searchType === '전체' ? '' : searchType, keyword);
    }
  };

  const searchInputDisabled = searchType === '전체' ? true : false;
  return (
    <Segment vertical clearing style={{ padding: '1rem 1rem 0 1.5rem' }}>
      <Header as="h5" floated="right">
        <Form.Group inline>
          <Form.Field>
            <Dropdown selection options={SelectType.searchSurvey} value={searchType} onChange={onChangeSearchType} />
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
        Survey 선택
      </Header>
    </Segment>
  );
};

export default SurveyListModal;
