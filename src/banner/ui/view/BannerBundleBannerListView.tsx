import * as React from 'react';
import { observer } from 'mobx-react';

import { reactAutobind } from '@nara.platform/accent';

import { FormTable } from 'shared/components';
import Polyglot, { getPolyglotToString } from 'shared/components/Polyglot';

import { BannerModel } from '../..';
import BannerListModal from '../logic/BannerListModal';
import BannerPreviewModal from '../logic/BannerPreviewModal';
import BannerSequenceButtonView from './BannerSequenceButtonView';
import { getImagePath } from 'shared/helper';
import Image from '../../../shared/components/Image/index';
import { find, isEmpty } from 'lodash';
import { PolyglotModel } from 'shared/model';

interface Props {
  onChangeBannerSequence: (banner: BannerModel, oldSeq: number, newSeq: number) => void;
  onDeleteBannerInBannerBundle: (index: number) => void;

  banners: BannerModel[];
  isUpdatable: boolean;
}

@observer
@reactAutobind
class BannerBundleBannerListView extends React.Component<Props> {
  //
  render() {
    const { onChangeBannerSequence, onDeleteBannerInBannerBundle, banners, isUpdatable } = this.props;

    return (
      <FormTable
        title={
          <>
            mySUNI Banner Bundle
            <BannerPreviewModal />
          </>
        }
      >
        {banners &&
          banners.map((banner: BannerModel, index: number) => (
            <FormTable.Row
              key={index}
              name={
                <BannerSequenceButtonView
                  onChangeBannerSequence={onChangeBannerSequence}
                  onDeleteBannerInBannerBundle={onDeleteBannerInBannerBundle}
                  banner={banner}
                  index={index}
                  isUpdatable={isUpdatable}
                />
              }
            >
              <BannerImage images={banner.images} />
            </FormTable.Row>
          ))}
        {isUpdatable ? (
          <FormTable.Row name="Banner 정보">
            <BannerListModal buttonText="Banner 조회" readonly={!isUpdatable} />
          </FormTable.Row>
        ) : null}
      </FormTable>
    );
  }
}
export default BannerBundleBannerListView;

interface BannerImageProps {
  images: {
    alt: PolyglotModel;
    exposureType: 'PC' | 'Mobile';
    url: PolyglotModel;
  }[];
}

function BannerImage({ images }: BannerImageProps) {
  const pcImage = find(images, { exposureType: 'PC' });
  const mobileImage = find(images, { exposureType: 'Mobile' });
  if (!pcImage && !mobileImage) {
    return null;
  }

  return (
    <>
      {(!isEmpty(pcImage?.url.ko) || !isEmpty(mobileImage?.url.ko)) && (
        <>
          <span className="label">ko</span>
          {!isEmpty(pcImage?.url.ko) && <Image src={`${getImagePath()}${pcImage?.url.ko}`} />}
          {!isEmpty(mobileImage?.url.ko) && <Image src={`${getImagePath()}${mobileImage?.url.ko}`} />}
        </>
      )}
      {(!isEmpty(pcImage?.url.en) || !isEmpty(mobileImage?.url.en)) && (
        <>
          <span className="label">en</span>
          {!isEmpty(pcImage?.url.en) && <Image src={`${getImagePath()}${pcImage?.url.en}`} />}
          {!isEmpty(mobileImage?.url.en) && <Image src={`${getImagePath()}${mobileImage?.url.en}`} />}
        </>
      )}

      {(!isEmpty(pcImage?.url.zh) || !isEmpty(mobileImage?.url.zh)) && (
        <>
          <span className="label">zh</span>
          {!isEmpty(pcImage?.url.zh) && <Image src={`${getImagePath()}${pcImage?.url.zh}`} />}
          {!isEmpty(mobileImage?.url.zh) && <Image src={`${getImagePath()}${mobileImage?.url.zh}`} />}
        </>
      )}
    </>
  );
}
