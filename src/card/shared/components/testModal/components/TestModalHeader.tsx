import React from 'react';
import { observer } from 'mobx-react';
import { Dropdown, Form, Header, Input, Segment } from 'semantic-ui-react';
import TestModalStore from '../TestModal.store';

const examSearchType = [
  { key: '1', text: '전체', value: '' },
  { key: '2', text: '제목', value: 'T' },
  { key: '3', text: '등록자', value: 'C' },
];

const TestModalHeader = observer(() => {
  //
  const { searchType, searchWord, setSearchType, setSearchWord, setOffset, setExamPaperAdminRdo } =
    TestModalStore.instance;

  const onChangeSearchType = (value: string) => {
    //
    setSearchType(value);
    if (value === '') {
      setSearchWord('');
      onSearch();
    }
  };

  const onKeyDown = (e: any) => {
    //
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const onSearch = () => {
    //
    setOffset(1);
    setExamPaperAdminRdo();
  };

  return (
    <Segment vertical clearing style={{ padding: '1rem 1rem 0 1.5rem' }}>
      <Header as="h5" floated="right">
        <Form.Group inline>
          <Form.Field>
            <Dropdown
              selection
              options={examSearchType}
              value={searchType}
              placeholder="전체"
              onChange={(_, data: any) => onChangeSearchType(data.value)}
            />
            <Input
              icon="search"
              width={2}
              value={searchWord}
              disabled={searchType === ''}
              placeholder="Search..."
              onChange={(_, data) => setSearchWord(data.value)}
              onKeyDown={onKeyDown}
            />
          </Form.Field>
        </Form.Group>
      </Header>
      <Header floated="left" aligned="center" style={{ paddingTop: '0.5rem' }}>
        Test 선택
      </Header>
    </Segment>
  );
});

export default TestModalHeader;
