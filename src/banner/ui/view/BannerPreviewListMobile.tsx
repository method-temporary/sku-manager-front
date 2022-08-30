import * as React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';
import { BannerModel } from '../..';
import Polyglot from 'shared/components/Polyglot';
import { getBannerItem, isEmptyPolyglotModel } from 'banner/present/logic/BannerService';

interface Props {
  banners: BannerModel[];
}

class BannerPreviewListMobile extends React.Component<Props> {
  //
  // imagePath = getImagePath();

  render() {
    const params = {
      loop: false,
      effect: 'fade',
      autoplay: {
        /*delay: 7000,*/
        delay: 1000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.navi .swiper-pagination',
        clickable: true,
      },
      navigation: {
        prevEl: '.navi .swiper-button-prev',
        nextEl: '.navi .swiper-button-next',
      },
      containerClass: `banner-preview mobile`,
    };

    const { banners } = this.props;
    const bannerPreviewList = banners.filter((item) => {
      const mobileImages = getBannerItem(item.images, 'Mobile');

      return !isEmptyPolyglotModel(mobileImages.url);
    });

    return (
      <div className="swiper-section">
        <Swiper {...params}>
          {bannerPreviewList?.map((item, index) => (
            <Polyglot languages={item.langSupports}>
              <div className="swiper-slide" key={`preview-banner-${index}`}>
                {/*<Image src={item.imageUrl && item.imageUrl} alt={item.imageAlt && item.imageAlt} />*/}
                <Polyglot.Image languageStrings={item.images[0].url} uploadFile={() => {}} />
              </div>
            </Polyglot>
          ))}
        </Swiper>
        {/*banner pagination*/}
        {bannerPreviewList?.length > 1 ? (
          <div className="navi">
            <div className="swiper-button-prev" />
            <div className="swiper-pagination" />
            <div className="swiper-button-next" />
          </div>
        ) : null}
      </div>
    );
  }
}
export default BannerPreviewListMobile;
