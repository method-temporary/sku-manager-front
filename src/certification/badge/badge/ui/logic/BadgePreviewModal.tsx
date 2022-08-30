import * as React from 'react';
import { observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import { reactAutobind } from '@nara.platform/accent';

import { Modal } from 'shared/components';
import { getBadgePreviewUrl } from 'shared/helper';

interface Props {
  badgeId: string;
}

@observer
@reactAutobind
class BadgePreviewModal extends React.Component<Props> {
  //
  render() {
    //
    const { badgeId } = this.props;
    const previewUrl = getBadgePreviewUrl(badgeId);

    return (
      <Modal size="small" trigger={<Button type="button">미리보기</Button>}>
        <Modal.Header>Badge 미리보기 Popup</Modal.Header>
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

export default BadgePreviewModal;
