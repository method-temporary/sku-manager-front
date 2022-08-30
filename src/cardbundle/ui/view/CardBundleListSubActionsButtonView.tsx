import * as React from 'react';
import { ReactComponent } from '@nara.platform/accent';
import { Button } from 'semantic-ui-react';
import { SubActions } from 'shared/components';

interface Props {
  routeToCreateCardBundle: () => void;
  onRemoveCardBundle: () => void;
  onModifyEnableCardBundles: () => void;
  onModifyDisableCardBundles: () => void;
}

class CardBundleListSubActionsButtonView extends ReactComponent<Props> {
  //
  render() {
    //
    const { routeToCreateCardBundle, onRemoveCardBundle, onModifyEnableCardBundles, onModifyDisableCardBundles } =
      this.props;

    return (
      <SubActions.Right>
        <Button primary onClick={onModifyEnableCardBundles}>
          사용
        </Button>
        <Button primary onClick={onModifyDisableCardBundles}>
          사용 중지
        </Button>
        <Button primary onClick={onRemoveCardBundle}>
          삭제
        </Button>
        <Button onClick={routeToCreateCardBundle}>생성</Button>
      </SubActions.Right>
    );
  }
}

export default CardBundleListSubActionsButtonView;
