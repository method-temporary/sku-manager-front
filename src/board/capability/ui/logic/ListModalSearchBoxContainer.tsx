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
import { setCapabilityGroup } from 'board/capability/store/CapabilityGroupStore';

const SEARCH_TYPE_OPTIONS = [
  { key: 'ALL', text: '전체', value: 'ALL' },
  { key: 'COMPETENCYNAME', text: '역량명', value: 'COMPETENCYNAME' },
  { key: 'CREATOR', text: '생성자', value: 'CREATOR' },
  { key: 'UPDATER', text: '수정자', value: 'UPDATER' },
];

interface ListModalSearchBoxContainerProps {
  searchBox: SearchBox;
  searchCapability: (capabilityGroupId: any) => void;
}

function timeToDateString(time: number) {
  return moment(time).format('YYYY.MM.DD');
}

const ListModalSearchBoxContainer: React.FC<ListModalSearchBoxContainerProps> = function ListModalSearchBoxContainer({
  searchBox,
  searchCapability,
}) {
  const [startDate, setStartDate] = useState<moment.Moment>();
  const [endDate, setEndDate] = useState<moment.Moment>();
  const [searchText, setSearchText] = useState<string>('');
  const [searchType, setSearchType] = useState<string>('COMPETENCYNAME');
  const [capabilityGroupId, setCapabilityGroupId] = useState<string>('');
  const [capabilityGroups, setCapabilityGroups] = useState<any[]>();

  useEffect(() => {
    setCapabilityGroups(selectField(true));
  }, []);

  useEffect(() => {
    setSearchBox({
      ...searchBox,
      capabilityName: searchText,
      // capabilityGroupName: searchText, TODO : backEnd or 처리 추가 후 주석 제거
    });
  }, [searchType, searchText]);

  useEffect(() => {
    if (capabilityGroupId === '전체') {
      setCapabilityGroupId('');
    }

    setSearchBox({
      ...searchBox,
      limit: 1000,
      startDate: moment().startOf('day').subtract(5, 'y').toDate().getTime(),
      endDate: moment().endOf('day').toDate().getTime(),
      capabilityGroupId,
    });

    requestfindCapabilityGroups(capabilityGroupId).then((capabilityGroups: CapabilityGroup[]) => {
      setCapabilityGroup(capabilityGroups);
      searchCapability(capabilityGroupId);
    });
  }, [capabilityGroupId]);

  const search = useCallback(() => {
    requestFindAllCapabilityModal();
  }, [capabilityGroupId]);

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
                    defaultValue={capabilityGroups[0].value}
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
                  control={Input}
                  width={10}
                  placeholder="검색어를 입력해주세요."
                  // disabled={searchType === ''}
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

export default ListModalSearchBoxContainer;
