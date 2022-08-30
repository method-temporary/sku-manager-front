import React from 'react';
import { Input, Table } from 'semantic-ui-react';

import { FileBox } from '@nara.drama/depot';

import { Row } from './MenuInputView';
import {
  ChangeName,
  ChangeDiscussionTopic,
  ChangeDiscussionUrl,
  ChangeDiscussionTitle,
} from '../../service/useSelectedMenu';

interface PostMenuInputViewProps {
  name: string;
  discussionTopic: string;
  changeName: ChangeName;
  changeDiscussionTopic: ChangeDiscussionTopic;
  changeDiscussionTitle: ChangeDiscussionTitle;
  changeDiscussionUrl: ChangeDiscussionUrl;
}

const PostMenuInputView: React.FC<PostMenuInputViewProps> = function PostMenuInputView({
  name,
  discussionTopic,
  changeName,
  changeDiscussionTopic,
  changeDiscussionTitle,
  changeDiscussionUrl,
}) {
  // const [urlTitle, setUrlTitle]

  return (
    <>
      <Row title="메뉴명">
        <Input fluid placeholder="메뉴명을 입력하세요" value={name} onChange={changeName} />
      </Row>
      <Row title="주제">
        <Input fluid value={discussionTopic} onChange={changeDiscussionTopic} />
      </Row>
      <Row title="내용">
        <Input>
          <Table.Cell className="pop-editor">
            {/* <TextEditor
                // modules={SelectType.modules}
                // formats={SelectType.formats}
                placeholder="토론하고자 하는 상세 내용을 입력해주세요."
                // onChange={(html) =>
                //   this.onChangeStudentRequestProps(
                //     html === '<p><br></p>' ? '' : html
                //   )
                // }
                // value={mailCont}
              />  */}
          </Table.Cell>
        </Input>
      </Row>
      <Row title="관련 URL">
        <Input
          style={{ margin: '20px 0' }}
          maxLength={100}
          fluid
          action={{
            icon: { name: 'minus', link: true },
            // onClick: this.handleAddAnswerItem,
          }}
          defaultValue="https://"
          // value={newAnswerItem.values.langStringMap.get(code) || ''}
          // onChange={this.handleChangeNewAnswerItem}
        />
        <Input fluid placeholder="관련 URL 입력해주세요" onChange={(e) => changeDiscussionTitle(e)} />
        <Input
          style={{ margin: '5px 0' }}
          maxLength={100}
          fluid
          action={{
            icon: { name: 'plus', link: true },
            // onClick: this.handleAddAnswerItem,
          }}
          defaultValue="https://"
          // value={changeDiscussionUrl || ''}
          onChange={(e) => changeDiscussionUrl(e)}
        />
      </Row>
      <Row title="첨부파일">
        <div className="lg-attach">
          <div className="attach-inner">
            <FileBox
            // id={post && post.contents && post.contents.depotId || ''}
            // vaultKey={{ keyString: 'sku-depot', patronType: PatronType.Pavilion }}
            // patronKey={{ keyString: 'sku-denizen', patronType: PatronType.Denizen }}
            // validations={[{ type: ValidationType.Duplication, validator: DepotUtil.duplicationValidator }]}
            // onChange={this.getFileBoxIdForReference}
            />
            <ol className="info-text-gray" style={{ textAlign: 'left' }}>
              - DOC, PDF, EXL, JPEG, PNG 파일을 등록하실 수 있습니다.
            </ol>
            <ol className="info-text-gray" style={{ textAlign: 'left' }}>
              - 최대 10MB 용량의 파일을 등록하실 수 있습니다.
            </ol>
            {/* <div>
              {
                filesMap && filesMap.get('reference')
                && filesMap.get('reference').map((foundedFile: DepotFileViewModel, index: number) => (
                  <p key={index}><a onClick={() => depot.downloadDepotFile(foundedFile.id)}>{foundedFile.name}</a></p>
                )) || '-'
              }
            </div> */}
          </div>
        </div>
      </Row>
    </>
  );
};

export default PostMenuInputView;
