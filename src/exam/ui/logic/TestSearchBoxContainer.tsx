import React from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { SearchDateView, SearchKeywordView } from 'shared/ui';
import { useTestSearchBoxViewModel } from 'exam/store/TestSearchBoxStore';
import {
  onChangeEndDate,
  onChangeKeyword,
  onChangeKeywordType,
  onChangeQuestionSelectionType,
  onChangeStartDate,
  onChangeVersionState,
  onClickDate,
  onClickSearch,
} from 'exam/handler/TestSearchBoxHandler';
import { SearchStateTypeView } from '../view/SearchStateTypeView';

export function TestSearchBoxContainer() {
  const testSearchBox = useTestSearchBoxViewModel();

  return (
    <Segment>
      <Form className="search-box">
        <Grid>
          <Grid.Row>
            {testSearchBox !== undefined && (
              <>
                <SearchDateView
                  startDate={testSearchBox.startDate}
                  endDate={testSearchBox.endDate}
                  selectedDate={testSearchBox.selectedDate}
                  onChangeStartDate={onChangeStartDate}
                  onChangeEndDate={onChangeEndDate}
                  onClickDate={onClickDate}
                />
                <SearchStateTypeView
                  searchState={testSearchBox.versionState}
                  searchType={testSearchBox.questionSelectionType}
                  onChangeState={onChangeVersionState}
                  onChangeType={onChangeQuestionSelectionType}
                />
                <SearchKeywordView
                  keyword={testSearchBox.keyword}
                  keywordType={testSearchBox.keywordType}
                  onChangeKeyword={onChangeKeyword}
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
  { key: 'company', value: 'title', text: '제목' },
  { key: 'department', value: 'authorName', text: '등록자' },
];
