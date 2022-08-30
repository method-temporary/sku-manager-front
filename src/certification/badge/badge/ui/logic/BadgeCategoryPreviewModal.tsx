import * as React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';

import { Modal } from 'shared/components';
import { getBadgeCategoryPreviewUrl } from 'shared/helper/urlHelper';

interface Props {
  badgeCategoryId: string;
}

@observer
@reactAutobind
class BadgeCategoryPreviewModal extends React.Component<Props> {
  //
  render() {
    //
    const { badgeCategoryId } = this.props;
    const previewUrl = getBadgeCategoryPreviewUrl(badgeCategoryId);

    return (
      <Modal size="small" trigger={<Button basic>미리보기</Button>}>
        <Modal.Header>Badge 분야 미리보기 Popup</Modal.Header>
        <Modal.Content className="pointer-none">
          <iframe src={previewUrl} title="Badge Preview" scrolling="no" />
        </Modal.Content>
        <Modal.Actions>
          <Modal.CloseButton>확인</Modal.CloseButton>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BadgeCategoryPreviewModal;
