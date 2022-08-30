import React from 'react';
import { observer } from 'mobx-react';
import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { Button, Icon } from 'semantic-ui-react';
import { BannerModel } from '../..';

interface Props {
  onChangeBannerSequence: (banner: BannerModel, oldSeq: number, newSeq: number) => void;
  onDeleteBannerInBannerBundle: (index: number) => void;
  banner: BannerModel;
  index: number;
  isUpdatable: boolean;
}

@observer
@reactAutobind
class BannerSequenceButtonView extends ReactComponent<Props> {
  //
  render() {
    //
    const { onChangeBannerSequence, onDeleteBannerInBannerBundle, banner, index, isUpdatable } = this.props;
    //

    return (
      <div>
        <p>{index + 1}. Banner 정보</p>
        {banner.images[0].url || banner.images[1].url !== null ? (
          <Button disabled={!isUpdatable} icon size="mini" basic onClick={() => onDeleteBannerInBannerBundle(index)}>
            <Icon name="minus" />
          </Button>
        ) : null}
        {banner.images[0].url || banner.images[1].url !== null ? (
          <>
            <Button
              disabled={!isUpdatable}
              icon
              size="mini"
              basic
              onClick={() => onChangeBannerSequence(banner, index, index + 1)}
            >
              <Icon name="angle down" />
            </Button>
            <Button
              disabled={!isUpdatable}
              icon
              size="mini"
              basic
              onClick={() => onChangeBannerSequence(banner, index, index - 1)}
            >
              <Icon name="angle up" />
            </Button>
          </>
        ) : null}
      </div>
    );
  }
}

export default BannerSequenceButtonView;
