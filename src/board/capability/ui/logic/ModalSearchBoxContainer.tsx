import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Grid, Segment, Select, Icon, Input } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import { useSearchBox, setSearchBox } from 'board/capability/store/SearchBoxStore';
import {
  requestFindAllCapability,
  requestfindCapabilityGroups,
  selectField,
  requestFindAllCapabilityModal,
} from 'board/capability/service/requestCapability';
import { SearchBox } from 'board/capability/model/SearchBox';
import { findCapabilityGroups } from 'board/capability/api/capabilityApi';
import CapabilityGroup from 'board/capability/model/CapabilityGroup';
import Skill from 'board/capability/model/Skill';

const SEARCH_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  { key: 'COMPETENCYNAME', text: '역량명', value: 'COMPETENCYNAME' },
  { key: 'CREATOR', text: '생성자', value: 'CREATOR' },
  { key: 'UPDATER', text: '수정자', value: 'UPDATER' },
];

interface ModalSearchBoxContainerProps {
  searchBox: SearchBox;
  setCapabilitySkillList: React.Dispatch<React.SetStateAction<Skill[] | undefined>>;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const ModalSearchBoxContainer: React.FC<ModalSearchBoxContainerProps> = function ModalSearchBoxContainer({
  searchBox,
  setCapabilitySkillList,
}) {
  const [startDate, setStartDate] = useState<moment.Moment>();
  const [endDate, setEndDate] = useState<moment.Moment>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('');
  const [capabilityGroupId, setCapabilityGroupId] = useState<string>('');
  const [capabilityGroups, setCapabilityGroups] = useState<any[]>();

  useEffect(() => {
    setCapabilityGroups(selectField());
  }, []);

  useEffect(() => {
    //TODO : 차후 로직 개선 고민
    if (searchType === 'COMPETENCYNAME') {
      setSearchBox({
        ...searchBox,
        capabilityName: searchText || '',
        creatorName: '',
        modifierName: '',
      });
    } else if (searchType === 'CREATOR') {
      setSearchBox({
        ...searchBox,
        capabilityName: '',
        creatorName: searchText || '',
        modifierName: '',
      });
    } else if (searchType === 'UPDATER') {
      setSearchBox({
        ...searchBox,
        capabilityName: '',
        creatorName: '',
        modifierName: searchText || '',
      });
    } else {
      setSearchBox({
        ...searchBox,
        capabilityName: '',
        creatorName: '',
        modifierName: '',
      });
    }
  }, [searchType, searchText]);

  useEffect(() => {
    setSearchBox({
      ...searchBox,
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
      capabilityGroupId,
    });
  }, [capabilityGroupId]);

  const search = useCallback(() => {
    setSearchBox({
      ...searchBox,
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
      capabilityName: '',
    });

    requestFindAllCapabilityModal();

    setCapabilitySkillList([]);
  }, [searchBox]);

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            {capabilityGroups && (
              <Grid.Column width={16}>
                <Form.Group inline>
                  <label>역량군</label>
                  <Form.Field
                    control={Select}
                    placeholder="Select"
                    options={capabilityGroups}
                    // defaultValue={capabilityGroups[0].value}
                    onChange={(e: any, data: any) => {
                      setCapabilityGroupId(data.value);
                    }}
                  />
                </Form.Group>
              </Grid.Column>
            )}
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>검색어</label>
                <Form.Field
                  control={Select}
                  placeholder="Select"
                  options={SEARCH_TYPE_OPTIONS}
                  defaultValue={SEARCH_TYPE_OPTIONS[0].value}
                  onChange={(e: any, data: any) => setSearchType(data.value)}
                  // value={searchBox?.searchType || SEARCH_TYPE_OPTIONS[0].value}
                  // onChange={(e: any, data: any) => setSearchType(data.value)}
                />
                <Form.Field
                  control={Input}
                  width={10}
                  placeholder="검색어를 입력해주세요."
                  disabled={searchType === ''}
                  value={searchText}
                  onChange={(e: any, data: any) => setSearchText(data.value)}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column width={16}>
              <div className="center">
                <Button primary onClick={() => search()}>
                  검색
                </Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
};

export default ModalSearchBoxContainer;
