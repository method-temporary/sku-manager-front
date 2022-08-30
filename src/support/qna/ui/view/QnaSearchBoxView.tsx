import * as React from 'react';
import { observer } from 'mobx-react';
import { Form, Select, Grid } from 'semantic-ui-react';

import { reactAutobind } from '@nara.platform/accent';

import { SearchBox, SearchBoxFieldView } from 'shared/ui';
import { SelectTypeModel, SelectType } from 'shared/model';

import { QnaQueryModel } from 'support/qna/model/sdo/QnaQueryModel';

interface Props {
  qnaQuery: QnaQueryModel;
  onChangeQnaQueryProps: (name: string, value: any) => void;
  onClearQnaQueryProps: () => void;
  onSearchQnaBySearchBox: (page?: number) => void;
  stateList: SelectTypeModel[];
  channelList: SelectTypeModel[];
  mainCategoryList: SelectTypeModel[];
  subCategoryList: SelectTypeModel[];
}
@observer
@reactAutobind
class QnaSearchBoxView extends React.Component<Props> {
  //
  render() {
    //
    const {
      qnaQuery,
      onChangeQnaQueryProps,
      onClearQnaQueryProps,
      onSearchQnaBySearchBox,
      stateList,
      channelList,
      mainCategoryList,
      subCategoryList,
    } = this.props;
    return (
      <>
        <SearchBox
          onSearch={onSearchQnaBySearchBox}
          onChangeQueryProps={onChangeQnaQueryProps}
          onClearQueryProps={onClearQnaQueryProps}
          queryModel={qnaQuery}
          searchWordOption={SelectType.searchPartForQna}
          collegeAndChannel={false}
          defaultPeriod={1}
        >
          <SearchBoxFieldView
            fieldTitle="처리상태"
            fieldOption={stateList}
            onChangeQueryProps={onChangeQnaQueryProps}
            targetValue={(qnaQuery && qnaQuery.state.toString()) || 'All'}
            queryFieldName="state"
          />
          <SearchBoxFieldView
            fieldTitle="접수채널"
            fieldOption={channelList}
            onChangeQueryProps={onChangeQnaQueryProps}
            targetValue={(qnaQuery && qnaQuery.requestChannel.toString()) || 'All'}
            queryFieldName="requestChannel"
          />
          <Grid.Column width={8}>
            <Form.Group inline>
              <label>{'카테고리'}</label>
              <Form.Field
                control={Select}
                placeholder={'Select'}
                options={mainCategoryList}
                value={(qnaQuery && qnaQuery.mainCategoryId) || 'All'}
                onChange={(e: any, data: any) => onChangeQnaQueryProps('mainCategoryId', data.value)}
              />
              <Form.Field
                disabled={
                  qnaQuery.mainCategoryId !== 'All' &&
                  qnaQuery.mainCategoryId !== null &&
                  qnaQuery.mainCategoryId !== undefined
                    ? false
                    : true
                }
                control={Select}
                placeholder={'Select'}
                options={subCategoryList}
                value={(qnaQuery && qnaQuery.subCategoryId) || 'All'}
                onChange={(e: any, data: any) => onChangeQnaQueryProps('subCategoryId', data.value)}
              />
            </Form.Group>
          </Grid.Column>
        </SearchBox>
      </>
    );
  }
}

export default QnaSearchBoxView;
