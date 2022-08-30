import { reactAlert, reactConfirm } from '@nara.platform/accent';
import { EXTENSION_WHITELIST, DepotFileViewModel } from '@nara.drama/depot';

const EXTENSION = {
  DOCUMENT: 'xlsx|xls|xlsm|ppt|pptx|pdf|doc|docx|zip',
  PDF: 'pdf',
};

export function sizeValidator(file: File) {
  if (file.size > 1024 * 1024 * 10) {
    reactAlert({ title: '알림', message: '10MB 이하의 파일을 업로드 해주세요!!!!' });
    return false;
  }
  return true;
}

export function CardthumbnailSizeValidator(file: File) {
  if (file.size > 307200) {
    reactAlert({ title: '알림', message: '300KB 이하의 파일을 업로드 해주세요!!!!' });
    return false;
  }
  return true;
}

export function extensionValidator(file: File) {
  if (!file.name.toLowerCase().match(EXTENSION_WHITELIST)) {
    reactAlert({ title: '알림', message: `${file.type} 형식은 업로드 할 수 없습니다.` });
    return false;
  }
  return true;
}

export function extensionValidatorByDocument(file: File) {
  // console.log(file);

  const extension = file.name && file.name.substring(file.name.lastIndexOf('.') + 1);

  if (!file.name.match(EXTENSION.DOCUMENT)) {
    reactAlert({ title: '알림', message: `${extension} 형식은 업로드 할 수 없습니다.` });
    return false;
  }
  return true;
}

export function extensionValidatorPDF(file: File) {
  // console.log(file);

  const extension = file.name && file.name.substring(file.name.lastIndexOf('.') + 1);

  if (!file.name.match(EXTENSION.PDF)) {
    reactAlert({ title: '알림', message: `${extension} 형식은 업로드 할 수 없습니다.` });
    return false;
  }
  return true;
}

export function duplicationValidator(file: File, depotFiles: DepotFileViewModel[] | undefined) {
  return new Promise((resolve) => {
    if (!depotFiles || !depotFiles.some((depotFile) => depotFile.name === file.name)) {
      resolve(true);
    } else {
      reactConfirm({
        title: '알림',
        message: '중복된 파일이름이 존재합니다. 덮어쓰시겠습니까?',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    }
  });
}

export function multiFileValidator(file: File, depotFiles: DepotFileViewModel[] | undefined) {
  return new Promise((resolve) => {
    if (!depotFiles || depotFiles.length === 0) {
      resolve(true);
    } else {
      reactAlert({
        title: '알림',
        message: '1개의 파일만 등록할 수 있습니다. 등록된 파일을 삭제 후 다시 시도해 주세요',
        onClose: () => resolve(false),
      });
    }
  });
}

export function sizeWithDuplicationValidator(file: File, depotFiles: DepotFileViewModel[] | undefined) {
  if (file.size > 1024 * 1024 * 20) {
    reactAlert({ title: '알림', message: '20MB 이하의 파일을 업로드 해주세요.' });
    return false;
  }

  return new Promise((resolve) => {
    if (!depotFiles || !depotFiles.some((depotFile) => depotFile.name === file.name)) {
      resolve(true);
    } else {
      reactConfirm({
        title: '알림',
        message: '중복된 파일이름이 존재합니다. 덮어쓰시겠습니까?',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    }
  });
}

export default {
  sizeValidator,
  extensionValidator,
  duplicationValidator,
  extensionValidatorByDocument,
  extensionValidatorPDF,
  multiFileValidator,
  sizeWithDuplicationValidator,
};
