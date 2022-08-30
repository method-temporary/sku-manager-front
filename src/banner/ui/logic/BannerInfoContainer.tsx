import * as React from 'react';
import { inject, observer } from 'mobx-react';

import { reactAutobind, ReactComponent } from '@nara.platform/accent';
import { fileUtil } from '@nara.drama/depot';

import { SharedService } from 'shared/present';
import { FileUploadType, PolyglotModel } from 'shared/model';
import { alert, AlertModel } from 'shared/components';
import { Language } from 'shared/components/Polyglot';

import { BannerService } from '../..';
import BannerInfoView from '../view/BannerInfoView';
import { getBannerItem } from 'banner/present/logic/BannerService';
import { findIndex } from 'lodash';

interface Props {
  onChangeBannerProps: (name: string, value: string | {} | []) => void;
  isUpdatable: boolean;
}

interface Injected {
  bannerService: BannerService;
  sharedService: SharedService;
}

const EXTENSION = {
  IMAGE: 'jpg|png|jpeg|gif',
};

@inject('bannerService', 'sharedService')
@observer
@reactAutobind
class BannerInfoContainer extends ReactComponent<Props, {}, Injected> {
  //

  componentDidMount() {
    //
  }

  async pcUploadFile(file: File, lang: Language) {
    if (!file || (file instanceof File && (!this.validatedAll(file) || !(await this.fileSizeValidatePc(file))))) {
      return;
    }

    const { bannerService, sharedService } = this.injected;
    const { banner } = bannerService;
    const fileName = new PolyglotModel(bannerService.pcFileName);

    const dupImages = Object.assign(banner.images);
    const pcIndex = findIndex(banner.images, { exposureType: 'PC' });
    const pcBanner = getBannerItem(banner.images, 'PC');
    const imageUrl = new PolyglotModel(pcBanner.url);
    const imageAlt = new PolyglotModel(pcBanner.alt);

    if (bannerService) {
      fileName.setValue(lang, file.name);
      bannerService.changeFileNamePc(fileName);
      const filePath = sharedService.uploadFile(file, FileUploadType.Banner);

      filePath.then((value) => {
        imageUrl.setValue(lang, value);
        bannerService.changeBannerProps('pcImageUrl', imageUrl);
      });
      imageAlt.setValue(lang, file.name);

      if (pcIndex === -1) {
        dupImages.push({
          url: imageUrl,
          exposureType: 'PC',
          alt: imageAlt,
        });
      } else {
        dupImages[pcIndex] = {
          url: imageUrl,
          exposureType: 'PC',
          alt: imageAlt,
        };
      }
      bannerService.changeBannerProps('images', dupImages);
      bannerService;
    }
  }

  async mobileUploadFile(file: File, lang: Language) {
    if (!file || (file instanceof File && !this.validatedAll(file))) {
      return;
    }

    const { bannerService, sharedService } = this.injected;
    const { banner } = bannerService;
    const fileName = new PolyglotModel(bannerService.mobileFileName);

    const dupImages = Object.assign(banner.images);
    const mobileIndex = findIndex(banner.images, { exposureType: 'Mobile' });
    const mobileBanner = getBannerItem(banner.images, 'Mobile');
    const imageUrl = new PolyglotModel(mobileBanner.url);
    const imageAlt = new PolyglotModel(mobileBanner.alt);

    if (bannerService) {
      fileName.setValue(lang, file.name);
      bannerService.changeFileNameMobile(fileName);
      const filePath = sharedService.uploadFile(file, FileUploadType.Banner);

      filePath.then((value) => {
        imageUrl.setValue(lang, value);
        bannerService.changeBannerProps('mobileImageUrl', imageUrl);
      });
      imageAlt.setValue(lang, file.name);

      if (mobileIndex === -1) {
        dupImages.push({
          url: imageUrl,
          exposureType: 'Mobile',
          alt: imageAlt,
        });
      } else {
        dupImages[mobileIndex] = {
          url: imageUrl,
          exposureType: 'Mobile',
          alt: imageAlt,
        };
      }

      bannerService.changeBannerProps('images', dupImages);
    }
  }

  readFile(file: File): Promise<string> {
    //
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        resolve(e.target.result);
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file);
    });
  }

  readImage(filePath: string, fitWidth: number, fitHeight: number): Promise<boolean> {
    //
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = filePath;

      image.onload = () => {
        // resolve(image.naturalWidth === fitWidth);
        resolve(image.naturalWidth === fitWidth && image.naturalHeight === fitHeight);
      };
    });
  }

  async fileSizeValidatePc(file: File) {
    //
    const filePath = await this.readFile(file);
    const result = await this.readImage(filePath, 1200, 100);
    const result2 = await this.readImage(filePath, 1200, 200);

    if (!result && !result2) {
      alert(
        AlertModel.getCustomAlert(
          true,
          '파일 크기 제한 안내',
          '1200px X 100px 또는 1200px X 200px 크기의 파일만 업로드 가능합니다.',
          '확인',
          () => {}
        )
      );
      return false;
    }
    return true;
  }

  resolveAfter1Second(): Promise<void> {
    // console.log('starting fast promise');
    return new Promise(() => setTimeout(() => console.log('fast promise is done'), 1000));
  }

  validatedAll(file: File) {
    const validations = [
      { type: 'Extension', validValue: EXTENSION.IMAGE },
      // , { type: ValidationType.MaxSize }
    ] as any[];
    // if (file.size > 1024 * 1024 * 0.3) {
    //   alert(
    //     AlertModel.getCustomAlert(true, '파일 크기 제한 안내', '최대 300KB 이하만 업로드 가능합니다', '확인', () => {})
    //   );
    //   return false;
    // }

    const hasNonPass = validations.some((validation) => {
      if (validation.validator && typeof validation.validator === 'function') {
        return !validation.validator(file);
      } else {
        if (!validation.type || !validation.validValue) {
          // console.warn('validations의 type과 validValue값을 넣어주시거나 validator를 사용해주세요.'); TODO: default size 제한 없음
          return false;
        }
        return !fileUtil.validate(file, [], validation.type, validation.validValue);
      }
    });

    return !hasNonPass;
  }

  render() {
    const { onChangeBannerProps, isUpdatable } = this.props;
    const { pcFileName, mobileFileName, banner, changeBannerExposureType } = this.injected.bannerService;

    return (
      <BannerInfoView
        onChangeBannerProps={onChangeBannerProps}
        pcUploadFile={this.pcUploadFile}
        mobileUploadFile={this.mobileUploadFile}
        changeBannerExposureType={changeBannerExposureType}
        banner={banner}
        pcFileName={pcFileName}
        mobileFileName={mobileFileName}
        isUpdatable={isUpdatable}
      />
    );
  }
}

export default BannerInfoContainer;
