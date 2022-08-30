import { useEffect } from 'react';
import { find, isEmpty } from 'lodash';
import { CheckboxProps, DropdownProps } from 'semantic-ui-react';

import { IdName } from '@nara.platform/accent';

import { SharedApi } from 'shared/present';
import { CardthumbnailSizeValidator, extensionValidator } from 'shared/ui';
import { getImagePath } from 'shared/helper';
import { createStore } from 'shared/store';

import CubeApi from 'cube/cube/present/apiclient/CubeApi';
import { MediaType } from 'cubetype';
import CardService from './CardService';

import {
  CardThumbnailSelect,
  CardThumbnailSelectRadio,
  UploadThumbnail,
  ThumbnailSet,
} from 'card/card/model/CardThumbnailSelectModel';

export const [setCardSelectThumbnail, onCardSelectThumbnail, getCardSelectThumbnail, useCardSelectThumbnail] =
  createStore<CardThumbnailSelect>();

export const [setSelectedOption, onSelectedOption, getSelectedOption, useSelectedOption] = createStore<string>();
export const [setSelectedThumbnailSet, onSelectedThumbnailSet, getSelectedThumbnailSet, useSelectedThumbnailSet] =
  createStore<ThumbnailSet[]>();

export function initCardthumbnailSelect(): CardThumbnailSelect {
  return {
    thumbnailImageUrl: '',
    selectRadio: 'thumbnailSet' as CardThumbnailSelectRadio,
    uploadThumbnail: {} as UploadThumbnail,
    panoptoThumbnails: [],
    thumbnailSelectOptions: [],
  };
}

function getSelectOption(thumbnailIconGroup: IdName[]) {
  const parsethumbnailIconGroup = thumbnailIconGroup.map((item) => {
    return {
      key: item.id,
      value: item.id,
      text: item.name,
    };
  });

  parsethumbnailIconGroup.push({
    key: 'panopto',
    value: 'panopto',
    text: 'panopto thumbnail',
  });
  return parsethumbnailIconGroup;
}

export function useCardThumbnail() {
  useEffect(() => {
    requestCardThmbnail();
    setSelectedOption('THUMB_A');
    initSetSelectedThumbnailSet();

    return () => {
      setCardSelectThumbnail(initCardthumbnailSelect());
      setSelectedThumbnailSet();
    };
  }, []);
}

// 썸네일 생성 진입 시 THUMB_A 그룹 첫번째 이미지 선택으로 저장
async function initSetSelectedThumbnailSet() {
  if (window.location.pathname.includes('/learning-management/cards/card-create')) {
    const iconGroup = await SharedApi.instance.findIcons('THUMB_A');
    const parseIconGroup = iconGroup.map((item) => {
      if (item.fileName === 'A_01.png') {
        return {
          checked: true,
          url: item.fileUri,
        };
      }

      return {
        checked: false,
        url: item.fileUri,
      };
    });
    setSelectedThumbnailSet(parseIconGroup);
  } else {
    const iconGroup = await SharedApi.instance.findIcons('THUMB_A');
    const parseIconGroup = iconGroup.map((item) => {
      return {
        checked: false,
        url: item.fileUri,
      };
    });
    setSelectedThumbnailSet(parseIconGroup);
  }
}

async function requestCardThmbnail() {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();

  const thumbnailIconGroup = await SharedApi.instance.findIconGroups('CARD_THUMB');
  const cardThumbnailImagePath = CardService.instance.cardQuery.thumbnailImagePath;

  setCardSelectThumbnail({
    ...cardSelectThumbnail,
    thumbnailImageUrl: cardThumbnailImagePath,
    thumbnailSelectOptions: getSelectOption(thumbnailIconGroup),
  });
}

export async function parsePanoptoCardThumbnailSelect(cubeIds: string[]) {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();

  const cubePanoptoIds = await CubeApi.instance.findCubePanoptoIds(cubeIds);

  if (cubePanoptoIds !== undefined) {
    const filteredCubePanoptoIds = cubePanoptoIds.filter((panopto) => panopto.mediaType === MediaType.InternalMedia);

    const parseCubePanoptoIds = filteredCubePanoptoIds.map((panopto) => {
      return {
        checked: false,
        cubeId: panopto.cubeId,
        panoptoSessionId: panopto.panoptoSessionId,
      };
    });

    setCardSelectThumbnail({
      ...cardSelectThumbnail,
      panoptoThumbnails: parseCubePanoptoIds,
    });
  }
}

export function onChangeRadio(_: React.FormEvent, data: CheckboxProps) {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();

  setCardSelectThumbnail({
    ...cardSelectThumbnail,
    selectRadio: data.value as CardThumbnailSelectRadio,
  });
}

// 이미지 파일 업로드 시 파일 정보 읽어와서 store에 저장하는 역할
export function onReadUploadThumbnailUrl(e: React.ChangeEvent<HTMLInputElement>) {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();

  if (e.target.files === null) {
    return;
  }

  const file = e.target.files[0];
  if (file === undefined) {
    return;
  }

  if (!CardthumbnailSizeValidator(file) || !extensionValidator(file)) {
    e.target.value = '';
    return;
  }

  const fileReader = new FileReader();

  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    setCardSelectThumbnail({
      ...cardSelectThumbnail,
      uploadThumbnail: {
        uploadThumbnailFile: file,
        uploadThumbnailDataUrl: fileReader.result as string,
      },
    });
  };
}

export function onInitUploadThumbnailUrl() {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();
  setCardSelectThumbnail({
    ...cardSelectThumbnail,
    uploadThumbnail: {} as UploadThumbnail,
  });
}

export function onSelectPanoptoThumbnailUrl(_: React.MouseEvent, data: CheckboxProps) {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();

  const parsePanoptoTHumbnalis = cardSelectThumbnail.panoptoThumbnails.map((thumbnail) => {
    if (thumbnail.panoptoSessionId === data.value) {
      return {
        ...thumbnail,
        checked: true,
      };
    }

    return {
      ...thumbnail,
      checked: false,
    };
  });

  setCardSelectThumbnail({
    ...cardSelectThumbnail,
    panoptoThumbnails: parsePanoptoTHumbnalis,
  });
}

export function onSelectThumbnailSetUrl(_: React.MouseEvent, data: CheckboxProps) {
  const selectedThumbnailSet = getSelectedThumbnailSet();

  if (selectedThumbnailSet === undefined) {
    return;
  }

  const parseSelectedThumbnailSet = selectedThumbnailSet.map((thumbnailSet) => {
    if (thumbnailSet.url === data.value) {
      return {
        ...thumbnailSet,
        checked: true,
      };
    }

    return {
      ...thumbnailSet,
      checked: false,
    };
  });

  setSelectedThumbnailSet(parseSelectedThumbnailSet);
}

export async function onUploadCardThumbnail() {
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();
  const selectedOption = getSelectedOption();

  const { uploadThumbnail, panoptoThumbnails, selectRadio } = cardSelectThumbnail;

  if (selectRadio === 'thumbnailSet') {
    if (selectedOption?.includes('THUMB')) {
      const selectedThumbnailSet = getSelectedThumbnailSet() || [];

      const findThumbnail = find(selectedThumbnailSet, { checked: true });

      if (findThumbnail === undefined) {
        return CardService.instance.cardQuery.thumbnailImagePath;
      }

      return findThumbnail.url;
    }

    if (selectedOption === 'panopto') {
      const findThumbnail = find(panoptoThumbnails, { checked: true });

      if (findThumbnail === undefined) {
        return CardService.instance.cardQuery.thumbnailImagePath;
      }

      const parsePanoptoUrl = await SharedApi.instance.panoptoThumbnailUpload(findThumbnail.panoptoSessionId);
      return parsePanoptoUrl;
    }
  }

  if (selectRadio === 'upload' && !isEmpty(uploadThumbnail)) {
    const formData = new FormData();
    formData.append('file', uploadThumbnail.uploadThumbnailFile);
    const parseUploadUrl = await SharedApi.instance.thumbnailUpload(formData);

    return parseUploadUrl;
  }

  return CardService.instance.cardQuery.thumbnailImagePath;
}

export function getPanoptoThumbnailUrl(panoptoUrl: string) {
  return `https://sku.ap.panopto.com/Panopto/Services/FrameGrabber.svc/FrameRedirect?objectId=${panoptoUrl}&mode=Delivery&random=0.855699771948019&usePng=False`;
}

export function getThumbnailSetUrl(thumbnailSetUrl: string) {
  return `${getImagePath()}${thumbnailSetUrl}`;
}

export function getPreviewThumbnailUrl() {
  const selectedOption = getSelectedOption();
  const selectedThumbnailUrl = CardService.instance.cardQuery.thumbnailImagePath;
  const cardSelectThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();

  if (selectedOption?.includes('THUMB')) {
    const selectedThumbnailSet = getSelectedThumbnailSet() || [];
    const url = selectedThumbnailSet.filter((thumbnail) => thumbnail.checked === true)[0]?.url || '';

    if (isEmpty(url)) {
      // 수정 시 기존 선택된 썸네일이 있으면 해당 썸네일 url을 return
      return getThumbnailSetUrl(selectedThumbnailUrl);
    }
    return getThumbnailSetUrl(url);
  }

  if (selectedOption === 'panopto') {
    const panoptoThumbnail = getCardSelectThumbnail() || initCardthumbnailSelect();
    const url = panoptoThumbnail.panoptoThumbnails.filter((a) => a.checked === true)[0]?.panoptoSessionId || '';

    if (isEmpty(url)) {
      // 수정 시 기존 선택된 썸네일이 있으면 해당 썸네일 url을 return
      return getThumbnailSetUrl(selectedThumbnailUrl);
    }
    return getPanoptoThumbnailUrl(url);
  }

  return '';
}

export async function onChangeSelectThumbnailSet(_: React.SyntheticEvent, data: DropdownProps) {
  const selectedOption = data.value as string;

  if (selectedOption.includes('THUMB')) {
    const iconGroup = await SharedApi.instance.findIcons(selectedOption);
    const parseIconGroup = iconGroup.map((item) => {
      return {
        checked: false,
        url: item.fileUri,
      };
    });
    setSelectedOption(selectedOption);
    setSelectedThumbnailSet(parseIconGroup);
    return;
  }

  setSelectedOption('panopto');
}
