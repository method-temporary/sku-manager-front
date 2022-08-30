import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Button, DropdownProps, Form, Grid, InputOnChangeData, Segment } from 'semantic-ui-react';

import { useFindColleges } from 'college/College.hook';

import { getChannelOptions, getCollegeOptions } from 'card/shared/utiles';
import AutoEncourageCopyModalStore from '../autoEncourageCopyModal.store';

export const CopyModalSearchBox = observer(() => {
  const { selectedCollegeId, selectedChannelId, setCardName, setChannel, setCollege, setOffset } =
    AutoEncourageCopyModalStore.instance;

  const { data: Colleges } = useFindColleges();

  const [searchWord, setSearchWord] = useState('');

  const collegeOptions = getCollegeOptions(Colleges?.results);
  const channelOptions = getChannelOptions(selectedCollegeId, Colleges?.results);

  const onChangeSearchword = (_: React.ChangeEvent, data: InputOnChangeData) => {
    setSearchWord(data.value as string);
  };

  const onChangeCollegeId = (_: React.SyntheticEvent, data: DropdownProps) => {
    setCollege(data.value as string);
    setChannel('');
  };

  const onChangeChannelId = (_: React.SyntheticEvent, data: DropdownProps) => {
    setChannel(data.value as string);
  };

  const onSearch = () => {
    setOffset(1);
    setCardName(searchWord);
  };

  const onKeyPressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Segment>
      <div className="ui form search-box">
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Form.Group inline>
                <label>Category</label>
                <Form.Select
                  value={selectedCollegeId}
                  placeholder="전체"
                  options={collegeOptions}
                  onChange={onChangeCollegeId}
                />
                <Form.Select
                  value={selectedChannelId}
                  placeholder="전체"
                  options={channelOptions}
                  onChange={onChangeChannelId}
                  disabled={selectedCollegeId === ''}
                />
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <Form.Group inline>
                <label>검색어</label>
                <Form.Input
                  width={16}
                  placeholder="검색어를 입력해주세요."
                  value={searchWord}
                  onChange={onChangeSearchword}
                  onKeyPress={onKeyPressEnter}
                />
                <Button className="note_btn" onClick={onSearch} style={{ width: '100px' }}>
                  검색
                </Button>
              </Form.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Segment>
  );
});
