import { alert, AlertModel } from '../components/AlertConfirm';
import { FileSizeModel } from '../model/FileSizeModel';

function readFile(file: File): Promise<string> {
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

function readImage(filePath: string, fitWidth: number, fitHeight: number): Promise<boolean> {
  //
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = filePath;

    image.onload = () => {
      resolve(image.naturalWidth === fitWidth && image.naturalHeight === fitHeight);
    };
  });
}

export async function fileSizeValidate(file: File, fileSize: FileSizeModel, onClose?: () => void) {
  //
  const { width, height } = fileSize;
  const filePath = await readFile(file);
  const result = await readImage(filePath, width, height);
  if (!result) {
    alert(
      AlertModel.getCustomAlert(
        true,
        '파일 크기 제한 안내',
        `${width} X ${height} 크기의 파일만 업로드 가능합니다.`,
        '확인',
        () => {
          onClose && onClose();
        }
      )
    );
    return false;
  }
  return true;
}
