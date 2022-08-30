import { reactAlert } from '@nara.platform/accent';
import { FileUploadType } from 'shared/model';
import { SharedApi } from 'shared/present';
import { getCheckedCinerooms } from '../cineroomCheckbox/cineroomCheckbox.stores';
import { getPortletContentItems, setPortletContentItems } from './portletContentCreate.stores';

export async function onChangeImage(contentNo: number, file: File) {
  if ((await validateImage(file)) === false) {
    return;
  }
  const contentItems = getPortletContentItems();
  if (contentItems === undefined) {
    return;
  }
  const targetItem = contentItems.find((item) => item.contentNo === contentNo);
  if (targetItem === undefined) {
    return;
  }

  const sharedApi = SharedApi.instance;
  const formData = new FormData();
  formData.append('file', file);

  sharedApi.uploadFile(formData, FileUploadType.Toktok).then((path) => {
    targetItem.imageUrl = path;
    const nextItems = contentItems.map((item) => {
      if (item.contentNo === contentNo) {
        return targetItem;
      }
      return item;
    });
    setPortletContentItems(nextItems);
  });
}

export function onChangeDescription(contentNo: number, e: React.ChangeEvent<HTMLInputElement>) {
  const contentItems = getPortletContentItems();
  if (contentItems === undefined) {
    return;
  }
  const targetItem = contentItems.find((item) => item.contentNo === contentNo);
  if (targetItem === undefined) {
    return;
  }
  targetItem.description = e.currentTarget.value;
  const nextItems = contentItems.map((item) => {
    if (item.contentNo === contentNo) {
      return targetItem;
    } else {
      return item;
    }
  });
  setPortletContentItems(nextItems);
}

export function onChangeLinkUrl(contentNo: number, e: React.ChangeEvent<HTMLInputElement>) {
  const contentItems = getPortletContentItems();
  if (contentItems === undefined) {
    return;
  }
  const targetItem = contentItems.find((item) => item.contentNo === contentNo);
  if (targetItem === undefined) {
    return;
  }
  targetItem.linkUrl = e.currentTarget.value;
  const nextItems = contentItems.map((item) => {
    if (item.contentNo === contentNo) {
      return targetItem;
    }
    return item;
  });
  setPortletContentItems(nextItems);
}

export function onAddCotent(contentNo: number) {
  const contentItems = getPortletContentItems();
  if (contentItems === undefined) {
    return;
  }
  const targetIndex = contentItems.findIndex((item) => item.contentNo === contentNo);
  const maxContentNoItem = contentItems.reduce((prev, curr) => (prev.contentNo > curr.contentNo ? prev : curr));
  const nextContentNo = maxContentNoItem.contentNo + 1;

  contentItems.splice(targetIndex + 1, 0, {
    contentNo: nextContentNo,
    imageUrl: '',
    description: '',
    linkUrl: 'https://int.mysuni.sk.com/login?contentUrl=',
  });
  setPortletContentItems([...contentItems]);
}

export function onRemoveContent(contentNo: number) {
  const contentItems = getPortletContentItems();
  if (contentItems === undefined) {
    return;
  }
  const nextItems = contentItems.filter((item) => item.contentNo !== contentNo);
  setPortletContentItems(nextItems);
}

const DEFAULT_MAX_SIZE = 1024 * 1024 * 0.3;
const TOKTOK_MAX_SIZE = 1024 * 1024 * 0.1;

const DEFAULT_FIT_WIDTH = 160;
const TOKTOK_FIT_WIDTH = 124;

const DEFAULT_FIT_HEIGHT = 94;
const TOKTOK_FIT_HEIGHT = 69;

const VALID_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif'];

export async function validateImage(file: File) {
  if (!file || !(file instanceof File)) {
    return false;
  }

  let maxSize = DEFAULT_MAX_SIZE;
  let fitWidth = DEFAULT_FIT_WIDTH;
  let fitHeight = DEFAULT_FIT_HEIGHT;

  const checkedCinerooms = getCheckedCinerooms();
  if (checkedCinerooms !== undefined && checkedCinerooms.includes('ne1-m2-c2')) {
    maxSize = TOKTOK_MAX_SIZE;
    fitWidth = TOKTOK_FIT_WIDTH;
    fitHeight = TOKTOK_FIT_HEIGHT;
  }

  return (
    validateExtension(file, VALID_EXTENSIONS) === true &&
    validateMaxSize(file, maxSize) === true &&
    (await validateWidthHeight(file, fitWidth, fitHeight)) === true
  );
}

export function validateExtension(file: File, extensions: string[]) {
  let result = true;
  const indexOfDot = file.name.lastIndexOf('.');
  const targetExtension = file.name.substring(indexOfDot + 1, file.name.length).toLowerCase();
  if (extensions.includes(targetExtension) === false) {
    result = false;
    reactAlert({
      title: '이미지 업로드 안내',
      message: 'JPG, GIF, PNG 파일을 등록하실 수 있습니다.',
    });
  }
  return result;
}

export function validateMaxSize(file: File, maxSize: number) {
  let result = true;
  if (file.size > maxSize) {
    result = false;
    const messageMaxSize = maxSize === DEFAULT_MAX_SIZE ? 300 : 100;
    reactAlert({
      title: '이미지 업로드 안내',
      message: `최대 ${messageMaxSize}kb 용량의 파일을 등록하실 수 있습니다.`,
    });
  }
  return result;
}

export async function validateWidthHeight(file: File, width: number, height: number) {
  const base64 = await getBase64(file);
  const result = await checkWidthHeight(base64, width, height);
  if (result === false) {
    reactAlert({
      title: '이미지 업로드 안내',
      message: `파일 등록 시, ${width}x${height} 크기의 파일을 등록해 주세요.`,
    });
  }
  return result;
}

export function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      resolve(e.target?.result as string);
    };
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
}

export function checkWidthHeight(src: string, width: number, height: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      resolve(image.naturalWidth === width && image.naturalHeight === height);
    };
    image.onerror = reject;
  });
}
