import * as React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { SearchBox } from 'shared/components';
import { CommentOffset } from '../../model/CommentOffset';
import { SelectType } from 'shared/model';

interface Props {
  //
  onChangeCommentProp: (name: string, value: any) => void;
  findComments: () => void;

  commentQuery: CommentOffset;
  paginationKey: string;
}

@observer
@reactAutobind
class CommentSearchBox extends ReactComponent<Props, {}> {
  //
  render() {
    //
    const { onChangeCommentProp, findComments } = this.props;
    const { commentQuery, paginationKey } = this.props;

    return (
      <SearchBox
        onSearch={findComments}
        changeProps={onChangeCommentProp}
        queryModel={commentQuery}
        name={paginationKey}
      >
        <SearchBox.Group name="등록일">
          <SearchBox.DatePicker
            startFieldName="period.startDateMoment"
            endFieldName="period.endDateMoment"
            searchButtons
          />
        </SearchBox.Group>
      </SearchBox>
    );
  }
}

export default CommentSearchBox;
