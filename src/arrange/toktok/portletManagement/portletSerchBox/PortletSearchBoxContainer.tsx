import React from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { SearchDateView, SearchKeywordView, SearchCineroomView } from 'shared/ui';
import { useAvailableWorkspaceOptions } from 'shared/hooks';
import {
  onChangeEndDate,
  onChangekeyword,
  onChangeKeywordType,
  onChangeStartDate,
  onClickDate,
  onClickSearch,
  onChangeCineroom,
} from './portletSearchBox.events';
import { usePortletSearchBox } from './portletSearchBox.stores';

export function PortletSearchBoxContainer() {
  const portletSearchBox = usePortletSearchBox();
  const availableOptions = useAvailableWorkspaceOptions();

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            {portletSearchBox !== undefined && (
              <>
                <SearchDateView
                  startDate={portletSearchBox.startDate}
                  endDate={portletSearchBox.endDate}
                  selectedDate={portletSearchBox.selectedDate}
                  onChangeStartDate={onChangeStartDate}
                  onChangeEndDate={onChangeEndDate}
                  onClickDate={onClickDate}
                />
                <SearchCineroomView
                  cineroom={portletSearchBox.cineroom}
                  onChangeCineroom={onChangeCineroom}
                  options={availableOptions}
                />
                <SearchKeywordView
                  keyword={portletSearchBox.keyword}
                  keywordType={portletSearchBox.keywordType}
                  onChangeKeyword={onChangekeyword}
                  onChangeKeywordType={onChangeKeywordType}
                  selectOptions={selectOptions}
                />
                <Grid.Column width={16}>
                  <div className="center">
                    <Button primary onClick={onClickSearch}>
                      검색
                    </Button>
                  </div>
                </Grid.Column>
              </>
            )}
          </Grid.Row>
        </Grid>
      </Form>
    </Segment>
  );
}

const selectOptions = [
  { key: 'all', value: '', text: '전체' },
  { key: 'title', value: 'title', text: '제목' },
  { key: 'creatorName', value: 'creatorName', text: '생성자' },
];
