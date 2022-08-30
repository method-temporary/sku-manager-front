import React from 'react';
import { Button } from 'semantic-ui-react';

import { Modal } from 'shared/components';
import { getPolyglotToAnyString } from 'shared/components/Polyglot';
import { HtmlEditor } from 'shared/ui';

import { LearningContentWithOptional } from '../../../model/learningContentWithOptional';

interface Props {
  //
  chapter: LearningContentWithOptional;
}

class ChapterDescModal extends React.Component<Props> {
  //
  render() {
    //
    const { chapter } = this.props;

    return (
      <Modal trigger={<Button>소개 보기</Button>}>
        <Modal.Header>{getPolyglotToAnyString(chapter.name)} 소개</Modal.Header>
        <Modal.Content>
          <HtmlEditor
            readOnly
            value={chapter.description ? getPolyglotToAnyString(chapter.description) : '소개글이 없습니다.'}
          />
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton>닫기</Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ChapterDescModal;
